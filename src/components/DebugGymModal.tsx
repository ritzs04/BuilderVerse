import React, { useState } from 'react';
import { DebugPuzzle } from '../data/builderVerseData';
import { X, Bug, CheckCircle2, AlertTriangle, Terminal, Sparkles, HelpCircle, Trophy } from 'lucide-react';

interface Props {
  puzzle: DebugPuzzle | null;
  onClose: () => void;
  onSolve: (puzzleId: string, xp: number) => void;
  isSolved: boolean;
  onAskAi?: (code: string, error: string) => void;
  onTriggerBreak?: (reason: string) => void;
}

export const DebugGymModal: React.FC<Props> = ({ puzzle, onClose, onSolve, isSolved, onAskAi, onTriggerBreak }) => {
  if (!puzzle) return null;

  const [code, setCode] = useState(puzzle.buggyCode);
  const [showHint, setShowHint] = useState(false);
  const [outputLog, setOutputLog] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<'pass' | 'fail' | null>(null);
  const [failCount, setFailCount] = useState(0);

  const handleReset = () => {
    setCode(puzzle.buggyCode);
    setOutputLog(null);
    setTestResult(null);
  };

  const handleRunCode = () => {
    // Basic verification logic for each bug
    let passed = false;
    let log = '';

    if (puzzle.id === 'bug-1') {
      // Must not contain `nam` without being user.name or name defined
      if (code.includes('user.name') || code.includes('user["name"]')) {
        passed = true;
        log = 'Hello, Ava\n[Process completed successfully with code 0]';
      } else if (code.includes('nam') && !code.includes('name')) {
        passed = false;
        log = 'Uncaught ReferenceError: nam is not defined at line 2';
      } else {
        passed = false;
        log = 'Evaluation did not output expected greeting "Hello, Ava"';
      }
    } else if (puzzle.id === 'bug-2') {
      if (code.includes('< frameworks.length') && !code.includes('<= frameworks.length')) {
        passed = true;
        log = 'REACT\nVUE\nSVELTE\n[Process completed successfully with code 0]';
      } else if (code.includes('<= frameworks.length')) {
        passed = false;
        log = 'REACT\nVUE\nSVELTE\nTypeError: Cannot read properties of undefined (reading \'toUpperCase\') at index 3';
      } else {
        passed = false;
        log = 'Array bounds check failed. Did you iterate through all elements cleanly?';
      }
    } else if (puzzle.id === 'bug-3') {
      if (code.includes('Promise') || code.includes('async') || code.includes('resolve')) {
        passed = true;
        log = 'Promise resolved with total: 110.00\n[Process completed successfully with code 0]';
      } else {
        passed = false;
        log = 'Return value was undefined! Synchronous return occurred before callback finished.';
      }
    }

    setOutputLog(log);
    setTestResult(passed ? 'pass' : 'fail');

    if (passed && !isSolved) {
      onSolve(puzzle.id, puzzle.xp);
    } else if (!passed) {
      const nextFail = failCount + 1;
      setFailCount(nextFail);
      if (nextFail >= 3) {
        setTimeout(() => {
          onTriggerBreak?.("You've tested this debugging fix 3 times without passing. Step back for a 5-minute breather, drink some water, then look at the clues with fresh eyes! 🌸");
        }, 1200);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl border shadow-2xl p-6 sm:p-8"
        style={{
          backgroundColor: 'var(--bv-surface)',
          borderColor: 'var(--bv-line)',
          color: 'var(--bv-ink)'
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--bv-line)]">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-rose-500/10 text-rose-600 font-bold text-lg">
              <Bug className="size-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Error Companion</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600">
                  {puzzle.bugType}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
                  +{puzzle.xp} XP
                </span>
                {isSolved && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="size-3.5" /> Solved
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mt-1 text-[var(--bv-ink)]">{puzzle.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--bv-muted)] hover:text-[var(--bv-ink)] hover:bg-[var(--bv-surface-2)] transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Code Editor and Console */}
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--bv-muted)]">
            <span className="font-semibold text-[var(--bv-ink-soft)]">Fix the bug in the editor below:</span>
            <div className="flex gap-2">
              <button 
                onClick={handleReset}
                className="hover:text-[var(--bv-ink)] transition"
              >
                Reset snippet
              </button>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 text-[var(--bv-brand)] font-semibold hover:underline"
              >
                <HelpCircle className="size-3.5" /> {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            </div>
          </div>

          {showHint && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-2">
              <Sparkles className="size-4 shrink-0 mt-0.5 text-amber-500" />
              <div>
                <strong>Hint:</strong> {puzzle.hint}
              </div>
            </div>
          )}

          {/* Interactive Code Editor */}
          <div className="relative rounded-xl overflow-hidden border border-zinc-700/60 bg-zinc-950 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-zinc-400 select-none">
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full bg-rose-500/80" />
                <div className="size-2.5 rounded-full bg-amber-500/80" />
                <div className="size-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-[11px] font-sans">solution.js</span>
              </div>
              <span className="text-[11px]">JavaScript ES2024</span>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              rows={6}
              spellCheck={false}
              className="w-full p-4 bg-transparent text-emerald-400 font-mono text-xs leading-relaxed resize-none focus:outline-none"
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onAskAi?.(code, puzzle.consoleError)}
                className="px-3 py-1.5 rounded-xl bg-[var(--bv-surface-2)] text-[var(--bv-brand)] hover:bg-[var(--bv-brand)] hover:text-white text-xs font-semibold transition flex items-center gap-1.5 border border-[var(--bv-line)]"
              >
                <span>🌷 Ask Sprout AI: Why this bug?</span>
              </button>
            </div>
            <button
              onClick={handleRunCode}
              className="px-5 py-2.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-md flex items-center gap-2"
            >
              <Terminal className="size-3.5" />
              Run & Verify Fix
            </button>
          </div>

          {/* Simulated Console Output */}
          <div className="rounded-xl overflow-hidden border border-[var(--bv-line)] bg-zinc-900 text-zinc-300 font-mono text-xs">
            <div className="px-3.5 py-1.5 bg-zinc-950 border-b border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Terminal className="size-3 text-zinc-500" />
                Console Output
              </span>
              {testResult === 'pass' && (
                <span className="text-emerald-400 font-sans font-bold flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> All Tests Passed (+{puzzle.xp} XP)
                </span>
              )}
              {testResult === 'fail' && (
                <span className="text-rose-400 font-sans font-bold flex items-center gap-1">
                  <AlertTriangle className="size-3.5" /> Error Detected
                </span>
              )}
            </div>
            <div className="p-3.5 whitespace-pre-wrap leading-relaxed min-h-[60px]">
              {outputLog || puzzle.consoleError}
            </div>
          </div>

          {/* Test Pass Banner */}
          {testResult === 'pass' && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-3">
              <Trophy className="size-5 shrink-0 text-emerald-500" />
              <div>
                <strong>Bug squashed!</strong> You earned +{puzzle.xp} XP. The fix runs cleanly without throwing unhandled exceptions.
              </div>
            </div>
          )}

          {/* Error Companion Philosophy Box */}
          <div className="mt-4 p-4 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)] mb-1">
              Every bug is a puzzle — never a scolding
            </h4>
            <p className="text-xs text-[var(--bv-ink-soft)] leading-relaxed">
              {puzzle.companionLesson}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
