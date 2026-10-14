/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Lightbulb, Plus, ThumbsUp, Sparkles, X, CheckCircle2, MessageSquarePlus, Tag } from 'lucide-react';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: 'Lesson Topic' | 'Guided Project' | 'Tool / Feature' | 'UI & Styling';
  upvotes: number;
  author: string;
  createdAt: string;
  upvotedByMe?: boolean;
}

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

const DEFAULT_SUGGESTIONS: Suggestion[] = [
  {
    id: 'sug-1',
    title: 'Tailwind CSS Grid & Flexbox Masterclass',
    description: 'Add a dedicated interactive mini-game or visual playground specifically for mastering CSS grid layouts and flexbox alignment.',
    category: 'Lesson Topic',
    upvotes: 42,
    author: 'Maya S.',
    createdAt: '2026-10-10'
  },
  {
    id: 'sug-2',
    title: 'Real-time HTML/CSS Live Preview Sandbox',
    description: 'A dedicated side-by-side split screen where developers can test live HTML templates with instant CSS styling and JS console logs.',
    category: 'Tool / Feature',
    upvotes: 35,
    author: 'Alex B.',
    createdAt: '2026-10-11'
  },
  {
    id: 'sug-3',
    title: 'Build a Portfolio Website Project',
    description: 'Step-by-step guided project for building a modern personal portfolio website with dark mode toggle and responsive mobile menu.',
    category: 'Guided Project',
    upvotes: 29,
    author: 'Jordan K.',
    createdAt: '2026-10-12'
  },
  {
    id: 'sug-4',
    title: 'TypeScript Generics & Utility Types Cheat Sheet',
    description: 'Add an interactive quick reference and quiz for TypeScript utility types like Partial, Omit, Record, and Pick.',
    category: 'Lesson Topic',
    upvotes: 21,
    author: 'Sam R.',
    createdAt: '2026-10-13'
  }
];

export const SuggestionModal: React.FC<SuggestionModalProps> = ({
  isOpen,
  onClose,
  username
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => {
    const saved = localStorage.getItem('bv_suggestions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_SUGGESTIONS;
      }
    }
    return DEFAULT_SUGGESTIONS;
  });

  const [activeTab, setActiveTab] = useState<'browse' | 'submit' | 'ai-picks'>('browse');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<Suggestion['category']>('Lesson Topic');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('bv_suggestions', JSON.stringify(suggestions));
  }, [suggestions]);

  if (!isOpen) return null;

  const handleUpvote = (id: string) => {
    setSuggestions(prev => prev.map(s => {
      if (s.id === id) {
        const isUpvoted = s.upvotedByMe;
        return {
          ...s,
          upvotes: isUpvoted ? s.upvotes - 1 : s.upvotes + 1,
          upvotedByMe: !isUpvoted
        };
      }
      return s;
    }));
  };

  const handleCreateSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newItem: Suggestion = {
      id: 'sug-' + Date.now(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      upvotes: 1,
      author: username || 'Builder',
      createdAt: new Date().toISOString().slice(0, 10),
      upvotedByMe: true
    };

    setSuggestions(prev => [newItem, ...prev]);
    setNewTitle('');
    setNewDesc('');
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setActiveTab('browse');
    }, 1200);
  };

  const filteredSuggestions = suggestions.filter(s => {
    if (filterCategory === 'All') return true;
    return s.category === filterCategory;
  }).sort((a, b) => b.upvotes - a.upvotes);

  const aiSuggestedTopics = [
    {
      title: 'React Hooks Deep Dive: useEffect & useMemo',
      desc: 'Interactive tutorial explaining when and how to optimize React re-renders with memoization and cleanup functions.',
      category: 'Lesson Topic' as const
    },
    {
      title: 'CSS Custom Properties & Theme Switcher',
      desc: 'Build a dynamic website theme manager using CSS root variables and persistent localStorage state.',
      category: 'Guided Project' as const
    },
    {
      title: 'Async/Await & Fetch API Error Handling',
      desc: 'Robust patterns for handling network timeouts, JSON parsing errors, and fallback UI states in web apps.',
      category: 'Lesson Topic' as const
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border flex flex-col"
        style={{
          backgroundColor: 'var(--bv-surface)',
          borderColor: 'var(--bv-line)'
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: 'var(--bv-surface)',
            borderColor: 'var(--bv-line)'
          }}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-amber-500/10 text-amber-500 font-bold text-lg">
              💡
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-[var(--bv-ink)]">
                Builder Suggestion Box
              </h2>
              <p className="text-xs text-[var(--bv-muted)]">
                Suggest new website programming lessons, projects, or features!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--bv-muted)] hover:text-[var(--bv-ink)] hover:bg-[var(--bv-surface-2)] transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 flex items-center gap-2 border-b" style={{ borderColor: 'var(--bv-line)' }}>
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 -mb-px flex items-center gap-1.5 ${activeTab === 'browse' ? 'border-[var(--bv-brand)] text-[var(--bv-brand)] bg-[var(--bv-brand-soft)]/30' : 'border-transparent text-[var(--bv-muted)] hover:text-[var(--bv-ink)]'}`}
          >
            <Lightbulb className="size-3.5" />
            Browse & Vote ({suggestions.length})
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 -mb-px flex items-center gap-1.5 ${activeTab === 'submit' ? 'border-[var(--bv-brand)] text-[var(--bv-brand)] bg-[var(--bv-brand-soft)]/30' : 'border-transparent text-[var(--bv-muted)] hover:text-[var(--bv-ink)]'}`}
          >
            <Plus className="size-3.5" />
            Submit Idea
          </button>
          <button
            onClick={() => setActiveTab('ai-picks')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 -mb-px flex items-center gap-1.5 ${activeTab === 'ai-picks' ? 'border-[var(--bv-brand)] text-[var(--bv-brand)] bg-[var(--bv-brand-soft)]/30' : 'border-transparent text-[var(--bv-muted)] hover:text-[var(--bv-ink)]'}`}
          >
            <Sparkles className="size-3.5" />
            AI Recommendations
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1">
          {activeTab === 'browse' && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pb-2">
                {['All', 'Lesson Topic', 'Guided Project', 'Tool / Feature', 'UI & Styling'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${filterCategory === cat ? 'bg-[var(--bv-brand)] text-white shadow-xs' : 'bg-[var(--bv-surface-2)] text-[var(--bv-ink-soft)] hover:text-[var(--bv-ink)]'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Suggestion Cards */}
              <div className="space-y-3">
                {filteredSuggestions.map(s => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl border bg-[var(--bv-surface-2)]/50 hover:border-[var(--bv-brand)]/40 transition flex items-start gap-4"
                    style={{ borderColor: 'var(--bv-line)' }}
                  >
                    {/* Upvote Button */}
                    <button
                      onClick={() => handleUpvote(s.id)}
                      className={`flex flex-col items-center justify-center min-w-[50px] p-2 rounded-xl border transition ${s.upvotedByMe ? 'bg-[var(--bv-brand)] text-white border-[var(--bv-brand)] shadow-xs' : 'bg-[var(--bv-surface)] text-[var(--bv-ink)] border-[var(--bv-line)] hover:border-[var(--bv-brand)]'}`}
                    >
                      <ThumbsUp className={`size-4 ${s.upvotedByMe ? 'fill-white' : ''}`} />
                      <span className="text-xs font-extrabold mt-1">{s.upvotes}</span>
                    </button>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-[var(--bv-brand-soft)] text-[var(--bv-brand)] text-[10px] font-extrabold tracking-wide uppercase">
                          {s.category}
                        </span>
                        <span className="text-[11px] text-[var(--bv-muted)]">
                          Suggested by {s.author} · {s.createdAt}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[var(--bv-ink)] mb-1">
                        {s.title}
                      </h3>
                      <p className="text-xs text-[var(--bv-ink-soft)] leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'submit' && (
            <form onSubmit={handleCreateSuggestion} className="space-y-4 max-w-lg mx-auto py-2">
              {submittedSuccess ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="size-10 text-emerald-500 mx-auto animate-bounce" />
                  <h3 className="text-base font-bold text-[var(--bv-ink)]">Suggestion Submitted Successfully!</h3>
                  <p className="text-xs text-[var(--bv-muted)]">Thank you for helping shape BuilderVerse with your ideas.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[var(--bv-ink)] mb-1.5">
                      Suggestion Title
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="e.g. Interactive CSS Flexbox Froggy-style mini-game"
                      className="w-full px-4 py-2.5 rounded-xl border bg-[var(--bv-surface-2)] text-xs text-[var(--bv-ink)] focus:outline-none focus:border-[var(--bv-brand)] transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--bv-ink)] mb-1.5">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as Suggestion['category'])}
                      className="w-full px-4 py-2.5 rounded-xl border bg-[var(--bv-surface-2)] text-xs text-[var(--bv-ink)] focus:outline-none focus:border-[var(--bv-brand)] transition"
                    >
                      <option value="Lesson Topic">Lesson Topic</option>
                      <option value="Guided Project">Guided Project</option>
                      <option value="Tool / Feature">Tool / Feature</option>
                      <option value="UI & Styling">UI & Styling</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--bv-ink)] mb-1.5">
                      Description & Details
                    </label>
                    <textarea
                      value={newDesc}
                      onChange={e => setNewDesc(e.target.value)}
                      rows={4}
                      placeholder="Describe what you'd love to see, why it's useful for web developers, and how it should work..."
                      className="w-full px-4 py-2.5 rounded-xl border bg-[var(--bv-surface-2)] text-xs text-[var(--bv-ink)] focus:outline-none focus:border-[var(--bv-brand)] transition resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[var(--bv-brand)] text-white font-bold text-xs shadow-md hover:bg-[var(--bv-brand-strong)] transition flex items-center justify-center gap-2"
                  >
                    <MessageSquarePlus className="size-4" />
                    Submit Suggestion to Community
                  </button>
                </>
              )}
            </form>
          )}

          {activeTab === 'ai-picks' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[var(--bv-brand-soft)] border border-[var(--bv-brand)]/30 flex items-center gap-3">
                <span className="text-2xl">🌷</span>
                <div>
                  <h4 className="text-xs font-bold text-[var(--bv-ink)]">Sprout AI Curriculum Suggestions</h4>
                  <p className="text-[11px] text-[var(--bv-muted)]">Curated web programming topics tailored to elevate your development skills.</p>
                </div>
              </div>

              <div className="space-y-3">
                {aiSuggestedTopics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border bg-[var(--bv-surface-2)]/50 space-y-2"
                    style={{ borderColor: 'var(--bv-line)' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-extrabold tracking-wide uppercase">
                        {topic.category}
                      </span>
                      <span className="text-[10px] font-bold text-amber-500">✨ AI Recommended</span>
                    </div>
                    <h3 className="text-sm font-bold text-[var(--bv-ink)]">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-[var(--bv-ink-soft)] leading-relaxed">
                      {topic.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between text-xs text-[var(--bv-muted)]"
          style={{ borderColor: 'var(--bv-line)' }}
        >
          <span>BuilderVerse Community Suggestions</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[var(--bv-surface-2)] font-bold text-[var(--bv-ink)] hover:border-[var(--bv-brand)] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
