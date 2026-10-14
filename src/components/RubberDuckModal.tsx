import React, { useState } from 'react';
import { X, CheckCircle2, Circle, Sparkles, Terminal, HelpCircle, Heart, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenAi?: () => void;
}

export const RubberDuckModal: React.FC<Props> = ({ isOpen, onClose, onOpenAi }) => {
  if (!isOpen) return null;

  const [step1Checked, setStep1Checked] = useState(false);
  const [step2Checked, setStep2Checked] = useState(false);
  const [step3Checked, setStep3Checked] = useState(false);

  const [bracketCode, setBracketCode] = useState('');
  const [bracketResult, setBracketResult] = useState<{ balanced: boolean; message: string } | null>(null);

  const [duckNotes, setDuckNotes] = useState('');
  const [duckReply, setDuckReply] = useState<string | null>(null);

  const checkBrackets = (code: string) => {
    const stack: { char: string; index: number }[] = [];
    const pairs: Record<string, string> = { ')': '(', '}': '{', ']': '[' };

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      if (char === '(' || char === '{' || char === '[') {
        stack.push({ char, index: i });
      } else if (char === ')' || char === '}' || char === ']') {
        if (stack.length === 0 || stack[stack.length - 1].char !== pairs[char]) {
          setBracketResult({
            balanced: false,
            message: `Unmatched closing bracket "${char}" near character ${i + 1}!`
          });
          return;
        }
        stack.pop();
      }
    }

    if (stack.length > 0) {
      setBracketResult({
        balanced: false,
        message: `Unclosed bracket "${stack[0].char}"! You opened it but never closed it.`
      });
    } else {
      setBracketResult({
        balanced: true,
        message: 'All brackets (), {}, [] match and close cleanly! 🌸'
      });
      setStep2Checked(true);
    }
  };

  const handleTalkToDuck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duckNotes.trim()) return;

    setDuckReply(
      `*Quack!* 🐥 You explained: "${duckNotes.slice(0, 80)}...". Notice how explaining it simply makes the sequence of events clearer? Look closely at the exact variable you passed in right before the problem happens!`
    );
  };

  const allChecked = step1Checked && step2Checked && step3Checked;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
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
            <span className="grid size-10 place-items-center rounded-2xl bg-[var(--bv-brand-soft)] text-2xl">
              🐥
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
                  Step-by-Step Debugger
                </span>
                <span className="text-[11px] text-[var(--bv-muted)]">
                  No panic, just clues
                </span>
              </div>
              <h2 className="text-base font-bold text-[var(--bv-ink)]">
                The Rubber Duck Diagnostic
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="p-4 rounded-2xl bg-[var(--bv-surface-2)]/60 border border-[var(--bv-line)] text-xs text-[var(--bv-ink-soft)] leading-relaxed">
            <strong className="text-[var(--bv-ink)]">Why this works:</strong> Senior engineers keep a rubber duck on their desk. Before looking for complicated causes, running through these 3 physical sanity checks resolves 80% of all programming roadblocks!
          </div>

          {/* 3 Step Checklist */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div 
              className={`p-4 rounded-2xl border transition ${
                step1Checked ? 'bg-[var(--bv-success-soft)]/50 border-[var(--bv-success)]/40' : 'bg-[var(--bv-surface)] border-[var(--bv-line)]'
              }`}
            >
              <div 
                onClick={() => setStep1Checked(!step1Checked)}
                className="flex items-start gap-3 cursor-pointer select-none"
              >
                {step1Checked ? (
                  <CheckCircle2 className="size-5 text-[var(--bv-success)] shrink-0 mt-0.5" />
                ) : (
                  <Circle className="size-5 text-[var(--bv-muted)] shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--bv-ink)]">
                    1. Did you check the browser console?
                  </h4>
                  <p className="text-xs text-[var(--bv-muted)] mt-0.5 leading-relaxed">
                    Open DevTools (<kbd className="px-1.5 py-0.5 bg-[var(--bv-surface-2)] border rounded text-[10px] font-mono">F12</kbd> or <kbd className="px-1.5 py-0.5 bg-[var(--bv-surface-2)] border rounded text-[10px] font-mono">Cmd + Option + I</kbd>). Don't ignore the red text — look at the filename and the exact line number on the right!
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div 
              className={`p-4 rounded-2xl border transition ${
                step2Checked ? 'bg-[var(--bv-success-soft)]/50 border-[var(--bv-success)]/40' : 'bg-[var(--bv-surface)] border-[var(--bv-line)]'
              }`}
            >
              <div 
                onClick={() => setStep2Checked(!step2Checked)}
                className="flex items-start gap-3 cursor-pointer select-none"
              >
                {step2Checked ? (
                  <CheckCircle2 className="size-5 text-[var(--bv-success)] shrink-0 mt-0.5" />
                ) : (
                  <Circle className="size-5 text-[var(--bv-muted)] shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--bv-ink)]">
                    2. Is every opened bracket {"{, (, ["} closed?
                  </h4>
                  <p className="text-xs text-[var(--bv-muted)] mt-0.5 leading-relaxed">
                    Unclosed brackets cause "Unexpected token" or "Unexpected end of input" errors that highlight the wrong line entirely!
                  </p>
                </div>
              </div>

              {/* Bracket test box */}
              <div className="mt-3 pt-3 border-t border-[var(--bv-line)] space-y-2">
                <span className="text-[11px] font-semibold text-[var(--bv-ink-soft)] block">
                  Quick Bracket Validator (Paste code to test balance):
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={bracketCode}
                    onChange={e => setBracketCode(e.target.value)}
                    placeholder="e.g. function test() { if (x > 0) { console.log(x); } }"
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] font-mono text-[var(--bv-ink)]"
                  />
                  <button
                    type="button"
                    onClick={() => checkBrackets(bracketCode)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition"
                  >
                    Check
                  </button>
                </div>

                {bracketResult && (
                  <div className={`p-2.5 rounded-xl text-xs font-medium ${
                    bracketResult.balanced 
                      ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300' 
                      : 'bg-rose-500/10 text-rose-800 dark:text-rose-300'
                  }`}>
                    {bracketResult.message}
                  </div>
                )}
              </div>
            </div>

            {/* Step 3 */}
            <div 
              className={`p-4 rounded-2xl border transition ${
                step3Checked ? 'bg-[var(--bv-success-soft)]/50 border-[var(--bv-success)]/40' : 'bg-[var(--bv-surface)] border-[var(--bv-line)]'
              }`}
            >
              <div 
                onClick={() => setStep3Checked(!step3Checked)}
                className="flex items-start gap-3 cursor-pointer select-none"
              >
                {step3Checked ? (
                  <CheckCircle2 className="size-5 text-[var(--bv-success)] shrink-0 mt-0.5" />
                ) : (
                  <Circle className="size-5 text-[var(--bv-muted)] shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--bv-ink)]">
                    3. Did you inspect the variable right before the error line?
                  </h4>
                  <p className="text-xs text-[var(--bv-muted)] mt-0.5 leading-relaxed">
                    Don't guess what the variable holds. Place <code className="px-1 py-0.5 rounded bg-[var(--bv-surface-2)] text-[var(--bv-brand)] font-mono text-[11px]">console.log("value is:", myVariable);</code> immediately above the line that crashes to verify its actual contents!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Talk out loud section */}
          <div className="p-4 rounded-2xl border border-[var(--bv-line)] bg-[var(--bv-surface-2)]/40 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🐥</span>
              <span className="text-xs font-bold text-[var(--bv-brand)] uppercase tracking-wider">
                Talk Out Loud to the Duck
              </span>
            </div>
            <p className="text-xs text-[var(--bv-muted)]">
              Explain what your code is *supposed* to do, line by line, as if the duck knows nothing about programming.
            </p>

            <form onSubmit={handleTalkToDuck} className="flex gap-2">
              <input
                type="text"
                value={duckNotes}
                onChange={e => setDuckNotes(e.target.value)}
                placeholder="e.g. I have an array of users, and I'm trying to print their names, but..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] text-[var(--bv-ink)] focus:outline-none focus:border-[var(--bv-brand)]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition"
              >
                Quack!
              </button>
            </form>

            {duckReply && (
              <div className="p-3 rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] text-xs text-[var(--bv-ink)] leading-relaxed">
                {duckReply}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--bv-line)] bg-[var(--bv-surface)]">
          <div className="text-xs text-[var(--bv-muted)] flex items-center gap-1.5">
            <Heart className="size-3.5 text-rose-400" />
            <span>Progress: {allChecked ? 'All 3 sanity checks verified!' : 'Review each step carefully'}</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAi && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAi();
                }}
                className="px-4 py-2 rounded-xl bg-[var(--bv-surface-2)] text-[var(--bv-brand)] text-xs font-bold hover:bg-[var(--bv-brand)] hover:text-white transition"
              >
                Still stuck? Ask Sprout AI 🌷
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
