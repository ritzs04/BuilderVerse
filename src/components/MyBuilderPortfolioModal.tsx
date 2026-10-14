import React, { useEffect, useState } from 'react';
import { X, Trash2, Copy, CheckCircle2, Award } from 'lucide-react';
import { GUIDED_PROJECTS, GuidedProject } from '../data/builderVerseData';
import { OwnProject } from './BuildOwnProjectModal';

/**
 * MY BUILDER PORTFOLIO — students showcase what they actually built.
 * Entries are private drafts until the student explicitly publishes them.
 * Skills shown are always backed by real completed work, never by page views.
 */

export interface PortfolioEntry {
  id: string;
  title: string;
  description: string;
  problemSolved: string;
  technologies: string;
  challenges: string;
  conceptsLearned: string;
  githubUrl: string;
  liveUrl: string;
  published: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'bv_portfolio_entries';

const makeEntry = (title: string, description: string, technologies: string): PortfolioEntry => ({
  id: 'pf-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
  title,
  description,
  problemSolved: '',
  technologies,
  challenges: '',
  conceptsLearned: '',
  githubUrl: '',
  liveUrl: '',
  published: false,
  createdAt: Date.now()
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  completedProjectIds: string[];
  completedLessonIds: string[];
  ownProjects: OwnProject[];
}

export const MyBuilderPortfolioModal: React.FC<Props> = ({
  isOpen,
  onClose,
  username,
  completedProjectIds,
  completedLessonIds,
  ownProjects
}) => {
  const [entries, setEntries] = useState<PortfolioEntry[]>([]);
  const [editing, setEditing] = useState<PortfolioEntry | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        setEntries(saved ? JSON.parse(saved) : []);
      } catch {
        setEntries([]);
      }
      setEditing(null);
    }
  }, [isOpen]);

  // Auto-save drafts on every change
  useEffect(() => {
    if (isOpen) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries, isOpen]);

  if (!isOpen) return null;

  const updateEntry = (updated: PortfolioEntry) => {
    setEntries(prev => {
      const exists = prev.some(e => e.id === updated.id);
      return exists ? prev.map(e => (e.id === updated.id ? updated : e)) : [...prev, updated];
    });
    setEditing(null);
  };

  // Guided projects finished but not yet added to the portfolio
  const unaddedGuided = GUIDED_PROJECTS.filter(
    p => completedProjectIds.includes(p.id) && !entries.some(e => e.title === p.title)
  );

  // Completed own-projects not yet added
  const unaddedOwn = ownProjects.filter(
    p => p.status === 'done' && !entries.some(e => e.title === p.title)
  );

  const handleAddGuided = (project: GuidedProject) => {
    setEntries(prev => [...prev, makeEntry(project.title, project.description, project.skillsGained.join(', '))]);
  };

  const handleAddOwnProject = (own: OwnProject) => {
    if (entries.some(e => e.title === own.title)) return;
    const entry = makeEntry(
      own.title,
      own.reflection || own.mvpDescription || 'Original project built in the BuilderVerse workspace.',
      own.technology
    );
    entry.problemSolved = own.problemStatement;
    entry.challenges = own.blockers;
    setEntries(prev => [...prev, entry]);
  };

  const handleCopySummary = (entry: PortfolioEntry) => {
    const lines = [
      entry.title,
      entry.description,
      entry.problemSolved ? `Problem solved: ${entry.problemSolved}` : '',
      entry.technologies ? `Technologies: ${entry.technologies}` : '',
      entry.challenges ? `Challenge & fix: ${entry.challenges}` : '',
      entry.conceptsLearned ? `Concepts learned: ${entry.conceptsLearned}` : '',
      entry.liveUrl ? `Live demo: ${entry.liveUrl}` : '',
      entry.githubUrl ? `Repository: ${entry.githubUrl}` : '',
      '— Built with BuilderVerse (Learn. Think. Build.)'
    ].filter(Boolean);
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 1800);
    });
  };

  // Skills backed by real completed lessons — honest skill evidence only
  const skillEvidence: { skill: string; count: number }[] = [
    { skill: 'HTML', count: completedLessonIds.filter(id => id.startsWith('html')).length },
    { skill: 'CSS', count: completedLessonIds.filter(id => id.startsWith('css')).length },
    { skill: 'JavaScript', count: completedLessonIds.filter(id => id.startsWith('js') || id.startsWith('dom')).length },
    { skill: 'APIs', count: completedLessonIds.filter(id => id.startsWith('apis')).length },
    { skill: 'Git & GitHub', count: completedLessonIds.filter(id => id.startsWith('git')).length },
    { skill: 'Python', count: completedLessonIds.filter(id => id.startsWith('python')).length },
    { skill: 'Java', count: completedLessonIds.filter(id => id.startsWith('java')).length },
    { skill: 'C', count: completedLessonIds.filter(id => id.startsWith('c-')).length }
  ].filter(s => s.count > 0);

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
              <Award className="size-5 text-[var(--bv-brand)]" /> My Builder Portfolio
            </h2>
            <p className="text-xs text-[var(--bv-muted)] mt-0.5">
              Show what you built — {username}'s real work, never inflated.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--bv-muted)] hover:text-[var(--bv-ink)] hover:bg-[var(--bv-surface-2)] transition"
            aria-label="Close portfolio"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Skills backed by completed lessons */}
          {skillEvidence.length > 0 && (
            <div className="p-4 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)]">
              <h3 className="text-xs font-bold mb-2">Skills backed by your completed lessons</h3>
              <div className="flex flex-wrap gap-2">
                {skillEvidence.map(s => (
                  <span key={s.skill} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[var(--bv-surface)] border border-[var(--bv-line)]">
                    {s.skill} · {s.count} lesson{s.count > 1 ? 's' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick-add from real completed work */}
          {(unaddedGuided.length > 0 || unaddedOwn.length > 0) && !editing && (
            <div className="p-4 rounded-xl border border-dashed border-[var(--bv-line-strong)] space-y-2">
              <h3 className="text-xs font-bold">Add from your completed work</h3>
              {unaddedGuided.map(p => (
                <div key={p.id} className="flex items-center justify-between text-xs">
                  <span>🏆 {p.title} <span className="text-[var(--bv-muted)]">(guided project)</span></span>
                  <button onClick={() => handleAddGuided(p)} className="text-[var(--bv-brand)] font-bold hover:underline">+ Add</button>
                </div>
              ))}
              {unaddedOwn.map(p => (
                <div key={p.id} className="flex items-center justify-between text-xs">
                  <span>🚀 {p.title} <span className="text-[var(--bv-muted)]">(your own project)</span></span>
                  <button onClick={() => handleAddOwnProject(p)} className="text-[var(--bv-brand)] font-bold hover:underline">+ Add</button>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {entries.length === 0 && !editing && (
            <div className="p-8 rounded-2xl border border-dashed border-[var(--bv-line-strong)] text-center space-y-2 bg-[var(--bv-surface-2)]/40">
              <div className="text-4xl">🖼️</div>
              <h3 className="font-bold text-sm">Your portfolio is a blank canvas</h3>
              <p className="text-xs text-[var(--bv-muted)] max-w-sm mx-auto leading-relaxed">
                Finish a guided project or complete your own build, then add it here.
                Drafts stay private until you choose to publish.
              </p>
            </div>
          )}

          {/* Entry editor */}
          {editing && (
            <div className="p-4 rounded-xl border border-[var(--bv-brand)]/40 space-y-3">
              <h3 className="text-xs font-bold text-[var(--bv-brand)]">Edit entry</h3>
              {([
                ['title', 'Project title'],
                ['description', 'What it does'],
                ['problemSolved', 'Problem it solves'],
                ['technologies', 'Technologies used'],
                ['challenges', 'Hardest challenge & how you fixed it'],
                ['conceptsLearned', 'Concepts you learned'],
                ['githubUrl', 'GitHub repository link (optional)'],
                ['liveUrl', 'Live demo link (optional)']
              ] as [keyof PortfolioEntry, string][]).map(([key, label]) => (
                <div key={key}>
                  <label className="text-[11px] font-semibold block mb-1 text-[var(--bv-ink-soft)]">{label}</label>
                  <input
                    value={editing[key] as string}
                    onChange={e => setEditing({ ...editing, [key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs focus:outline-none focus:border-[var(--bv-brand)]"
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => updateEntry(editing)}
                  disabled={!editing.title.trim()}
                  className="flex-1 py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition disabled:opacity-40"
                >
                  Save Entry
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--bv-line)] text-xs font-bold hover:bg-[var(--bv-surface-2)] transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Entry cards */}
          {!editing && entries.map(entry => (
            <div
              key={entry.id}
              className="p-4 rounded-xl border transition"
              style={{ borderColor: entry.published ? 'var(--bv-success)' : 'var(--bv-line)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm">{entry.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${entry.published
                      ? 'bg-[var(--bv-success-soft)] text-[var(--bv-success)]'
                      : 'bg-[var(--bv-surface-2)] text-[var(--bv-muted)]'}`}>
                      {entry.published ? 'Published' : 'Draft · private'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--bv-muted)] mt-1 leading-relaxed">{entry.description}</p>
                  {entry.technologies && (
                    <p className="text-[11px] text-[var(--bv-ink-soft)] mt-1.5"><b>Tech:</b> {entry.technologies}</p>
                  )}
                  {entry.challenges && (
                    <p className="text-[11px] text-[var(--bv-ink-soft)] mt-1"><b>Challenge solved:</b> {entry.challenges}</p>
                  )}
                  {(entry.githubUrl || entry.liveUrl) && (
                    <p className="text-[11px] text-[var(--bv-brand)] mt-1 flex gap-3 flex-wrap">
                      {entry.githubUrl && <span>🔗 Repository linked</span>}
                      {entry.liveUrl && <span>🌐 Live demo linked</span>}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--bv-line)] flex-wrap">
                <button
                  onClick={() => setEditing(entry)}
                  className="text-xs font-bold text-[var(--bv-brand)] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => updateEntry({ ...entry, published: !entry.published })}
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
                    entry.published
                      ? 'border-[var(--bv-line)] text-[var(--bv-muted)] hover:bg-[var(--bv-surface-2)]'
                      : 'border-[var(--bv-success)] text-[var(--bv-success)] hover:bg-[var(--bv-success-soft)]'
                  }`}
                >
                  {entry.published ? 'Unpublish (make private)' : 'Publish'}
                </button>
                <button
                  onClick={() => handleCopySummary(entry)}
                  className="text-xs font-bold flex items-center gap-1 text-[var(--bv-ink-soft)] hover:text-[var(--bv-brand)] transition"
                >
                  {copiedId === entry.id ? <CheckCircle2 className="size-3.5 text-[var(--bv-success)]" /> : <Copy className="size-3.5" />}
                  {copiedId === entry.id ? 'Copied!' : 'Copy summary'}
                </button>
                <button
                  onClick={() => setEntries(prev => prev.filter(e => e.id !== entry.id))}
                  className="ml-auto p-1.5 rounded-lg text-[var(--bv-muted)] hover:text-[var(--bv-danger)] hover:bg-[var(--bv-danger-soft)] transition"
                  aria-label="Delete entry"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

