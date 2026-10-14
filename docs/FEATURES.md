# Features

Every feature with the file that implements it — useful for demo walkthroughs and interview answers.

## 1. Marketing site (public)

| Feature | File |
| --- | --- |
| Landing page: hero, feature grid, paths preview, social proof, CTAs | `src/app/page.tsx` |
| About page: story, principles, how to use it | `src/app/about/page.tsx` |
| Auth pages + client forms with server-action states | `src/app/(auth)/*/page.tsx`, `src/components/auth-forms.tsx` |
| Light/dark theme toggle (SSR-safe) | `src/components/theme-toggle.tsx` |

## 2. Accounts & sessions

| Feature | File |
| --- | --- |
| Signup / login (email **or** username), logout, forgot & reset password | `src/app/actions/auth.ts` |
| Validation schemas (zod) | `src/lib/validation.ts` |
| bcrypt hashing, session create/verify/expire | `src/lib/auth.ts` |
| Route guard for the whole app area | `src/app/(app)/layout.tsx` |

## 3. Learn (lessons)

| Feature | File |
| --- | --- |
| Path overview (6 paths, progress per path) | `src/app/(app)/learn/page.tsx`, `src/app/(app)/learn/[path]/page.tsx` |
| Lesson page: explanation, analogy, code example, run-in-lab, challenge, mistakes | `src/app/(app)/learn/[path]/[lesson]/page.tsx`, `src/content/lessons/*.ts` |
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

## 7. Ideas Vault

| Feature | File |
| --- | --- |
| Idea browser: search, difficulty/category filters, bookmark toggle | `src/components/ideas/idea-browser.tsx` |
| Idea detail: problem, MVP scope, stretch features, learning goals | `src/app/(app)/ideas/[slug]/page.tsx` |
| Content: 20 ideas | `src/content/ideas.ts` |

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
| Dashboard: welcome, mission card, continue-where-you-left-off, stats, recommendations | `src/app/(app)/dashboard/page.tsx` |
| Sidebar XP/level bar, notification bell, streak pill | `src/components/app-shell.tsx`, `src/components/notification-bell.tsx` |
| Anti-farming rules (transition-only XP, hint penalties) | `src/lib/gamification.ts` |

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
| App shell: sidebar, topbar, search, bell, avatar, mobile bottom nav, active states | `src/components/app-shell.tsx` |
| Responsive design (mobile bottom nav, floating streak pill) | `globals.css` tokens + shell layout |

## 12. Quality

| Feature | File |
| --- | --- |
| ESLint + typecheck scripts | `npm run lint`, `npm run typecheck` |
| Playwright e2e: landing, redirects, full learner journey, mobile/dark/search | `tests/e2e.spec.ts`, `playwright.config.ts` |
