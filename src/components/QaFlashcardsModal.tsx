import React, { useState } from 'react';
import { X, Sparkles, HelpCircle, RotateCw, CheckCircle2, BookOpen } from 'lucide-react';

interface Flashcard {
  id: string;
  category: 'DOM' | 'JS' | 'CSS' | 'Git';
  question: string;
  shortDiagnosis: string;
  solutionCode?: string;
  proTip: string;
}

const FLASHCARDS: Flashcard[] = [
  {
    id: '1',
    category: 'DOM',
    question: 'Why did my image not load on the page?',
    shortDiagnosis: 'Almost always 1 of 3 things: 1) Relative path is off by a folder (e.g. "./img" vs "../img"), 2) Case-sensitivity mismatch (Linux servers treat "Dog.PNG" and "dog.png" differently), or 3) Typo in the file extension.',
    solutionCode: `<!-- Good: absolute relative to public or root -->
<img src="/assets/cat.png" alt="Mochi Cat" />

<!-- Check Network tab in DevTools: look for 404 Not Found -->`,
    proTip: 'Always inspect the DevTools Network tab to see the exact URL the browser attempted to download!'
  },
  {
    id: '2',
    category: 'DOM',
    question: 'Why isn\'t my click event listener firing?',
    shortDiagnosis: 'Your JavaScript ran before the HTML button existed in the DOM, or your querySelector had a typo (like forgetting the dot on a class name).',
    solutionCode: `// ❌ If script is in <head> without defer, element is null:
const btn = document.querySelector(".btn-save"); // null!

// ✅ Solution 1: Use defer in HTML:
// <script defer src="app.js"></script>

// ✅ Solution 2: Event delegation:
document.body.addEventListener("click", (e) => {
  if (e.target.matches(".btn-save")) { ... }
});`,
    proTip: 'Always check if document.querySelector returned null by doing console.log(btn).'
  },
  {
    id: '3',
    category: 'JS',
    question: 'Why does 10 + "5" equal "105" instead of 15?',
    shortDiagnosis: 'JavaScript sees a string on the right side of the plus (+) operator and automatically converts the number 10 into a string, concatenating them!',
    solutionCode: `const a = 10;
const b = "5";

console.log(a + b);       // "105" (string concatenation)
console.log(a + Number(b)); // 15 (explicit numeric addition)
console.log(a + +b);      // 15 (unary plus shorthand)`,
    proTip: 'Input elements (<input type="number">) always return strings in .value! Wrap with parseInt() or Number().'
  },
  {
    id: '4',
    category: 'Git',
    question: 'How do I fix a "detached HEAD" state in Git?',
    shortDiagnosis: 'A "detached HEAD" means your repository pointer is looking directly at a specific commit instead of a named branch (like main). Your work is NOT lost!',
    solutionCode: `# 1. Save your current detached work into a new branch:
git switch -c rescue-my-work

# 2. Or if you made no changes and just want to go back to main:
git switch main`,
    proTip: 'Detached HEAD sounds scary, but it just means Git is letting you time-travel to a past commit.'
  },
  {
    id: '5',
    category: 'JS',
    question: 'Why does my form submit reload the whole webpage?',
    shortDiagnosis: 'By default, HTML forms submit data using a full page reload or POST navigation. To handle it with JavaScript, call event.preventDefault().',
    solutionCode: `form.addEventListener("submit", (event) => {
  event.preventDefault(); // 🛑 Stops full-page reload!
  
  // Now handle with JavaScript smoothly
  const email = event.target.elements.email.value;
  saveUser(email);
});`,
    proTip: 'Always make event.preventDefault() the very first line of your form submit handler.'
  },
  {
    id: '6',
    category: 'CSS',
    question: 'Why is my element wider than the width I specified?',
    shortDiagnosis: 'By default, browsers use "box-sizing: content-box". That means if width is 300px and you add 20px padding and 2px border, the rendered width becomes 344px!',
    solutionCode: `/* The universal CSS fix: */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Now width: 300px absorbs padding inside itself! */`,
    proTip: 'Add "box-sizing: border-box" to the top of every CSS project you ever start.'
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const QaFlashcardsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeCategory, setActiveCategory] = useState<'All' | 'DOM' | 'JS' | 'CSS' | 'Git'>('All');
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlippedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCards = activeCategory === 'All'
    ? FLASHCARDS
    : FLASHCARDS.filter(c => c.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl h-[88vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bv-surface)',
          borderColor: 'var(--bv-line)',
          color: 'var(--bv-ink)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--bv-line)] bg-[var(--bv-surface)]">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[var(--bv-brand-soft)] text-2xl">
              🗂️
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
                  Peer Help & Knowledge Deck
                </span>
                <span className="text-[11px] text-[var(--bv-muted)]">
                  Common beginner obstacles
                </span>
              </div>
              <h2 className="text-base font-bold text-[var(--bv-ink)]">
                Guided Q&A Flashcards
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

        {/* Category Pills */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-[var(--bv-line)] bg-[var(--bv-surface-2)]/40 overflow-x-auto text-xs">
          <span className="font-semibold text-[var(--bv-muted)] text-[11px] whitespace-nowrap">Filter topic:</span>
          {(['All', 'DOM', 'JS', 'CSS', 'Git'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-xl font-bold transition text-xs whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[var(--bv-brand)] text-white shadow-xs'
                  : 'bg-[var(--bv-surface)] text-[var(--bv-ink-soft)] border border-[var(--bv-line)] hover:border-[var(--bv-brand)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Flashcards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCards.map(card => {
              const isFlipped = Boolean(flippedIds[card.id]);

              return (
                <div
                  key={card.id}
                  onClick={() => toggleFlip(card.id)}
                  className={`p-5 rounded-2xl border cursor-pointer select-none transition-all duration-300 flex flex-col justify-between min-h-[220px] shadow-sm relative ${
                    isFlipped
                      ? 'bg-[var(--bv-surface-2)]/70 border-[var(--bv-brand)]'
                      : 'bg-[var(--bv-surface)] border-[var(--bv-line)] hover:border-[var(--bv-line-strong)] hover:-translate-y-0.5'
                  }`}
                >
                  <div>
                    {/* Top pill row */}
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--bv-line)] mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--bv-brand-soft)] text-[var(--bv-brand)]">
                        {card.category}
                      </span>
                      <span className="text-[11px] font-semibold text-[var(--bv-muted)] flex items-center gap-1">
                        <RotateCw className="size-3" /> {isFlipped ? 'Show Question' : 'Flip for Fix'}
                      </span>
                    </div>

                    {!isFlipped ? (
                      <div className="space-y-3">
                        <h3 className="font-bold text-sm sm:text-base text-[var(--bv-ink)] leading-snug">
                          {card.question}
                        </h3>
                        <p className="text-xs text-[var(--bv-muted)]">
                          Click anywhere on this card to reveal the human diagnosis and verified code snippet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs text-[var(--bv-ink)] leading-relaxed font-medium">
                          💡 {card.shortDiagnosis}
                        </p>

                        {card.solutionCode && (
                          <div className="p-3 rounded-xl bg-zinc-950 text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto border border-zinc-800">
                            <pre><code>{card.solutionCode}</code></pre>
                          </div>
                        )}

                        <div className="text-[11px] text-[var(--bv-brand)] font-semibold">
                          ⭐ Pro-Tip: {card.proTip}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[var(--bv-line)] flex items-center justify-between text-[11px] text-[var(--bv-muted)]">
                    <span>Card #{card.id}</span>
                    <span className="font-bold text-[var(--bv-brand)]">
                      {isFlipped ? '✓ Solution Revealed' : 'Tap to Flip ↻'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--bv-line)] bg-[var(--bv-surface)] flex items-center justify-between text-xs text-[var(--bv-muted)]">
          <span>Remember: Asking questions is a sign of high curiosity, not weakness. 🌷</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[var(--bv-brand)] text-white font-bold hover:bg-[var(--bv-brand-strong)] transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
