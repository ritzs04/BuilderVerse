# Interview cheat sheet — BuilderVerse

Answers you can say out loud. Every claim maps to code in this repo.

---

## The 30-second pitch

> "BuilderVerse is an interactive programming platform — learn by doing. It has 27 lessons across six paths with in-browser code labs and quizzes, a reasoning gym, a debugging playground where you diagnose real bugs first, five guided projects with checklists, an ideas vault, and a gamified layer of XP, levels, badges and daily missions. It's built with Next.js 16 App Router, React 19, TypeScript, Tailwind v4 and SQLite. Content lives as typed TypeScript in the repo and only user data goes to the database. Everything is authenticated with session cookies and every mutation is a zod-validated server action, and it's covered by Playwright end-to-end tests."

## Demo script (2 minutes)

1. `/` → landing page, toggle dark mode.
2. Sign up → dashboard shows daily mission → complete it → XP animates.
3. Learn → HTML lesson → run the try-it lab → submit the quiz → score + XP.
4. Debug puzzle → write a diagnosis → reveal fix and prevention.
5. Build → tick a checklist step → progress persists across reload.
6. Profile → add a portfolio project → Settings → change headline.
7. Log out → `/dashboard` redirects to login.

---

## "Tell me about the architecture"

> "Four layers. `src/content` is the curriculum as typed data — no CMS, no fetch. `src/lib` is the domain: db, auth, gamification, queries. `src/app/actions` holds all mutations as server actions. Pages are server components that read data and pass plain props to small client components that only hydrate where there's interactivity."

## "Why Server Components?"

> "Most of the app is data display — lessons, lists, dashboards. Server components ship zero JS for that, render on the server and read the DB directly. Client components are only used for interaction: quiz state, hints, chat, forms. That keeps the bundle small and makes the security boundary obvious — the DB never gets imported into the browser."

## "How does auth work?"

> "Email or username plus password, hashed with bcrypt at cost 12. On login I create a 32-byte random token, store it in a `sessions` table with a 30-day expiry, and set it as an httpOnly cookie. `requireUser()` runs in the app layout and in every server action, so both pages and mutations are protected. Password resets use a single-use 30-minute token."

## "How do server actions fit in?"

> "They're the only mutation entry point — a POST to the page that runs an async function on the server. I validate every input with zod, check the session again, write to SQLite, then call `revalidatePath` so the client sees fresh data. No REST API layer to maintain, and they're typed end-to-end."

## "Why SQLite? Wouldn't you use Postgres?"

> "For a self-contained portfolio app, SQLite is perfect: zero config, one file, trivial to demo and reset, and the synchronous `better-sqlite3` API avoids connection overhead. The data access is isolated in `src/lib/db.ts` behind `all/first/run` helpers, so swapping to Postgres is a contained change — the schema is 13 small tables."

## "How do you prevent XP farming?"

> "XP is only granted on a **false → true transition** — re-submitting a correct answer or unticking a checklist gives nothing. Hints cost 5 XP each, and daily missions are locked by a composite primary key `(user, mission, date)` so the database enforces one completion per day."

## "How does the AI feature work?"

> "It calls any OpenAI-compatible chat completions endpoint, configured purely through env vars — key, base URL, model. The system prompt injects the learner's context. History is persisted in a table so it survives reloads, and it returns a discriminated union including an `unavailable` state, so with no key the UI shows 'not configured' instead of crashing. The whole app works without AI."

## "How is it tested?"

> "`eslint` and `next typegen && tsc --noEmit` for static checks, plus Playwright running against a **production build**. The main test signs up a fresh user and drives the real journey — mission, quiz, thinking puzzle, debug reveal, checklist, bookmark, portfolio, settings, logout — asserting real database-backed state changes. Two earlier failures were locator issues, not app bugs: strict-mode label collisions and a button whose `aria-label` changes on toggle. GitHub Actions runs all of it plus a Docker image build + container health smoke test on every push."

## "How would you deploy it?"

> "Two ways, same codebase. The live demo runs on **Vercel** (auto-deploy from `master`, SQLite at ephemeral `/tmp` — demo data resets, which is fine for a demo). For a persistent install it's a **Docker image**: a multi-stage Dockerfile (install, build, then a slim `node:22-bookworm-slim` runtime with production-only deps, running non-root, serving via `next start`). The SQLite file sits in a mounted volume so data survives redeploys, and `GET /api/health` — which pings the database — drives the container healthcheck. `docker compose up -d --build` is the entire deploy; CI builds the image and smoke-tests health on every push. I'd put Caddy or nginx in front for TLS. The config is env-driven (`DATABASE_PATH`, `APP_URL`) and the DB layer is isolated, so the same code runs on both — and swapping SQLite for Postgres later is one module."

## "What's in the database?"

> "13 tables, all user data, every one keyed to `user_id` with `ON DELETE CASCADE`. Gamification counters are denormalised onto `users` because every page reads XP; relationships like badges and bookmarks are junction tables. WAL mode is on, and foreign keys are enforced by pragma."

## "What did you learn / what was hard?"

- Next 16 breaking changes: `await cookies()`/`params`, `next lint` removed, `"use client"` boundaries — and one real bug: a `"use server"` file exporting a *type* made every route 500 until the helper moved to a plain module.
- Hydration safety: the theme toggle uses `useSyncExternalStore` because reading `localStorage` during render mismatches server HTML.
- React 19: `useActionState` for forms, `useTransition` for pending mutations.
- Playwright strict mode: a changing `aria-label` makes a label locator jump to a different element — scope to the container.

## "What would you add next?"

Real email delivery, Postgres + migrations for multi-user hosting, PWA/offline labs, per-learner spaced repetition, push-to-deploy (git tag → VPS rebuild), i18n, and richer AI feedback like per-line code review.

---

## HR / non-technical round

**Why this project?**
> "I wanted to build the tool I wished existed while learning — something that makes you *do* the thing instead of watching a video. It also let me prove I can ship a full product: design, database, auth, tests — not just components."

**How do you handle a deadline?**
> "I cut scope into a must-have core (learn + progress + auth) and nice-to-haves, ship the core first, then iterate. On this project, AI support was optional — it degrades gracefully instead of blocking the launch."

**Working in a team / disagreement?**
> "I default to writing down the trade-off and picking the option that's easiest to reverse. For example, hand-written SQL vs an ORM — I chose SQL because the schema is small, and documented the swap path for anyone who disagrees."

**Strengths / weakness?**
> Strength: "Finishing — I took this from an empty folder to a tested product." Weakness: "I can over-invest in polish; I've learned to timebox and ship the working version first."

**Where do you see yourself?**
> "Frontend or full-stack on a product team — close to users, where React and TypeScript depth matters, and where I can keep growing on the systems side."

---

## Numbers to remember

| | |
| --- | --- |
| Lessons / paths | 27 across 6 (HTML, CSS, JavaScript, DOM, APIs, Git) |
| Thinking puzzles / debug puzzles | 10 / 10 |
| Guided projects / ideas | 5 / 20 |
| Badges / levels / daily missions | 14 / 8 / 10 rotating |
| Database tables | 13 |
| Routes | 22 pages (4 auth, 2 public, 16 app) |
| Tests | 4 Playwright suites (full journey included) |
| Stack | Next.js 16, React 19, TS, Tailwind v4, better-sqlite3, bcrypt, zod |
