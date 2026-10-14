import React, { useMemo, useState } from 'react';
import { X, Save, CheckCircle2 } from 'lucide-react';
import { LEARNING_PATHS } from '../data/builderVerseData';

/**
 * PROJECT IDEA GENERATOR — practical suggestions matched to the student.
 * Filters by language, interest and level; every idea explains the
 * problem, users, features, skills, milestones and portfolio value.
 * One click saves an idea into Build My Own Project as a planning draft.
 */

export interface GeneratedIdea {
  id: string;
  title: string;
  interest: string;
  language: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  timeNeeded: string;
  problem: string;
  users: string;
  whyUseful: string;
  features: string[];
  skills: string;
  milestones: string[];
  portfolioValue: string;
}

const IDEAS: GeneratedIdea[] = [
  {
    id: 'idea-1',
    title: 'Class Deadline Guard',
    interest: 'Campus life',
    language: 'JavaScript',
    level: 'Beginner',
    timeNeeded: '1 weekend',
    problem: 'Assignment due dates live only on the whiteboard and get erased daily.',
    users: 'Classmates (30–60 students) who check their phones daily.',
    whyUseful: 'Nobody loses marks to a forgotten date.',
    features: ['Add assignment with name + due date', 'List sorted by urgency', 'Red highlight within 48 hours', 'Done/pending toggle'],
    skills: 'DOM manipulation, dates, sorting, localStorage',
    milestones: ['Static list page', 'Add/delete form', 'Persistence', 'Urgency highlighting'],
    portfolioValue: 'A real tool classmates can use — easy to demo to recruiters.'
  },
  {
    id: 'idea-2',
    title: 'Smart Expense Tracker',
    interest: 'Personal productivity',
    language: 'Python',
    level: 'Beginner',
    timeNeeded: '1 weekend',
    problem: 'Students spend pocket money without knowing where it goes.',
    users: 'The student themself + roommates.',
    whyUseful: 'A weekly summary shows which category eats the budget.',
    features: ['Add expense with category', 'Weekly totals per category', 'Summary chart', 'Savings goal'],
    skills: 'Python lists, dicts, file I/O or JSON storage',
    milestones: ['Menu-driven add/list', 'Category totals', 'Save to JSON', 'Chart'],
    portfolioValue: 'Shows data handling and file persistence beyond toy scripts.'
  },
  {
    id: 'idea-3',
    title: 'Mess Menu Board',
    interest: 'Campus life',
    language: 'JavaScript',
    level: 'Beginner',
    timeNeeded: '1–2 days',
    problem: 'Students walk to the mess only to find food they dislike.',
    users: 'Hostel students checking the menu each morning.',
    whyUseful: 'One quick look saves a wasted trip.',
    features: ['Weekly menu grid', 'Today highlight', 'Veg/non-veg filter', 'Favourite day marker'],
    skills: 'HTML tables, CSS grid, JS filtering',
    milestones: ['Menu data structure', 'Grid layout', 'Filters', 'Today highlight'],
    portfolioValue: 'A clean, useful UI piece — great for a first portfolio.'
  },
  {
    id: 'idea-4',
    title: 'Library Book Manager',
    interest: 'Education',
    language: 'Java',
    level: 'Intermediate',
    timeNeeded: '2 weekends',
    problem: 'Small department libraries track books in registers that get lost.',
    users: 'Department librarian and 100+ students.',
    whyUseful: 'Instant search replaces paging through registers.',
    features: ['Add/search books', 'Issue & return with due dates', 'Overdue list', 'Console menu'],
    skills: 'Java classes, ArrayLists, Scanner I/O, date handling',
    milestones: ['Book class + storage', 'Add/search', 'Issue/return', 'Overdue report'],
    portfolioValue: 'A proper OOP mini-system — exactly what Java interviewers love.'
  },
  {
    id: 'idea-5',
    title: 'Student Record Helper',
    interest: 'Education',
    language: 'C',
    level: 'Intermediate',
    timeNeeded: '2 weekends',
    problem: 'Class marks are scattered across notebooks; averages take forever by hand.',
    users: 'Class representative or tutor handling 30–60 students.',
    whyUseful: 'Enter marks once and get totals, averages and topper lists.',
    features: ['Add students with marks', 'Average + grade computation', 'Save records to file', 'Topper list'],
    skills: 'C structs, arrays, file I/O, functions',
    milestones: ['Struct design', 'Add/display', 'File save/load', 'Reports'],
    portfolioValue: 'Proves comfort with C structs and file handling.'
  },
  {
    id: 'idea-6',
    title: 'Mood & Study Journal',
    interest: 'Safety and wellbeing',
    language: 'JavaScript',
    level: 'Intermediate',
    timeNeeded: '1 weekend',
    problem: 'Exam stress builds up unnoticed until it explodes.',
    users: 'The student themself — a private, judgement-free space.',
    whyUseful: 'Mood trends next to study hours reveal what actually helps.',
    features: ['Daily mood check-in', 'Study-hours log', 'Week trend chart', 'Encouraging messages'],
    skills: 'Forms, canvas drawing, localStorage, date math',
    milestones: ['Check-in form', 'Trend canvas', 'Streak logic', 'Week summary'],
    portfolioValue: 'Shows empathy-driven design — memorable in interviews.'
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  completedLessonIds: string[];
  onSaveIdea: (idea: GeneratedIdea) => void;
}

export const IdeaGeneratorModal: React.FC<Props> = ({ isOpen, onClose, completedLessonIds, onSaveIdea }) => {
  const [language, setLanguage] = useState('Any');
  const [interest, setInterest] = useState('Any');
  const [level, setLevel] = useState('Any');
  const [savedId, setSavedId] = useState<string | null>(null);

  // Offer = the site's real content languages (never promise what we don't teach).
  const languages = useMemo(() => {
    const known = new Set<string>();
    for (const path of LEARNING_PATHS) {
      if (['html', 'css', 'javascript', 'python', 'java', 'c'].includes(path.id)) {
        known.add(path.id === 'javascript' ? 'JavaScript' : path.title);
      }
    }
    return ['Any', ...Array.from(known)];
  }, []);

  const interests = useMemo(() => ['Any', ...Array.from(new Set(IDEAS.map(i => i.interest)))], []);
  const levels = ['Any', 'Beginner', 'Intermediate', 'Advanced'];

  const matches = useMemo(() => IDEAS.filter(i =>
    (language === 'Any' || i.language === language) &&
    (interest === 'Any' || i.interest === interest) &&
    (level === 'Any' || i.level === level)
  ), [language, interest, level]);

  if (!isOpen) return null;

  const practisedLanguage = (lang: string): boolean =>
    completedLessonIds.some(id => id.startsWith(lang.toLowerCase().slice(0, 4)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col"
        style={{ backgroundColor: 'var(--bv-surface)', borderColor: 'var(--bv-line)', color: 'var(--bv-ink)' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--bv-line)]">
          <div>
            <h2 className="text-lg font-extrabold">💡 Project Idea Generator</h2>
            <p className="text-xs text-[var(--bv-muted)] mt-0.5">
              Practical ideas matched to your interests — save any of them into Build My Own Project.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--bv-muted)] hover:text-[var(--bv-ink)] hover:bg-[var(--bv-surface-2)] transition"
            aria-label="Close idea generator"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([
              ['Programming language', language, setLanguage, languages],
              ['Interest', interest, setInterest, interests],
              ['Level', level, setLevel, levels]
            ] as [string, string, (v: string) => void, string[]][]).map(([label, value, setter, options]) => (
              <div key={label}>
                <label className="text-[11px] font-bold block mb-1 text-[var(--bv-ink-soft)]">{label}</label>
                <select
                  value={value}
                  onChange={e => setter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs font-bold focus:outline-none"
                >
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          {matches.length === 0 && (
            <div className="p-6 rounded-xl border border-dashed border-[var(--bv-line-strong)] text-center">
              <p className="text-sm font-bold">No ideas match that exact mix yet</p>
              <p className="text-xs text-[var(--bv-muted)] mt-1">Loosen one filter — every idea here teaches transferable builder skills.</p>
            </div>
          )}

          {matches.map(idea => (
            <div key={idea.id} className="p-4 rounded-xl border border-[var(--bv-line)] space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="font-bold text-sm">{idea.title}</h3>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--bv-brand-soft)] text-[var(--bv-brand)]">{idea.level}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--bv-surface-2)] text-[var(--bv-muted)]">{idea.language} · {idea.timeNeeded}</span>
                </div>
              </div>
              <p className="text-xs text-[var(--bv-ink-soft)] leading-relaxed"><b>Problem:</b> {idea.problem}</p>
              <p className="text-xs text-[var(--bv-muted)] leading-relaxed"><b>For:</b> {idea.users}</p>
              <p className="text-xs text-[var(--bv-muted)] leading-relaxed"><b>Suggested features:</b> {idea.features.join(' · ')}</p>
              <p className="text-xs text-[var(--bv-muted)] leading-relaxed"><b>Skills practised:</b> {idea.skills}</p>
              <p className="text-xs text-[var(--bv-muted)] leading-relaxed"><b>Milestones:</b> {idea.milestones.join(' → ')}</p>
              <p className="text-xs text-[var(--bv-success)] leading-relaxed"><b>Portfolio value:</b> {idea.portfolioValue}</p>
              {!practisedLanguage(idea.language) && (
                <p className="text-[11px] text-[var(--bv-warning)] font-semibold">
                  ⚠️ You haven't finished the {idea.language} path yet — consider completing it first, or pick a language you know.
                </p>
              )}
              <button
                onClick={() => {
                  onSaveIdea(idea);
                  setSavedId(idea.id);
                  setTimeout(() => setSavedId(null), 2000);
                }}
                className="w-full py-2 rounded-xl border border-[var(--bv-brand)] text-[var(--bv-brand)] text-xs font-bold hover:bg-[var(--bv-brand)] hover:text-white transition flex items-center justify-center gap-1.5"
              >
                {savedId === idea.id ? <CheckCircle2 className="size-4 text-[var(--bv-success)]" /> : <Save className="size-4" />}
                {savedId === idea.id ? 'Saved to Build My Own Project ✓' : 'Save idea to Build My Own Project'}
              </button>
            </div>
          ))}
          <p className="text-[11px] text-[var(--bv-muted)] text-center">
            Ideas are starting points, not guarantees of uniqueness — make them yours with your own features and solutions. 💗
          </p>
        </div>
      </div>
    </div>
  );
};
