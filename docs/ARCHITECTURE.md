# Architecture

BuilderVerse is a single Next.js App Router application. One deployment serves the marketing site, the auth flow, the whole learning app and the SQLite database.

## Layers

```
src/content/*.ts  ── static curriculum (typed, tree-shakeable, no I/O)
        │
src/lib/          ── server-side domain: db, auth, queries, gamification, matches, validation
        │
src/app/actions/  ── server actions (the only entry points that mutate state)
        │
src/app/(app)/*   ── server components: fetch → compose → render
        │
src/components/   ── client components: forms, labs, optimistic UI ("use client" only where needed)
```

Rules that keep it honest:

1. **Content is code.** Lessons, puzzles, projects, ideas, badges, missions and levels are typed data in `src/content/`. Adding content is a TypeScript edit that gets type-checked and bundled — no CMS, no fetch, no seed step.
2. **Server components by default.** Pages are async server components that call `src/lib/queries.ts` and pass plain serialised props to client components. `"use client"` appears only where interactivity requires it (quiz state, hints, chat, forms, toggles).
3. **Mutations go through server actions.** Every write is a zod-validated async function in `src/app/actions/`. Client components call them via `useActionState` / `useTransition`, then `revalidatePath` refreshes the affected route.
4. **One data source.** `src/lib/db.ts` opens a single `better-sqlite3` database synchronously (fast, no pooling) and runs idempotent `CREATE TABLE IF NOT EXISTS` schema on boot — no migration framework needed for a single-binary app.

## Request flow

```
browser ──► Next route handler
             ├─ (app)/layout.tsx        await requireUser() → redirect("/login") if no session
             ├─ page.tsx (server)       getProgress(userId), content lookups
             ├─ client component        renders with props, user interactions
             └─ server action           zod parse → auth check → DB write → revalidatePath → XP reward
```

`params` and `cookies` are awaited (Next 16: they are Promises). Unknown slugs render `notFound()`.

## Authentication

- Credentials: email **or** username + password. Hashing with `bcryptjs` (cost 12).
- Session: random 32-byte token in an **httpOnly** cookie `bv_session`, stored in the `sessions` table with `expires_at` (30 days). Lookup happens on every protected request in `requireUser()`.
- Password reset: single-use token (30 min) in `password_resets`; with no mail provider configured the reset URL is surfaced in the UI (dev mode).
- Server actions re-check the session themselves — a forged request from another origin still needs the cookie.

## XP, streaks and anti-farming (`src/lib/gamification.ts`)

- XP is awarded only on a **false → true transition**: re-submitting a correct quiz, un-ticking a checklist box or un-bookmarking never mints XP.
- Hints cost: `xpGained = lessonXp − hintsUsed × 5`, floored at 0.
- `reward(userId, xp)` is the single XP entry point: it bumps `total_xp`, recomputes the level (8 levels), rolls new badges, extends the streak and inserts notifications.
- Missions: one per day (`missionForDate`), completed once — enforced with a unique row per `(user_id, mission_slug, date)`.

## Builder AI (`src/app/actions/ai.ts`)

- Configured purely from env: `AI_API_KEY`, `AI_BASE_URL` (default `https://api.openai.com/v1`), `AI_MODEL` (default `gpt-4o-mini`).
- Talks to any OpenAI-compatible `/chat/completions` endpoint; system prompt injects the learner's current context (path, level, recent struggles).
- Conversation is persisted in `ai_conversations` so history survives reloads.
- Returns a discriminated union: `{ ok: true, reply }` · `{ ok: false, error }` · `{ unavailable: true, reason }`, so the UI can render a friendly "not configured" state without throwing.

## Next.js 16 specifics (breaking changes respected)

- `await cookies()`, `await params`, `await searchParams`.
- `next lint` removed → `eslint .` wired as `npm run lint`.
- `"use server"` modules may only export async functions; type-only exports are fine (a type export accidentally put there 500'd every page once).
- `serverExternalPackages: ["better-sqlite3"]` in `next.config.ts` keeps the native module out of the bundler.
- Styling: Tailwind v4 CSS-first config (`@import "tailwindcss"` + `@theme` tokens in `globals.css`); no `tailwind.config.js`.

## Styling and design system

Design tokens (colors, radius, shadows, fonts) are declared as CSS custom properties with `--bv-*` names, surfaced through Tailwind `@theme`. Shared classes (`bv-card`, `bv-btn-primary`, `bv-input`, `bv-pill`, `bv-pre`, …) keep JSX readable. Dark mode is a `dark` class on `<html>`, persisted in `localStorage` and read during SSR with `useSyncExternalStore` to avoid hydration mismatch.

## Testing strategy

- `npm run lint` + `npm run typecheck` gate every change.
- Playwright (`npm run test:e2e`) runs against a **production build**, driving real server actions and asserting DB-backed state changes (XP awarded, checklist toggled, portfolio row added, logout clears the session).
- Two Playwright-safe pitfalls already solved: labels can resolve to multiple nodes (scope by role/section), and changing `aria-label` on a button makes label-based locators jump to a different element (scope to the card).

## Deployment

- The production build is served with `next start`. The multi-stage `Dockerfile` (deps → builder → runner) installs production-only dependencies, copies `.next/` plus `public/`, runs as the non-root `node` user, and `docker-compose.yml` mounts a named volume at `/app/data`.
- `better-sqlite3` is a *server-external* package that resolves its native binding at runtime from `node_modules` — the image keeps the full production dependency tree (dev dependencies pruned), and CI builds the image so the setup is verified on every push.
- `GET /api/health` returns 200 only when SQLite answers; it drives the image `HEALTHCHECK` and the CI container smoke test.
- Runtime config is env, never baked in: `DATABASE_PATH`, `APP_URL`, optional `AI_*`. The live demo runs on Vercel (auto-deploy from `master`, SQLite at ephemeral `/tmp`); Docker is the persistent self-hosted path.

## Deliberate trade-offs

| Choice | Why |
| --- | --- |
| SQLite + `better-sqlite3` | Zero-config, synchronous and fast; single-writer app; trivial to demo and reset |
| Content in the repo | Type safety, instant search, reviewable diffs; a CMS would add ops with no benefit at this scale |
| Server Actions over REST | One type-safe channel for mutations, no API routes to maintain, progressive enhancement |
| No ORM | The schema is 13 small tables; hand-written SQL is clearer and interview-friendly |
