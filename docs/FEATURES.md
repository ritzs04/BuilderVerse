# Features

Every feature with the file that implements it — useful for demo walkthroughs and interview answers.

## 1. Marketing site (public)

| Feature | File |
| --- | --- |
| Landing page: hero, feature grid, paths preview, social proof, CTAs | `src/app/page.tsx` |
| About page: story, principles, how to use it | `src/app/about/page.tsx` |
| Auth pages + client forms with server-action states | `src/app/(auth)/*/page.tsx`, `src/components/auth-forms.tsx` |
| Light/dark theme toggle (SSR-safe) | `src/components/theme-toggle.tsx` |

## 2. Accounts, onboarding & sessions

| Feature | File |
| --- | --- |
| 4-step onboarding: Welcome → Builder's Oath → account → learning preferences | `src/components/auth-forms.tsx` |
| Builder's Oath ("I am a Builder") shown before registration | `src/components/auth-forms.tsx` (step 2) |
| Unique Builder Passport ID (`BV-000001`) assigned at signup + backfill migration | `nextBuilderId()` in `src/lib/db.ts`, `signupAction` |
| Builder Passport celebration page after signup (first lesson + today's mission) | `src/app/(app)/welcome/page.tsx` |
| Learning preferences: experience, goal, study time, topics (optional, editable) | `src/lib/validation.ts` (`preferencesSchema`), `updateLearningPreferencesAction` |
| Signup / login (email **or** username), logout, forgot & reset password | `src/app/actions/auth.ts` |
| Validation schemas (zod) | `src/lib/validation.ts` |
| bcrypt hashing, session create/verify/expire | `src/lib/auth.ts` |
| Route guard for the whole app area | `src/app/(app)/layout.tsx` |

### Roles & permissions (§3 of the product spec)

BuilderVerse ships **one implemented role: Student / Builder**. Every account gets it
by default at registration — nothing grants elevated rights by signing up first or by
editing a value in the browser.

| Permission | Student | Administrator | Notes |
| --- | --- | --- |
| Oath, profile, Builder ID, learning paths, lessons, quizzes | ✅ | |
| Daily missions, Thinking Gym, Error Companion, guided builds | ✅ | |
| XP, levels, badges, Ideas Vault, personal ideas, AI help | ✅ | |
| Change their own role | ❌ | `setUserRoleAction` is gated on `requireAdminOrThrow()` | ✅ | server-side only |
| Read another student's private data | ❌ | every server action scopes to `requireUserOrThrow().id` |
| Award themselves XP | ❌ | XP is only ever written server-side by `reward()` |
| Edit platform content | ❌ | content is source-controlled code, not user-editable |

**Security model.** Authorisation is server-side, not cosmetic: hiding a button is not
treated as security. Every mutating server action re-derives the acting user from the
session (`requireUserOrThrow`) and scopes its `WHERE user_id = ?` to it, so a forged
request cannot reach another builder's rows or fabricate progress.

**Administrator — implemented via explicit allowlist.** BuilderVerse ships a real admin area, but promotion is deliberately conservative: nobody becomes an administrator by registering, and the browser can never grant itself the role. Instead:

- Promotion is an **explicit, one-directional environment choice**. An account is granted
  `admin` only if its email is listed in the `ADMIN_EMAILS`
  (comma-separated) variable; removing an email later never silently strips an existing administrator.
- `Student` cannot see `/admin` at all (app-shell only renders the admin link when `isAdmin` is true), and any student who types `/admin` lands on `/dashboard`.
- **Every** administrative action starts by re-deriving the session's user
  (`requireAdminOrThrow`) and checking the role server-side against the database row —
  not the client. There is no `role` column that the client can edit.
- Content authoring stays in version control (`src/content/*`).
- The platform overview (`/admin`) shows aggregated statistics (users, administrators, XP,
  learning activity) without exposing any individual's private data.
- **The founder email is listed in `.env.example` as the sole administrator by default**,
  matching a single-owner deployment. To add an owner, set `ADMIN_EMAILS` in your
  environment.

**Mentor — planned, not implemented.** No mentor role, and no fake mentor accounts: the
platform must not imply real mentors are available when they are not. A future mentor role
would be read-mostly (guidance, project review, feedback) with explicit per-student
consent before any private data is visible, and would still be enforced server-side.

## 3. Learn (lessons)

| Feature | File |
| --- | --- |
| Path overview (6 paths, progress per path) | `src/app/(app)/learn/page.tsx`, `src/app/(app)/learn/[path]/page.tsx` |
| Lesson page: objectives, explanation, analogy, code example, run-in-lab, challenge, mistakes, completion criteria | `src/app/(app)/learn/[path]/[lesson]/page.tsx`, `src/content/lessons/*.ts` |
| Try-it lab: edit code, see live output | `src/components/lesson-lab.tsx`, `src/components/code-block.tsx` |
| Quiz with per-question feedback, score and XP | `src/components/lesson-lab.tsx` + `submitQuizAction` |
| Hints (cost XP) and completion tracking | `src/lib/gamification.ts` |

## 4. Thinking Gym

| Feature | File |
| --- | --- |
| Browser with search + difficulty/category filters | `src/components/thinking/challenge-browser.tsx` |
| Answer box graded against a model answer, hints, model solution reveal | `src/components/thinking/thinking-lab.tsx` |
| Content: 10 reasoning puzzles, category labels | `src/content/thinking.ts` |

## 5. Error Companion (debugging)

| Feature | File |
| --- | --- |
| Puzzle browser (language, difficulty filters) | `src/components/debug/debug-browser.tsx` |
| Diagnose-first flow: write the bug theory → submit → reveal fix, cause, prevention | `src/components/debug/debug-lab.tsx` |
| Content: 10 real bugs (typo, coercion, off-by-one, specificity, `missing await`, shared default… ) | `src/content/debug.ts` |

## 6. Guided builds (projects)

| Feature | File |
| --- | --- |
| Project cards with difficulty/est. time/XP | `src/app/(app)/build/page.tsx` |
| Step checklist with persistent ticks and XP | `src/components/projects/checklist.tsx` + `toggleProjectStepAction` |
| Content: 5 projects × step-by-step instructions | `src/content/projects.ts` |
| Testing checklist per project (§11) | `src/content/projects.ts` → `testingChecklist` |
| Common mistakes + the fix for each (§11) | `src/content/projects.ts` → `commonMistakes` |
| Reflection questions before moving on (§11) | `src/content/projects.ts` → `reflectionQuestions` |
| Rendered on the project page | `src/app/(app)/build/[slug]/page.tsx` |

## 7. Ideas Vault

| Feature | File |
| --- | --- |
| Idea browser: search, difficulty/category filters, bookmark toggle | `src/components/ideas/idea-browser.tsx` |
| Idea detail: problem, MVP scope, stretch features, learning goals | `src/app/(app)/ideas/[slug]/page.tsx` |
| Content: 20 ideas | `src/content/ideas.ts` |
| Personal ideas: add your own, remove them; newest first (§14) | `src/components/ideas/personal-ideas.tsx`, `addPersonalIdeaAction`/`deletePersonalIdeaAction`, table `personal_ideas` |

## 8. Builder AI

| Feature | File |
| --- | --- |
| Chat UI with streaming-style pending state | `src/components/assistant/chat.tsx` |
| Action: env-configured OpenAI-compatible call + persisted history | `src/app/actions/ai.ts`, table `ai_conversations` |
| "Not configured" graceful state | `AiResult.unavailable` branch |

## 9. Gamification

| Feature | File |
| --- | --- |
| XP, levels (8), badges (14), streaks, notifications | `src/lib/gamification.ts` |
| Daily mission (one per day, once per user) | `src/content/missions.ts` + `completeMissionAction` |
| Daily Missions hub: today's mission, rules, streak, completion history | `src/app/(app)/missions/page.tsx`, `getMissionHistory()` in `src/lib/queries.ts` |
| Dashboard: welcome, mission card, continue-where-you-left-off, stats, recommendations | `src/app/(app)/dashboard/page.tsx` |
| Sidebar XP/level bar, notification bell, streak pill | `src/components/app-shell.tsx`, `src/components/notification-bell.tsx` |
| Anti-farming rules (transition-only XP, hint penalties) | `src/lib/gamification.ts` |
| Progress history: day-grouped XP ledger + "where your XP came from" breakdown (§13) | `src/app/(app)/progress/page.tsx`, `getXpHistory()`/`getXpByKind()`, table `xp_events` |

## 10. Profile, portfolio, settings

| Feature | File |
| --- | --- |
| Public profile: stats, badges, completed paths, portfolio | `src/app/(app)/profile/page.tsx` |
| Portfolio manager (add/remove projects) | `src/components/profile/portfolio-manager.tsx` |
| Settings: profile, preferences, password, danger zone (delete account) | `src/components/settings/settings-forms.tsx` |
| Server-side updates with validation | `src/app/actions/account.ts` |

## 11. Search & shell

| Feature | File |
| --- | --- |
| Content-wide search grouped by type | `src/app/(app)/search/page.tsx`, `searchContent()` in `src/content/index.ts` |
| App shell: sidebar (Dashboard, Learn, Thinking Gym, Error Companion, Projects, Daily Missions, Ideas Vault, Builder AI, My Progress, Builder Passport, Settings), topbar, search, bell, avatar, mobile bottom nav, active states | `src/components/app-shell.tsx` |
| Responsive design (mobile bottom nav, floating streak pill) | `globals.css` tokens + shell layout |

## 12. Quality

| Feature | File |
| --- | --- |
| ESLint + typecheck scripts | `npm run lint`, `npm run typecheck` |
| Playwright e2e: landing, redirects, full learner journey, mobile/dark/search | `tests/e2e.spec.ts`, `playwright.config.ts` |
