import React, { useEffect, useState } from 'react';
import { X, Copy, CheckCircle2, Megaphone, Plus, Trash2 } from 'lucide-react';
import { GUIDED_PROJECTS } from '../data/builderVerseData';
import { OwnProject } from './BuildOwnProjectModal';
import { PortfolioEntry } from './MyBuilderPortfolioModal';
import { CertificateRecord, loadCertificates } from '../utils/certificates';

/**
 * MY SHOWCASE — collect achievements and announce them professionally.
 * Generates honest LinkedIn announcements from REAL completed work and
 * short shareable captions. Never invents accomplishments.
 */

export interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  technologies: string;
  skills: string;
  links: string;
  published: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'bv_showcase_items';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  completedProjectIds: string[];
  completedLessonIds: string[];
  ownProjects: OwnProject[];
  portfolioEntries: PortfolioEntry[];
}

export const ShowcaseModal: React.FC<Props> = ({
  isOpen, onClose, username, completedProjectIds, completedLessonIds, ownProjects, portfolioEntries
}) => {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [editingTitle, setEditingTitle] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        setItems(saved ? JSON.parse(saved) : []);
      } catch {
        setItems([]);
      }
      setEditingTitle('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isOpen]);

  if (!isOpen) return null;

  const lessonCount = completedLessonIds.length;
  const certs: CertificateRecord[] = loadCertificates().filter(c => !c.revoked);

  /** Honest LinkedIn announcement built only from verified real counts. */
  const linkedInDraft = (): string => {
    const projects = completedProjectIds.map(id => GUIDED_PROJECTS.find(p => p.id === id)?.title).filter(Boolean);
    const parts = [
      `One step closer to becoming an Independent Builder! 🌷🎓`,
      ``,
      `Here's what I've genuinely completed on BuilderVerse (free, project-based learning):`
    ];
    parts.push(`• ${lessonCount} interactive lesson${lessonCount === 1 ? '' : 's'} completed`);
    for (const t of projects.slice(0, 5)) parts.push(`• Built: ${t}`);
    for (const o of ownProjects.filter(p => p.status === 'done').slice(0, 3)) {
      parts.push(`• Original project: ${o.title}${o.technology ? ` (${o.technology})` : ''}`);
    }
    if (certs.length > 0) {
      parts.push(`• Certificate${certs.length === 1 ? '' : 's'}: ${certs.map(c => `${c.level} — ${c.courseName}`).join('; ')}`);
    }
    parts.push(``, `Every bug was a clue, not a verdict. On to the next build! 💪`, ``, `#BuilderVerse #LearnToCode #CodingJourney`);
    return parts.join('\n');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    });
  };

  const addItem = () => {
    if (!editingTitle.trim()) return;
    setItems(prev => [...prev, {
      id: 'sc-' + Date.now(),
      title: editingTitle.trim(),
      description: '',
      technologies: '',
      skills: '',
      links: '',
      published: false,
      createdAt: Date.now()
    }]);
    setEditingTitle('');
  };


  /** Short social caption for one real entry. */
  const captionFor = (title: string, tech: string): string =>
    `Just shipped "${title}"${tech ? ` built with ${tech}` : ''}! Another step in my builder journey on BuilderVerse — free, project-based learning. #BuilderVerse #LearnToCode`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col"
        style={{ backgroundColor: 'var(--bv-surface)', borderColor: 'var(--bv-line)', color: 'var(--bv-ink)' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--bv-line)]">
          <div>
            <h2 className="text-lg font-extrabold">📣 My Showcase</h2>
            <p className="text-xs text-[var(--bv-muted)] mt-0.5">
              {username}'s real achievements — announced honestly, never invented.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--bv-muted)] hover:text-[var(--bv-ink)] hover:bg-[var(--bv-surface-2)] transition"
            aria-label="Close showcase"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* LinkedIn announcement from real work */}
          <div className="p-4 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] space-y-2">
            <h3 className="text-xs font-bold">LinkedIn announcement — generated from your real progress</h3>
            <pre className="text-[11px] text-[var(--bv-ink-soft)] leading-relaxed whitespace-pre-wrap p-3 rounded-lg bg-[var(--bv-surface)] border border-[var(--bv-line)] max-h-48 overflow-y-auto">
              {linkedInDraft()}
            </pre>
            <button
              onClick={() => handleCopy('linkedin-draft', linkedInDraft())}
              className="w-full py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition flex items-center justify-center gap-1.5"
            >
              {copiedId === 'linkedin-draft' ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
              {copiedId === 'linkedin-draft' ? 'Copied — edit it in your own voice before posting!' : 'Copy LinkedIn announcement'}
            </button>
            <p className="text-[11px] text-[var(--bv-muted)]">
              Always review and edit before posting. We never post anything for you automatically.
            </p>
          </div>

          {/* Quick-add showcase items from published portfolio */}
          <div className="p-4 rounded-xl border border-dashed border-[var(--bv-line-strong)] space-y-2">
            <h3 className="text-xs font-bold">Quick-add from your published portfolio</h3>
            {portfolioEntries.filter(e => e.published && !items.some(i => i.title === e.title)).map(e => (
              <div key={e.id} className="flex items-center justify-between text-xs gap-2">
                <span className="truncate">🖼️ {e.title}</span>
                <button
                  onClick={() => setItems(prev => [...prev, {
                    id: 'sc-' + Date.now() + '-' + e.id,
                    title: e.title, description: e.description,
                    technologies: e.technologies, skills: e.conceptsLearned,
                    links: [e.liveUrl, e.githubUrl].filter(Boolean).join(' · '),
                    published: false, createdAt: Date.now()
                  }])}
                  className="text-[var(--bv-brand)] font-bold hover:underline shrink-0"
                >
                  + Add
                </button>
              </div>
            ))}
          </div>

          {/* Custom showcase item */}
          <div className="flex gap-2">
            <input
              value={editingTitle}
              onChange={e => setEditingTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              placeholder="e.g. Hackathon project, article, presentation…"
              className="flex-1 px-3 py-2 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs focus:outline-none focus:border-[var(--bv-brand)]"
            />
            <button
              onClick={addItem}
              disabled={!editingTitle.trim()}
              className="px-4 py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition disabled:opacity-40 flex items-center gap-1"
            >
              <Plus className="size-3.5" /> Add
            </button>
          </div>

          {items.map(item => (
            <div key={item.id} className="p-4 rounded-xl border border-[var(--bv-line)] space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <input
                  value={item.title}
                  onChange={e => setItems(prev => prev.map(x => x.id === item.id ? { ...x, title: e.target.value } : x))}
                  className="font-bold text-sm bg-transparent border-b border-transparent hover:border-[var(--bv-line)] focus:border-[var(--bv-brand)] focus:outline-none flex-1 min-w-[160px]"
                />
                <button
                  onClick={() => setItems(prev => prev.map(x => x.id === item.id ? { ...x, published: !x.published } : x))}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition ${item.published ? 'bg-[var(--bv-success-soft)] text-[var(--bv-success)] border-[var(--bv-success)]' : 'bg-[var(--bv-surface-2)] text-[var(--bv-muted)] border-[var(--bv-line)]'}`}
                >
                  {item.published ? 'Published' : 'Draft · private'}
                </button>
              </div>
              <input
                value={item.description}
                onChange={e => setItems(prev => prev.map(x => x.id === item.id ? { ...x, description: e.target.value } : x))}
                placeholder="One honest sentence about it…"
                className="w-full px-3 py-2 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs focus:outline-none focus:border-[var(--bv-brand)]"
              />
              <input
                value={item.technologies}
                onChange={e => setItems(prev => prev.map(x => x.id === item.id ? { ...x, technologies: e.target.value } : x))}
                placeholder="Technologies (comma separated)"
                className="w-full px-3 py-2 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs focus:outline-none focus:border-[var(--bv-brand)]"
              />
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <button
                  onClick={() => handleCopy(item.id, captionFor(item.title, item.technologies))}
                  className="text-xs font-bold flex items-center gap-1 text-[var(--bv-ink-soft)] hover:text-[var(--bv-brand)] transition"
                >
                  {copiedId === item.id ? <CheckCircle2 className="size-3.5 text-[var(--bv-success)]" /> : <Copy className="size-3.5" />}
                  {copiedId === item.id ? 'Caption copied!' : 'Copy social caption'}
                </button>
                <button
                  onClick={() => setItems(prev => prev.filter(x => x.id !== item.id))}
                  className="ml-auto p-1.5 rounded-lg text-[var(--bv-muted)] hover:text-[var(--bv-danger)] hover:bg-[var(--bv-danger-soft)] transition"
                  aria-label="Delete showcase item"
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
