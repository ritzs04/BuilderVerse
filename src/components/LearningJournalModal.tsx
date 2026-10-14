import React, { useState, useEffect } from 'react';
import { X, BookOpen, Lightbulb, Plus, Trash2, Calendar, Tag, CheckCircle2 } from 'lucide-react';

export interface JournalEntry {
  id: string;
  date: string;
  learned: string;
  confused: string;
  win: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'Idea' | 'Planned' | 'Building' | 'Completed';
  notes: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LearningJournalModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'journal' | 'ideas'>('journal');

  // Journal state
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('bv_journal_entries');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        date: 'Today',
        learned: 'Learned how flexbox distributes space between children with justify-content.',
        confused: 'Need to remember difference between align-items and align-content on multi-line flex.',
        win: 'Built a 4-button responsive menu without looking up syntax!'
      }
    ];
  });

  const [newLearned, setNewLearned] = useState('');
  const [newConfused, setNewConfused] = useState('');
  const [newWin, setNewWin] = useState('');

  // Ideas state
  const [ideas, setIdeas] = useState<ProjectIdea[]>(() => {
    const saved = localStorage.getItem('bv_project_ideas');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Study Music Timer with Lo-Fi Beat Sounds',
        topic: 'Web App',
        difficulty: 'Beginner',
        status: 'Building',
        notes: 'A 25-minute Pomodoro timer with relaxing background noise generator.'
      },
      {
        id: '2',
        title: 'Book Recommendation Shelf with Bookmarks',
        topic: 'Portfolio',
        difficulty: 'Beginner',
        status: 'Planned',
        notes: 'Filter books by genre and write personal reviews.'
      }
    ];
  });

  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaTopic, setIdeaTopic] = useState('Web App');
  const [ideaDifficulty, setIdeaDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [ideaNotes, setIdeaNotes] = useState('');

  // Save persistence
  useEffect(() => {
    localStorage.setItem('bv_journal_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('bv_project_ideas', JSON.stringify(ideas));
  }, [ideas]);

  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLearned.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      learned: newLearned.trim(),
      confused: newConfused.trim() || 'Nothing blocking today! Smooth sailing.',
      win: newWin.trim() || 'Showed up and practiced.'
    };

    setEntries(prev => [newEntry, ...prev]);
    setNewLearned('');
    setNewConfused('');
    setNewWin('');
  };

  const handleDeleteJournal = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim()) return;

    const newIdea: ProjectIdea = {
      id: Date.now().toString(),
      title: ideaTitle.trim(),
      topic: ideaTopic,
      difficulty: ideaDifficulty,
      status: 'Idea',
      notes: ideaNotes.trim()
    };

    setIdeas(prev => [newIdea, ...prev]);
    setIdeaTitle('');
    setIdeaNotes('');
  };

  const handleCycleStatus = (id: string) => {
    const order: ProjectIdea['status'][] = ['Idea', 'Planned', 'Building', 'Completed'];
    setIdeas(prev => prev.map(idea => {
      if (idea.id === id) {
        const nextIdx = (order.indexOf(idea.status) + 1) % order.length;
        return { ...idea, status: order[nextIdx] };
      }
      return idea;
    }));
  };

  const handleDeleteIdea = (id: string) => {
    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bv-surface)',
          borderColor: 'var(--bv-line)',
          color: 'var(--bv-ink)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--bv-line)] bg-[var(--bv-surface)]">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-[var(--bv-brand-soft)] text-lg">
              📖
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
                  Personal Space
                </span>
                <span className="text-[11px] text-[var(--bv-muted)]">
                  Private to your browser
                </span>
              </div>
              <h2 className="text-lg font-bold text-[var(--bv-ink)]">
                Learning Journal & Idea Box
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--bv-muted)] hover:text-[var(--bv-ink)] hover:bg-[var(--bv-surface-2)] transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[var(--bv-line)] px-6 bg-[var(--bv-surface-2)]/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('journal')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'journal'
                ? 'border-[var(--bv-brand)] text-[var(--bv-brand)] font-bold'
                : 'border-transparent text-[var(--bv-muted)] hover:text-[var(--bv-ink)]'
            }`}
          >
            <BookOpen className="size-3.5" /> Learning Journal ({entries.length})
          </button>
          <button
            onClick={() => setActiveTab('ideas')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'ideas'
                ? 'border-[var(--bv-brand)] text-[var(--bv-brand)] font-bold'
                : 'border-transparent text-[var(--bv-muted)] hover:text-[var(--bv-ink)]'
            }`}
          >
            <Lightbulb className="size-3.5" /> Project Idea Box ({ideas.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'journal' ? (
            <div className="space-y-6">
              {/* Add New Entry Form */}
              <form onSubmit={handleAddJournal} className="p-4 rounded-2xl border border-[var(--bv-line)] bg-[var(--bv-surface-2)]/50 space-y-3">
                <span className="text-xs font-bold text-[var(--bv-brand)] uppercase tracking-wider block">
                  Write Today's Reflection
                </span>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--bv-ink-soft)] block mb-1">
                    What did you learn today?
                  </label>
                  <input
                    type="text"
                    required
                    value={newLearned}
                    onChange={e => setNewLearned(e.target.value)}
                    placeholder="e.g. Understood why event delegation uses event.target"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] focus:outline-none focus:border-[var(--bv-brand)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--bv-ink-soft)] block mb-1">
                      What felt tricky or confused you?
                    </label>
                    <input
                      type="text"
                      value={newConfused}
                      onChange={e => setNewConfused(e.target.value)}
                      placeholder="e.g. Asynchronous promise chains"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] focus:outline-none focus:border-[var(--bv-brand)]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--bv-ink-soft)] block mb-1">
                      A little win to celebrate:
                    </label>
                    <input
                      type="text"
                      value={newWin}
                      onChange={e => setNewWin(e.target.value)}
                      placeholder="e.g. Finished the CSS box model challenge!"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] focus:outline-none focus:border-[var(--bv-brand)]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="size-3.5" /> Save Journal Entry
                </button>
              </form>

              {/* Existing Entries */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--bv-muted)] block">
                  Past Entries
                </span>

                {entries.map(entry => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-2xl border border-[var(--bv-line)] bg-[var(--bv-surface)] space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[var(--bv-brand)] flex items-center gap-1">
                        <Calendar className="size-3" /> {entry.date}
                      </span>
                      <button
                        onClick={() => handleDeleteJournal(entry.id)}
                        className="text-[var(--bv-muted)] hover:text-rose-500 transition p-1"
                        title="Delete entry"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-[var(--bv-ink)] leading-relaxed">
                      💡 <strong>Learned:</strong> {entry.learned}
                    </p>
                    {entry.confused && (
                      <p className="text-xs text-[var(--bv-muted)] leading-relaxed">
                        🤔 <strong>To review:</strong> {entry.confused}
                      </p>
                    )}
                    {entry.win && (
                      <p className="text-xs text-[var(--bv-success)] font-medium leading-relaxed">
                        🌸 <strong>Win:</strong> {entry.win}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Add Project Idea Form */}
              <form onSubmit={handleAddIdea} className="p-4 rounded-2xl border border-[var(--bv-line)] bg-[var(--bv-surface-2)]/50 space-y-3">
                <span className="text-xs font-bold text-[var(--bv-brand)] uppercase tracking-wider block">
                  Save a New Project Idea
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-[var(--bv-ink-soft)] block mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      required
                      value={ideaTitle}
                      onChange={e => setIdeaTitle(e.target.value)}
                      placeholder="e.g. Cozy Recipe Book with Ingredient Checklist"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] focus:outline-none focus:border-[var(--bv-brand)]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--bv-ink-soft)] block mb-1">
                      Difficulty
                    </label>
                    <select
                      value={ideaDifficulty}
                      onChange={e => setIdeaDifficulty(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)]"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--bv-ink-soft)] block mb-1">
                    Notes / What makes this exciting?
                  </label>
                  <input
                    type="text"
                    value={ideaNotes}
                    onChange={e => setIdeaNotes(e.target.value)}
                    placeholder="e.g. Will use localStorage to remember favorite recipes"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] focus:outline-none focus:border-[var(--bv-brand)]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="size-3.5" /> Save Project Idea
                </button>
              </form>

              {/* Ideas List */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--bv-muted)] block">
                  Your Project Shelf
                </span>

                {ideas.map(idea => (
                  <div
                    key={idea.id}
                    className="p-4 rounded-2xl border border-[var(--bv-line)] bg-[var(--bv-surface)] flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[var(--bv-ink)]">
                          {idea.title}
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bv-surface-2)] text-[var(--bv-ink-soft)]">
                          {idea.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--bv-muted)]">
                        {idea.notes}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCycleStatus(idea.id)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition ${
                          idea.status === 'Completed'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                            : idea.status === 'Building'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-600'
                              : 'bg-[var(--bv-surface-2)] border-[var(--bv-line)] text-[var(--bv-muted)]'
                        }`}
                        title="Click to cycle status"
                      >
                        {idea.status} ↻
                      </button>

                      <button
                        onClick={() => handleDeleteIdea(idea.id)}
                        className="text-[var(--bv-muted)] hover:text-rose-500 p-1"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
