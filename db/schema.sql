-- ============================================================================
-- BuilderVerse Database Schema
-- Run this in your Supabase project's SQL Editor (Dashboard → SQL Editor).
--
-- Tables created (in dependency order):
--   1. profiles          — display name, avatar, linked to Supabase auth.users
--   2. learning_progress — per-user completed lessons, projects, XP, streaks
--   3. projects          — student-built projects (Build My Own Project)
--   4. certificates      — issued certificates with verification data
--   5. certificate_events — audit log for issuance / reissue / revocation
--   6. backend_health_checks — minimal connectivity test table
--
-- Row Level Security (RLS) is enabled on every table. Users can only
-- read / write their own rows. The service-role key (server-side only)
-- bypasses RLS for certificate issuance and verification.
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Profiles
-- --------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Builder',
  avatar_emoji text not null default '🌱',
  bio text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Builder'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --------------------------------------------------------------------------
-- 2. Learning Progress
-- --------------------------------------------------------------------------
create table if not exists public.learning_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  completed_lesson_ids text[] not null default '{}',
  completed_project_ids text[] not null default '{}',
  xp integer not null default 0,
  streak_days integer not null default 0,
  last_active_date date,
  daily_goal_minutes integer not null default 25,
  updated_at timestamptz not null default now()
);

alter table public.learning_progress enable row level security;

create policy "Users can read their own progress"
  on public.learning_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.learning_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.learning_progress for update
  using (auth.uid() = user_id);

-- --------------------------------------------------------------------------
-- 3. Projects (Build My Own Project)
-- --------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  language text not null default 'General',
  status text not null default 'planning',  -- planning | in-progress | completed
  repo_url text default '',
  demo_url text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Users can CRUD their own projects"
  on public.projects for all
  using (auth.uid() = user_id);

create index if not exists idx_projects_user on public.projects(user_id);

-- --------------------------------------------------------------------------
-- 4. Certificates
-- --------------------------------------------------------------------------
create table if not exists public.certificates (
  id text primary key,  -- BV-YYYY-XXXXXX-C format, generated server-side
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  course_id text not null,
  course_name text not null,
  level text not null,  -- Course Graduate | Project Creator | Independent Builder
  template text not null default 'pink-dream',  -- pink-dream | coding-star | future-builder
  photo_data_url text,  -- compressed JPEG data URL (nullable for text-only certs)
  issued_at timestamptz not null default now(),
  revoked boolean not null default false,
  publicly_shared boolean not null default false,
  reissue_of text,  -- ID of the certificate this replaces (if reissued)
  replaced_by text  -- set on the OLD record when replaced
);

alter table public.certificates enable row level security;

-- Users can read their own certificates (even revoked ones, for history).
create policy "Users can read their own certificates"
  on public.certificates for select
  using (auth.uid() = user_id);

-- The service role (server-side issuance endpoint) handles INSERT and UPDATE.
-- No direct INSERT/UPDATE policies for authenticated users — all certificate
-- mutations go through the server-side API for eligibility verification.

create index if not exists idx_certs_user on public.certificates(user_id);
create index if not exists idx_certs_course on public.certificates(course_id);

-- --------------------------------------------------------------------------
-- 5. Certificate Events (audit log)
-- --------------------------------------------------------------------------
create table if not exists public.certificate_events (
  id uuid primary key default gen_random_uuid(),
  certificate_id text not null references public.certificates(id) on delete cascade,
  event_type text not null,  -- issued | reissued | revoked | restored
  performed_by uuid references auth.users(id),
  note text default '',
  created_at timestamptz not null default now()
);

alter table public.certificate_events enable row level security;

-- Only the service role writes audit events (from server endpoints).
-- Users can read events for their own certificates.
create policy "Users can read their own cert events"
  on public.certificate_events for select
  using (
    exists (
      select 1 from public.certificates c
      where c.id = certificate_id and c.user_id = auth.uid()
    )
  );

create index if not exists idx_cert_events_cert on public.certificate_events(certificate_id);

-- --------------------------------------------------------------------------
-- 6. Backend Health Check
-- --------------------------------------------------------------------------
create table if not exists public.backend_health_checks (
  id boolean primary key default true check (id = true),
  created_at timestamptz not null default now()
);

insert into public.backend_health_checks (id) values (true)
  on conflict (id) do nothing;

alter table public.backend_health_checks enable row level security;

revoke all on table public.backend_health_checks from anon, authenticated;

-- --------------------------------------------------------------------------
-- Helper: updated_at trigger for tables that need it
-- --------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_profiles
  before update on public.profiles
  for each row execute function public.touch_updated_at();

create trigger touch_learning_progress
  before update on public.learning_progress
  for each row execute function public.touch_updated_at();

create trigger touch_projects
  before update on public.projects
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- Done. After running this, set up your environment variables:
--
--   SUPABASE_URL                — your project URL
--   SUPABASE_SERVICE_ROLE_KEY   — server-side secret (never expose to browser)
--   VITE_SUPABASE_URL           — same URL, prefixed VITE_ so the frontend sees it
--   VITE_SUPABASE_ANON_KEY      — public anon key (safe for browser)
-- ============================================================================
