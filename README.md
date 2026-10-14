# 🌷 BuilderVerse — Learn. Think. Build.

> *"You do not need to be a topper to become a builder. Start where you are, learn one concept at a time, practise, solve problems, and build something of your own."*

BuilderVerse is a **free, project-based programming education platform** for students who find coding difficult, boring, or intimidating. It moves learners from confusion → understanding → practice → **independently building their own projects**.

**Every lesson is free. Forever.** No paywalls, no premium content, no artificial restrictions.

---

## ✨ Features

| Area | What students get |
|---|---|
| **Learning Paths** | HTML, CSS, JavaScript, DOM, APIs, Git & GitHub, Python, Java, C — each with real lessons, code examples, line explanations and quizzes |
| **Thinking Gym** | Logic & problem-solving puzzles (switches, fencepost, edge cases) with reasoning explanations |
| **Error Companion** | Friendly, never-shaming help for common errors + Sprout AI (Gemini) mentor with an offline fallback |
| **Guided Projects** | Progressively harder builds with checklists and skills gained |
| **Build My Own Project** | 14-step guided workspace with a 5-level graduated hint ladder, autosave, milestones, resume |
| **Project Idea Generator** | Ideas filtered by language, interest and level — saveable directly into Build My Own Project |
| **My Builder Portfolio** | Draft/publish entries, copyable summaries, skills backed only by *completed* work |
| **Graduation Studio** | Photo + text-only certificates, 3 templates, PNG/PDF export, QR verification, revocation |
| **My Showcase** | Honest LinkedIn announcements and social captions generated from real achievements |
| **Weekly Build Challenges** | Required-feature checklists; finished builds submit into Build My Own Project |
| **Builder identity** | XP, levels, streaks, badges, Learning Garden, journal, avatar — with **zero fake demo progress** |
| **Comeback-friendly** | Progress always survives breaks; no guilt-based messaging |

---

## 🚀 Run Locally

**Prerequisites:** [Node.js](https://nodejs.org) 18+ (or [Bun](https://bun.sh))

```bash
# 1. Install dependencies
npm install          # or: bun install

# 2. (Optional) Add your Gemini API key for the Sprout AI mentor.
#    The app works fully without it via the built-in educational fallback.
cp .env.example .env
# then set GEMINI_API_KEY=your_key_here

# 3. Start the dev server (app + API on http://localhost:3000)
npm run dev

# 4. Production build
npm run build
npm run preview
```

---

## ☁️ Deploy on Vercel

The project is Vercel-ready out of the box:

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — Vite is auto-detected.
3. Add environment variable `GEMINI_API_KEY` (optional) in **Project → Settings → Environment Variables**.
4. Deploy. `vercel.json` already configures the build, the `api/ai/mentor` serverless function and security headers.

Or use the CLI:

```bash
npm i -g vercel
vercel          # link + preview
vercel --prod   # production deploy
```

---

## 🏗️ Architecture

```
├── api/
│   └── ai/mentor.ts        # Vercel serverless function (Sprout AI mentor)
├── shared/
│   └── mentorFallback.ts   # Encouraging offline mentor replies (shared with dev server)
├── server.ts               # Local dev server (Express + Vite middleware + same API)
├── src/
│   ├── App.tsx             # Main dashboard, navigation, routing (incl. ?verify= certificate route)
│   ├── components/         # 25+ feature components
│   │   ├── BuildOwnProjectModal.tsx
│   │   ├── GraduationStudioModal.tsx
│   │   ├── CertificateVerifyView.tsx
│   │   ├── IdeaGeneratorModal.tsx
│   │   ├── MyBuilderPortfolioModal.tsx
│   │   ├── ShowcaseModal.tsx
│   │   └── WeeklyChallengesModal.tsx
│   ├── data/               # Course content (learning paths, puzzles, projects)
│   └── utils/              # Certificate IDs/checksums, confetti, photo compression
├── vercel.json             # Vercel deployment config
└── index.html              # Fonts (Nunito/Inter/JetBrains Mono), meta, favicon
```

**Stack:** React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Express (dev) · Gemini API (optional)

**Storage:** Student progress persists in `localStorage` (per-device). The AI mentor key stays server-side only.

---

## 🎓 Certificate Verification

Every certificate gets a unique ID (`BV-YYYY-XXXXXX-C`) with a built-in checksum. Open `https://your-domain.com/?verify=<ID>` (or scan the QR code) to see validity, course, level and issue date. Revoked certificates show as revoked.

---

## 💗 Design System

Soft-pink, cute-but-professional: `#FFF5F6` background · `#A65F79` buttons · `#563747` headings · Nunito/Inter/JetBrains Mono · rounded cards, reduced-motion support, visible focus states.

---

*BuilderVerse — Learn. Think. Build. Become an Independent Builder.*

