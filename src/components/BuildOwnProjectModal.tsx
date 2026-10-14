import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, Circle, ArrowLeft, ArrowRight, LifeBuoy, Lightbulb, Save, Rocket } from 'lucide-react';

/**
 * BUILD MY OWN PROJECT — guided from idea to original project.
 * The graduated assistance ladder starts with a question (level 1)
 * and only reveals a worked example at level 5 — never immediately.
 */

export interface OwnMilestone {
  id: string;
  text: string;
  done: boolean;
}

export interface OwnProject {
  id: string;
  title: string;
  problemStatement: string;
  whoHasProblem: string;
  whyItMatters: string;
  features: string[];
  technology: string;
  mvpDescription: string;
  designNotes: string;
  milestones: OwnMilestone[];
  testNotes: string;
  blockers: string;
  reflection: string;
  status: 'planning' | 'building' | 'testing' | 'done';
  createdAt: number;
  updatedAt: number;
}

interface StepDefinition {
  key: keyof Omit<OwnProject, 'id' | 'features' | 'milestones' | 'status' | 'createdAt' | 'updatedAt'>;
  title: string;
  prompt: string;
  placeholder: string;
  help: string[];
}


const STEPS: StepDefinition[] = [
  {
    key: 'problemStatement',
    title: 'Step 1 · Identify a problem',
    prompt: 'What problem will your project solve? One or two plain sentences — as if telling a friend.',
    placeholder: 'e.g. Students forget assignment deadlines because due dates are only on the whiteboard, which is erased daily.',
    help: [
      'Ask: what small annoyance do I (or people I know) face every week?',
      'Finish this sentence: "It is annoying that ___ happens because ___."',
      'Good problems are specific — "students miss deadlines" beats "people forget things".',
      'Think: who faces it, what goes wrong, and what the bad outcome is.',
      'Possible answer: "Classmates miss deadlines because due dates live only on the whiteboard."'
    ]
  },
  {
    key: 'whoHasProblem',
    title: 'Step 2 · Who experiences it?',
    prompt: 'Who exactly faces this problem? Naming real users keeps your design honest.',
    placeholder: 'e.g. My 40 classmates in 2nd-year B.Sc. who check phones daily but rarely open a calendar.',
    help: [
      'Think of one real person who has this problem. Describe them.',
      'The narrower your audience, the easier your first version is.',
      'How often do they face it? What do they use today instead?',
      'Pick a group you can actually talk to — classmates, family, a club.',
      'Possible answer: "My 40 classmates who rely on the whiteboard and WhatsApp reminders."'
    ]
  },
  {
    key: 'whyItMatters',
    title: 'Step 3 · Why does solving it matter?',
    prompt: 'If your project worked, what would become better for those people?',
    placeholder: 'e.g. Nobody loses marks to a forgotten date, and the class rep stops answering "when is it due?" all day.',
    help: [
      'Picture the day after your project exists. What is different?',
      'Benefits can be time saved, marks saved, stress reduced, or fun increased.',
      'Being honest here helps you explain the project in interviews later.',
      'Contrast "before your project" and "after your project".',
      'Possible answer: "Students stop losing marks to forgotten deadlines."'
    ]
  },
  {
    key: 'technology',
    title: 'Step 5 · Choose suitable technologies',
    prompt: 'Which languages/tools will you use? Choose from what you have practised in BuilderVerse — not what sounds impressive.',
    placeholder: 'e.g. HTML + CSS + JavaScript with localStorage, because I finished those paths.',
    help: [
      'Open your Builder Card — which paths have you completed? Start there.',
      'Use the newest thing you have practised, plus one thing you already know well.',
      'A project you finish beats a project with a trendy stack you cannot debug.',
      'Web form project → HTML/CSS/JS; data project → Python; Android → Java.',
      'Possible answer: "HTML, CSS and JavaScript with localStorage — all from my completed paths."'
    ]
  },
  {
    key: 'mvpDescription',
    title: 'Step 6 · Define the minimum working version',
    prompt: 'What is the SMALLEST version that still solves the problem? Be ruthless — features can come later.',
    placeholder: 'e.g. One page: assignment list with due dates, an "add" form, red highlight when a deadline is within 2 days.',
    help: [
      'If your MVP list has more than 3 features, it is not minimal yet.',
      'Ask: what is the ONE thing that must work for this to be useful at all?',
      'Cut everything "nice" and keep only what is "needed".',
      'A good MVP is a loop: input → process → output.',
      'Possible answer: "Add an assignment (name + date); list sorted by date; overdue items shown in red."'
    ]
  },
  {
    key: 'designNotes',
    title: 'Step 7 · Design before you code',
    prompt: 'Sketch your screens, algorithm steps, or data shape. A rough text plan saves hours of rewriting.',
    placeholder: 'e.g. Screen 1: header + list of cards (title, date, status). Data: { title, dueDate }. On load: compare dueDate with today.',
    help: [
      'Grab paper first — a 2-minute sketch beats 20 minutes of confused coding.',
      'List the screens a user sees and what appears on each.',
      'For logic: write the steps in plain English before any code.',
      'Name your data fields, then list what happens on each button click.',
      'Possible answer: "One screen. Card = title + due date + status badge. Sort by date, red if due within 48h."'
    ]
  },
  {
    key: 'testNotes',
    title: 'Step 10 · Test and debug',
    prompt: 'How did (or will) you check it actually works? List cases you tried — including weird ones.',
    placeholder: 'e.g. Assignment due yesterday → turned red. Empty title → warning. Reloaded page → list still there.',
    help: [
      'Testing means trying to break your own work on purpose.',
      'At minimum: one normal case, one empty input, one boundary (today/tomorrow).',
      'Use Error Companion habits: read the message, find the line, fix one thing at a time.',
      'Checklist: happy path, empty input, wrong type, refresh/reload behaviour.',
      'Possible answer: "Tested past/today/future dates, empty fields, and persistence after refresh."'
    ]
  },
  {
    key: 'blockers',
    title: 'Step 12 · Challenges you solved',
    prompt: 'What was hardest, and how did you get past it? This is gold for interviews and your portfolio.',
    placeholder: 'e.g. Dates compared as text, not real dates. Learned Date parsing and used timestamps.',
    help: [
      'Every builder has blockers — recording them turns frustration into experience.',
      'Name the exact error or confusion, then what finally made it click.',
      'Mentioning resources you used (docs, Error Companion, a friend) is honest and strong.',
      'Format: "I struggled with X. I tried A, then B. Finally C worked because…"',
      'Possible answer: "String dates sorted alphabetically. I converted them with new Date() and compared timestamps."'
    ]
  },
  {
    key: 'reflection',
    title: 'Step 13 · Document and reflect',
    prompt: 'Write a short summary of what you built and learned. This becomes your portfolio description.',
    placeholder: 'e.g. Built "Deadline Guard", a page tracking assignments and highlighting urgent ones. Learned dates, sorting, localStorage.',
    help: [
      'Good documentation is a story: problem → approach → result → learning.',
      'Three to five sentences is plenty.',
      'Name at least one concept you can now explain to someone else.',
      'Structure: what it is, who it is for, what you used, what you learned.',
      'Possible answer: "Deadline Guard is a lightweight assignment tracker built with vanilla JS and localStorage."'
    ]
  }
];

/** Fresh empty project with a unique id and sensible defaults. */
const defaultProject = (): OwnProject => ({
  id: 'own-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
  title: 'My New Project',
  problemStatement: '',
  whoHasProblem: '',
  whyItMatters: '',
  features: [],
  technology: '',
  mvpDescription: '',
  designNotes: '',
  milestones: [],
  testNotes: '',
  blockers: '',
  reflection: '',
  status: 'planning',
  createdAt: Date.now(),
  updatedAt: Date.now()
});

const STORAGE_KEY = 'bv_own_projects';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onEarnXp: (amount: number) => void;
}

export const BuildOwnProjectModal: React.FC<Props> = ({ isOpen, onClose, onEarnXp }) => {
  const [projects, setProjects] = useState<OwnProject[]>([]);
  const [activeProject, setActiveProject] = useState<OwnProject | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [helpLevel, setHelpLevel] = useState(0);
  const [newFeature, setNewFeature] = useState('');
  const [newMilestone, setNewMilestone] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  // Load saved projects from localStorage whenever the workspace opens
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        setProjects(saved ? JSON.parse(saved) : []);
      } catch {
        setProjects([]);
      }
      setActiveProject(null);
      setStepIdx(0);
      setHelpLevel(0);
    }
  }, [isOpen]);

  // Auto-save on every change so a break never loses work
  useEffect(() => {
    if (isOpen) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects, isOpen]);

  if (!isOpen) return null;

  /** Add or replace a project in the saved list and keep the editor in sync. */
  const persistActive = (updated: OwnProject) => {
    setActiveProject(updated);
    setProjects(prev => {
      const exists = prev.some(p => p.id === updated.id);
      return exists ? prev.map(p => (p.id === updated.id ? updated : p)) : [...prev, updated];
    });
  };

  const updateField = (key: keyof OwnProject, value: string) => {
    if (!activeProject) return;
    persistActive({ ...activeProject, [key]: value, updatedAt: Date.now() });
  };

  const handleAddFeature = () => {
    if (!activeProject || !newFeature.trim()) return;
    persistActive({ ...activeProject, features: [...activeProject.features, newFeature.trim()], updatedAt: Date.now() });
    setNewFeature('');
  };

  const handleAddMilestone = () => {
    if (!activeProject || !newMilestone.trim()) return;
    persistActive({
      ...activeProject,
      milestones: [...activeProject.milestones, { id: 'ms-' + Date.now(), text: newMilestone.trim(), done: false }],
      updatedAt: Date.now()
    });
    setNewMilestone('');
  };

  const handleToggleMilestone = (id: string) => {
    if (!activeProject) return;
    const milestones = activeProject.milestones.map(m => (m.id === id ? { ...m, done: !m.done } : m));
    const allDone = milestones.length > 0 && milestones.every(m => m.done);
    persistActive({ ...activeProject, milestones, status: allDone ? 'done' : activeProject.status, updatedAt: Date.now() });
    if (allDone) onEarnXp(40); // completing every milestone marks the project done
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProject?.id === id) setActiveProject(null);
  };

  const currentStep = STEPS[stepIdx];
  const progressPercent = Math.round(((stepIdx + 1) / STEPS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col"
        style={{ backgroundColor: 'var(--bv-surface)', borderColor: 'var(--bv-line)', color: 'var(--bv-ink)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--bv-line)]">
          <div>
            <h2 className="text-lg font-extrabold flex items-center gap-2">
              <Rocket className="size-5 text-[var(--bv-brand)]" /> Build My Own Project
            </h2>
            <p className="text-xs text-[var(--bv-muted)] mt-0.5">
              From a real problem to a portfolio project — one small step at a time.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--bv-muted)] hover:text-[var(--bv-ink)] hover:bg-[var(--bv-surface-2)] transition"
            aria-label="Close workspace"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!activeProject ? (
            /* LIST VIEW */
            <div className="space-y-4">
              {projects.length === 0 && (
                <div className="p-8 rounded-2xl border border-dashed border-[var(--bv-line-strong)] text-center space-y-3 bg-[var(--bv-surface-2)]/40">
                  <div className="text-4xl">🌱</div>
                  <h3 className="font-bold">Start your first original project</h3>
                  <p className="text-xs text-[var(--bv-muted)] max-w-md mx-auto leading-relaxed">
                    Guided projects teach you by following. This workspace helps you create
                    something that is genuinely yours — from the problem statement to the portfolio write-up.
                  </p>
                </div>
              )}
              {projects.map(p => (
                <div
                  key={p.id}
                  onClick={() => { setActiveProject(p); setStepIdx(0); setHelpLevel(0); }}
                  className="cursor-pointer p-4 rounded-xl border border-[var(--bv-line)] hover:border-[var(--bv-brand)]/50 hover:shadow-sm transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm truncate">{p.title || 'Untitled project'}</h3>
                    <p className="text-xs text-[var(--bv-muted)] truncate mt-0.5">
                      {p.problemStatement || 'No problem statement yet'}
                    </p>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--bv-brand-soft)] text-[var(--bv-brand)] capitalize mt-2">
                      {p.status}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteProject(p.id, e)}
                    className="p-2 rounded-lg text-[var(--bv-muted)] hover:text-[var(--bv-danger)] hover:bg-[var(--bv-danger-soft)] transition shrink-0"
                    aria-label="Delete project"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => { setActiveProject(defaultProject()); setStepIdx(0); setHelpLevel(0); }}
                className="w-full py-3 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition flex items-center justify-center gap-1.5"
              >
                <Plus className="size-4" /> Start a New Project
              </button>
            </div>
          ) : (
            /* EDITOR VIEW — one guided step at a time */
            <div className="space-y-5">
              {/* Project title, status and progress bar */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    value={activeProject.title}
                    onChange={e => updateField('title', e.target.value)}
                    className="flex-1 min-w-[180px] px-3 py-2 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-sm font-bold focus:outline-none focus:border-[var(--bv-brand)]"
                    placeholder="Project title"
                  />
                  <select
                    value={activeProject.status}
                    onChange={e => persistActive({ ...activeProject, status: e.target.value as OwnProject['status'], updatedAt: Date.now() })}
                    className="px-3 py-2 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs font-bold focus:outline-none"
                  >
                    <option value="planning">Planning</option>
                    <option value="building">Building</option>
                    <option value="testing">Testing</option>
                    <option value="done">Done ✓</option>
                  </select>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--bv-surface-2)] overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--bv-brand)] transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              {/* Step index 2 doubles as the Features + Milestones screen */}
              {stepIdx === 2 ? (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm">Step 4 · List possible features</h3>
                  <p className="text-xs text-[var(--bv-muted)] leading-relaxed">
                    Brainstorm everything your project could do. You will pick the minimum later — nothing is wasted here.
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={newFeature}
                      onChange={e => setNewFeature(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddFeature()}
                      className="flex-1 px-3 py-2 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs focus:outline-none focus:border-[var(--bv-brand)]"
                      placeholder="e.g. Add an assignment with a due date"
                    />
                    <button
                      onClick={handleAddFeature}
                      disabled={!newFeature.trim()}
                      className="px-4 py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition disabled:opacity-40 flex items-center gap-1"
                    >
                      <Plus className="size-3.5" /> Add
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {activeProject.features.length === 0 && (
                      <p className="text-xs text-[var(--bv-muted)] italic">No features listed yet.</p>
                    )}
                    {activeProject.features.map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs">
                        <span>{f}</span>
                        <button
                          onClick={() => persistActive({ ...activeProject, features: activeProject.features.filter((_, idx) => idx !== i), updatedAt: Date.now() })}
                          className="text-[var(--bv-muted)] hover:text-[var(--bv-danger)]"
                          aria-label="Remove feature"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Step 8: milestones */}
                  <div className="pt-3 border-t border-[var(--bv-line)] space-y-2">
                    <h4 className="text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-[var(--bv-brand)]" /> Step 8 · Milestones
                    </h4>
                    <div className="flex gap-2">
                      <input
                        value={newMilestone}
                        onChange={e => setNewMilestone(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddMilestone()}
                        className="flex-1 px-3 py-2 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs focus:outline-none focus:border-[var(--bv-brand)]"
                        placeholder="e.g. Milestone 1: static HTML page with the assignment list"
                      />
                      <button
                        onClick={handleAddMilestone}
                        disabled={!newMilestone.trim()}
                        className="px-4 py-2 rounded-xl border border-[var(--bv-line)] text-xs font-bold hover:bg-[var(--bv-surface-2)] transition disabled:opacity-40"
                      >
                        Add
                      </button>
                    </div>
                    {activeProject.milestones.map(m => (
                      <button
                        key={m.id}
                        onClick={() => handleToggleMilestone(m.id)}
                        className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs text-left hover:border-[var(--bv-brand)]/40 transition"
                      >
                        {m.done
                          ? <CheckCircle2 className="size-4 text-[var(--bv-success)] shrink-0" />
                          : <Circle className="size-4 text-[var(--bv-muted)] shrink-0" />}
                        <span className={m.done ? 'line-through text-[var(--bv-muted)]' : ''}>{m.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Regular step: prompt + textarea + graduated assistance */
                <div className="space-y-3">
                  <h3 className="font-bold text-sm">{currentStep.title}</h3>
                  <p className="text-xs text-[var(--bv-muted)] leading-relaxed">{currentStep.prompt}</p>
                  <textarea
                    value={activeProject[currentStep.key] as string}
                    onChange={e => updateField(currentStep.key, e.target.value)}
                    rows={5}
                    className="w-full px-3.5 py-3 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs leading-relaxed focus:outline-none focus:border-[var(--bv-brand)] resize-y"
                    placeholder={currentStep.placeholder}
                  />

                  {/* Graduated assistance ladder: question → concept → example → solution */}
                  <div className="p-3.5 rounded-xl bg-[var(--bv-warning-soft)] border border-[var(--bv-line)] space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold flex items-center gap-1.5 text-[var(--bv-ink)]">
                        <LifeBuoy className="size-4 text-[var(--bv-warning)]" /> Stuck? Let's think together.
                      </span>
                      {helpLevel < currentStep.help.length && (
                        <button
                          onClick={() => setHelpLevel(l => l + 1)}
                          className="text-xs font-bold text-[var(--bv-brand)] hover:underline flex items-center gap-1"
                        >
                          <Lightbulb className="size-3.5" />
                          {helpLevel === 0 ? 'Give me a hint' : 'Still stuck — deeper hint'}
                        </button>
                      )}
                    </div>
                    {currentStep.help.slice(0, helpLevel).map((h, i) => (
                      <p key={i} className="text-xs text-[var(--bv-ink-soft)] leading-relaxed p-2.5 rounded-lg bg-[var(--bv-surface)] border border-[var(--bv-line)]">
                        {h}
                      </p>
                    ))}
                    {helpLevel >= currentStep.help.length && (
                      <p className="text-[10px] text-[var(--bv-muted)] italic">
                        That was the deepest hint. Try writing your own version first — your words make the project yours.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation + autosave indicator */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--bv-line)] flex-wrap gap-2">
                <button
                  onClick={() => { setStepIdx(i => Math.max(0, i - 1)); setHelpLevel(0); }}
                  disabled={stepIdx === 0}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-[var(--bv-line)] hover:bg-[var(--bv-surface-2)] transition disabled:opacity-40 flex items-center gap-1.5"
                >
                  <ArrowLeft className="size-3.5" /> Back
                </button>
                <span className="text-[10px] text-[var(--bv-muted)] flex items-center gap-1">
                  <Save className="size-3" /> Auto-saved
                </span>
                <button
                  onClick={() => {
                    if (stepIdx === STEPS.length - 1) {
                      persistActive({ ...activeProject, updatedAt: Date.now() });
                      setJustSaved(true);
                      setTimeout(() => setJustSaved(false), 1600);
                      onEarnXp(30);
                    } else {
                      setStepIdx(i => Math.min(STEPS.length - 1, i + 1));
                      setHelpLevel(0);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition flex items-center gap-1.5"
                >
                  {stepIdx === STEPS.length - 1
                    ? (justSaved ? 'Saved ✓' : 'Finish & Save (+30 XP)')
                    : 'Next Step'}
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="w-full text-xs text-[var(--bv-muted)] hover:text-[var(--bv-brand)] transition py-1"
              >
                ← Back to my projects
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
