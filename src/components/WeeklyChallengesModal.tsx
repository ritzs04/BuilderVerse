import React, { useEffect, useState } from 'react';
import { X, Flag, CheckCircle2, Plus } from 'lucide-react';

/**
 * WEEKLY BUILD CHALLENGES — turn knowledge into working projects.
 * Required-feature checklists reward creativity and completion, never
 * speed. Finished builds submit into Build My Own Project.
 */

interface Challenge {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  statement: string;
  requiredFeatures: string[];
  hints: string[];
  xp: number;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    title: 'Tip Calculator with a Twist',
    difficulty: 'Beginner',
    statement: 'Build a bill-splitter friends can actually use at the table — including one feature nobody asked for but everybody loves.',
    requiredFeatures: ['Bill amount + tip % + people count', 'Per-person share displayed clearly', 'Empty/negative input shows a friendly warning, not NaN'],
    hints: ['Start with three number inputs and one result line', 'Guard every calculation with a valid-number check first'],
    xp: 60
  },
  {
    id: 'ch-2',
    title: 'Flashcard Study Deck',
    difficulty: 'Intermediate',
    statement: 'Build a flip-card deck for one subject you are studying — with progress that survives a page refresh.',
    requiredFeatures: ['Add cards (front + back)', 'Flip toggle', 'Score tracking for "got it / still learning"', 'Deck persists after refresh'],
    hints: ['One array of {front, back, known} objects is your whole brain', 'Save to localStorage after every change'],
    xp: 90
  },
  {
    id: 'ch-3',
    title: 'Habit Bloom Garden',
    difficulty: 'Advanced',
    statement: 'Build a habit tracker where consistency literally blooms — each completed day grows part of a flower on screen.',
    requiredFeatures: ['Add habits with weekly targets', 'Daily check-in persisted per date', 'Visual bloom that grows with the streak', 'Missed days show as "paused", never punishment'],
    hints: ['Model each habit as: name, target, {date: done} map', 'Draw the flower in stages — stem, leaves, petals, bloom'],
    xp: 140
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBuild: (title: string, reflection: string, xp: number) => void;
}

export const WeeklyChallengesModal: React.FC<Props> = ({ isOpen, onClose, onSubmitBuild }) => {
  const [doneChecks, setDoneChecks] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string>(CHALLENGES[0].id);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('bv_challenge_checks');
        setDoneChecks(saved ? JSON.parse(saved) : []);
        const sub = localStorage.getItem('bv_challenge_submitted');
        setSubmitted(sub ? JSON.parse(sub) : []);
      } catch {
        setDoneChecks([]);
        setSubmitted([]);
      }
      setActiveId(CHALLENGES[0].id);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) localStorage.setItem('bv_challenge_checks', JSON.stringify(doneChecks));
  }, [doneChecks, isOpen]);

  useEffect(() => {
    if (isOpen) localStorage.setItem('bv_challenge_submitted', JSON.stringify(submitted));
  }, [submitted, isOpen]);

  if (!isOpen) return null;

  const active = CHALLENGES.find(c => c.id === activeId) || CHALLENGES[0];
  const toggleCheck = (key: string) =>
    setDoneChecks(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
  const requiredDone = active.requiredFeatures.filter(f => doneChecks.includes(active.id + f)).length;
  const allRequiredDone = requiredDone === active.requiredFeatures.length;

  const handleSubmit = () => {
    if (!allRequiredDone || submitted.includes(active.id)) return;
    onSubmitBuild(active.title, `Weekly challenge build: ${active.statement}`, active.xp);
    setSubmitted(prev => [...prev, active.id]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col"
        style={{ backgroundColor: 'var(--bv-surface)', borderColor: 'var(--bv-line)', color: 'var(--bv-ink)' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--bv-line)]">
          <div>
            <h2 className="text-lg font-extrabold flex items-center gap-2">
              <Flag className="size-5 text-[var(--bv-brand)]" /> Weekly Build Challenges
            </h2>
            <p className="text-xs text-[var(--bv-muted)] mt-0.5">
              Turn this week's knowledge into a working project. Creativity over speed. Retry anytime.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--bv-muted)] hover:text-[var(--bv-ink)] hover:bg-[var(--bv-surface-2)] transition"
            aria-label="Close challenges"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex gap-2 flex-wrap">
            {CHALLENGES.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeId === c.id ? 'bg-[var(--bv-brand)] text-white' : 'bg-[var(--bv-surface-2)] text-[var(--bv-ink-soft)] border border-[var(--bv-line)]'}`}
              >
                {submitted.includes(c.id) && <CheckCircle2 className="size-3.5" />}
                {c.title} · {c.difficulty}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="font-bold text-sm">{active.title}</h3>
              <span className="text-xs font-bold text-amber-600">+{active.xp} XP on submit</span>
            </div>
            <p className="text-xs text-[var(--bv-ink-soft)] leading-relaxed">{active.statement}</p>

            <div>
              <h4 className="text-xs font-bold mb-1.5">Required features — finish all to submit ({requiredDone}/{active.requiredFeatures.length})</h4>
              {active.requiredFeatures.map(f => {
                const key = active.id + f;
                const done = doneChecks.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleCheck(key)}
                    className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs text-left hover:border-[var(--bv-brand)]/40 transition mb-1.5"
                  >
                    {done ? <CheckCircle2 className="size-4 text-[var(--bv-success)] shrink-0" /> : <span className="size-4 rounded-full border-2 border-[var(--bv-muted)] shrink-0" />}
                    <span className={done ? 'line-through text-[var(--bv-muted)]' : ''}>{f}</span>
                  </button>
                );
              })}
            </div>

            <details className="p-3 rounded-xl bg-[var(--bv-warning-soft)] border border-[var(--bv-line)]">
              <summary className="text-xs font-bold cursor-pointer">Need hints? (open gently)</summary>
              <ul className="text-xs text-[var(--bv-ink-soft)] leading-relaxed mt-2 space-y-1 list-disc pl-4">
                {active.hints.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </details>

            <button
              onClick={handleSubmit}
              disabled={!allRequiredDone || submitted.includes(active.id)}
              className="w-full py-2.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              {submitted.includes(active.id)
                ? <><CheckCircle2 className="size-4" /> Submitted — saved to Build My Own Project</>
                : <><Plus className="size-4" /> Submit finished build</>}
            </button>
            <p className="text-[11px] text-[var(--bv-muted)] text-center">
              Submitted builds land in Build My Own Project as tested drafts — then grow into portfolio pieces. 🌱
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

