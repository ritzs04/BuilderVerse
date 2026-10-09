# BuilderVerse

**Learn. Think. Build.** — an interactive programming learning platform where students learn by *doing*: read a concept, run the code in an in-browser lab, solve puzzles, debug real errors, ship guided projects, and turn ideas into a public portfolio.

Built as a portfolio/interview project with a production-shaped stack: **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · SQLite · Server Actions**.

[![CI](https://github.com/ritzs04/BuilderVerse/actions/workflows/ci.yml/badge.svg)](https://github.com/ritzs04/BuilderVerse/actions) [![Live](https://img.shields.io/badge/live-builder--verse--delta.vercel.app-brightgreen)](https://builder-verse-delta.vercel.app) [Live site](https://builder-verse-delta.vercel.app) · [Repo](https://github.com/ritzs04/BuilderVerse)

> Fully self-contained: no external services required. Builder AI (chat tutor) activates only when you provide an OpenAI-compatible API key.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

The SQLite database is created automatically on first request at `data/builderverse.db`.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`next lint` is gone in Next 16) |
| `npm run typecheck` | `next typegen && tsc --noEmit` (route types are generated, not committed) |
| `npm run test:e2e` | Playwright end-to-end suite (builds + serves on port 3111) |

### Optional: enable Builder AI

```bash
cp .env.example .env.local
# set AI_API_KEY (and optionally AI_BASE_URL, AI_MODEL)
```

Without a key the assistant explains exactly how to enable it and every other feature keeps working.

---

## What's inside

| Area | What you get |
| --- | --- |
| **Learn** | 6 paths (HTML, CSS, JavaScript, DOM, APIs, Git) · 27 lessons, each with explanation, analogy, runnable example, try-it lab, challenge, common mistakes and a quiz |
| **Thinking Gym** | 10 reasoning puzzles graded against model answers — plain English, no code needed |
| **Error Companion** | 10 real-world bug puzzles (typos, `==` coercion, off-by-one, `missing await`, specificity…): diagnose first, then reveal |
| **Guided builds** | 5 step-by-step projects (Calculator, Weather App, Password Manager, Chat App, Portfolio) with checklists and XP |
| **Ideas Vault** | 20 product ideas with problem framing, MVP scope, difficulty and bookmarking |
| **Builder AI** | Chat tutor with conversation history (env-configured, graceful fallback) |
| **Gamification** | XP, 8 levels, 14 badges, daily missions, streaks, notifications, anti-farming rules |
| **Profile & settings** | Public portfolio, headline/avatar, preferences, password change, account deletion |
| **Search** | Content-wide search across lessons, projects, puzzles and ideas |

Everything a learner does persists: session auth (httpOnly cookie, bcrypt), lesson progress, challenge attempts, checklists, bookmarks, portfolio and preferences.

---

## Project structure

```
src/
  app/
    page.tsx            # marketing landing
    about/              # about page
    (auth)/             # login, signup, forgot/reset password
    (app)/              # authenticated shell (auth guard + sidebar/topbar/mobile nav)
      dashboard/ learn/ think/ debug/ build/ ideas/ assistant/ search/ profile/ settings/
    actions/            # server actions: auth, progress, account, ai
  components/           # ui.tsx primitives, shell, client components per feature
  content/              # curriculum AS CODE — all static content + search
    lessons/            # per-path lesson content
  lib/                  # db, auth, queries, gamification, matches, validation
tests/                  # Playwright e2e
docs/                   # architecture, features, database, interview cheat sheet
Dockerfile              # multi-stage production image (standalone output)
docker-compose.yml      # one-command deploy with a persistent data volume
```

**Design rule:** content is code (typed TypeScript in `src/content/`), only *user data* lives in SQLite. See [docs/DATABASE.md](docs/DATABASE.md).

---

## Docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — layers, request flow, auth, XP rules, AI integration
- [docs/FEATURES.md](docs/FEATURES.md) — every feature mapped to the file that implements it
- [docs/DATABASE.md](docs/DATABASE.md) — schema, indexes, migration strategy
- [docs/INTERVIEW.md](docs/INTERVIEW.md) — question-by-question cheat sheet for HR/tech interviews

## Testing

```bash
npm run test:e2e
```

Five Playwright tests cover the marketing page, anonymous redirects, the **full learner journey** (signup → daily mission → lesson quiz → thinking puzzle → debug reveal → project checklist → bookmark → portfolio → settings → logout), the mobile shell + dark mode + search, and an **exactly-one-h1 accessibility check across all 16 app routes**. CI runs lint, typecheck, build, the e2e suite and a Docker image build + container health-check on every push.

## Deploy with Docker

The production build uses Next.js `output: "standalone"`, so the image only contains what the server needs:

```bash
docker compose up -d --build    # http://localhost:3000
docker compose logs -f          # watch it boot
docker compose down             # stop (data volume is kept)
```

- The SQLite database lives in the `bv-data` named volume (`/app/data`), so it survives redeploys and image rebuilds.
- `/api/health` returns 200 only when the process is up **and** SQLite responds — it drives the image's `HEALTHCHECK`.
- Configuration is runtime env, not baked into the image: `DATABASE_PATH`, `APP_URL`, and optional `AI_API_KEY` / `AI_BASE_URL` / `AI_MODEL`.

**On a VPS** (any $5 tier, or a free Oracle Cloud ARM instance):

```bash
git clone https://github.com/ritzs04/BuilderVerse.git && cd BuilderVerse
docker compose up -d --build
# then put nginx/Caddy in front for TLS, e.g. reverse-proxy :3000 → https://yourdomain
```

Why Docker and not Vercel: this app is built around a real SQLite file, and serverless filesystems are read-only/ephemeral — a self-hosted container keeps the stack honest (and gives you a Docker story to tell in interviews).

## Notes

- Data lives in `data/` and is git-ignored; delete the file to reset all accounts.
