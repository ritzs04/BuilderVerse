import React, { useState } from 'react';
import { ThinkingPuzzle } from '../data/builderVerseData';
import { X, CheckCircle2, AlertCircle, Lightbulb, Flame, RefreshCw, Trophy, ArrowRight, Brain } from 'lucide-react';

interface Props {
  puzzle: ThinkingPuzzle | null;
  onClose: () => void;
  onSolve: (puzzleId: string, xpEarned: number) => void;
  isSolved: boolean;
  onAskAi?: (question: string) => void;
  onTriggerBreak?: (reason: string) => void;
}

export const ThinkingGymModal: React.FC<Props> = ({ puzzle, onClose, onSolve, isSolved, onAskAi, onTriggerBreak }) => {
  if (!puzzle) return null;

  // State for Switch Puzzle
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(false);
  const [switch3, setSwitch3] = useState(false);
  const [switch1Warmed, setSwitch1Warmed] = useState(false);
  const [isUpstairs, setIsUpstairs] = useState(false);
  const [touchedBulb, setTouchedBulb] = useState(false);
  const [selectedSwitchAnswer, setSelectedSwitchAnswer] = useState<number | null>(null);

  // State for Fencepost Puzzle
  const [rowCount, setRowCount] = useState<number>(10);
  const [fencepostAnswer, setFencepostAnswer] = useState<string>('');

  // State for Edge Cases
  const [customTestInput, setCustomTestInput] = useState<string>('[]');
  const [edgeCaseResults, setEdgeCaseResults] = useState<{ input: string; status: 'broken' | 'ok'; note: string }[]>([]);

  // Feedback state
  const [feedback, setFeedback] = useState<{ status: 'correct' | 'wrong' | null; message: string }>({
    status: null,
    message: ''
  });
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const resetSwitches = () => {
    setSwitch1(false);
    setSwitch2(false);
    setSwitch3(false);
    setSwitch1Warmed(false);
    setIsUpstairs(false);
    setTouchedBulb(false);
    setSelectedSwitchAnswer(null);
    setFeedback({ status: null, message: '' });
  };

  const handleWarmUp = () => {
    if (switch1) {
      setSwitch1Warmed(true);
      setFeedback({ status: null, message: 'Time passed (5 minutes). Switch 1 was ON, so if it controls the bulb, the filament is now hot!' });
    } else {
      setFeedback({ status: null, message: 'Time passed, but Switch 1 was OFF, so no heat accumulated.' });
    }
  };

  // Truth: In our puzzle simulation, Switch 1 is the one wired to the bulb!
  const isBulbLit = switch1;
  const isBulbHot = switch1Warmed;

  const submitSwitchGuess = () => {
    if (selectedSwitchAnswer === null) return;
    if (selectedSwitchAnswer === 1) {
      setFeedback({
        status: 'correct',
        message: 'Spot on! You used the heat property of the bulb to create a 3rd distinct state, turning a 1-bit signal into 3 distinguishable outcomes!'
      });
      if (!isSolved) onSolve(puzzle.id, puzzle.xp);
    } else {
      const nextWrong = wrongAttempts + 1;
      setWrongAttempts(nextWrong);
      setFeedback({
        status: 'wrong',
        message: `Incorrect! Switch ${selectedSwitchAnswer} was not connected to the bulb. Review the heat and light states downstairs vs upstairs!`
      });
      if (nextWrong >= 3) {
        setTimeout(() => {
          onTriggerBreak?.("You've tried this thinking puzzle 3 times! Remember: take a 5-minute tea break. The best debugging often happens away from the screen.");
        }, 1200);
      }
    }
  };

  const submitFencepost = () => {
    const parsed = parseInt(fencepostAnswer.trim());
    if (parsed === 9) {
      setFeedback({
        status: 'correct',
        message: 'Correct! There are exactly 9 separators between 10 rows. Remember: N posts have (N - 1) gaps.'
      });
      if (!isSolved) onSolve(puzzle.id, puzzle.xp);
    } else {
      const nextWrong = wrongAttempts + 1;
      setWrongAttempts(nextWrong);
      setFeedback({
        status: 'wrong',
        message: `Not quite ${fencepostAnswer}. Count the gaps between the rows carefully: every separator sits BETWEEN two rows.`
      });
      if (nextWrong >= 3) {
        setTimeout(() => {
          onTriggerBreak?.("You've tested this puzzle 3 times! Take a short breath and let your mind relax.");
        }, 1200);
      }
    }
  };

  const testEdgeCase = (inputStr: string) => {
    try {
      // Simulate running a naive average function
      let parsed: any;
      try {
        parsed = JSON.parse(inputStr);
      } catch {
        parsed = inputStr;
      }

      let status: 'broken' | 'ok' = 'ok';
      let note = '';

      if (!Array.isArray(parsed)) {
        status = 'broken';
        note = 'Crash! Passed a non-array; function throws TypeError when attempting .reduce() or .length';
      } else if (parsed.length === 0) {
        status = 'broken';
        note = 'Bug exposed! 0 / 0 returns NaN in JavaScript instead of a clean 0 or null.';
      } else if (parsed.some(x => typeof x !== 'number' || isNaN(x))) {
        status = 'broken';
        note = 'Bug exposed! String concatenation or NaN infected the arithmetic!';
      } else if (parsed.some(x => x < 0 || x > 100)) {
        note = 'Out of bound exam score! Needs range validation.';
      } else {
        const avg = parsed.reduce((a: number, b: number) => a + b, 0) / parsed.length;
        note = `Computed average: ${avg.toFixed(2)}. Normal flow.`;
      }

      setEdgeCaseResults(prev => [{ input: inputStr, status, note }, ...prev.slice(0, 4)]);
      if (status === 'broken' && !isSolved) {
        onSolve(puzzle.id, puzzle.xp);
        setFeedback({
          status: 'correct',
          message: 'Awesome catch! You exposed a flaw in the function implementation before it reached production!'
        });
      }
    } catch (err: any) {
      setEdgeCaseResults(prev => [{ input: inputStr, status: 'broken', note: `Syntax error: ${err.message}` }, ...prev.slice(0, 4)]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl p-6 sm:p-8"
        style={{
          backgroundColor: 'var(--bv-surface)',
          borderColor: 'var(--bv-line)',
          color: 'var(--bv-ink)'
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--bv-line)]">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-purple-500/10 text-purple-600 font-bold text-lg">
              <Brain className="size-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">Thinking Gym</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                  {puzzle.difficulty}
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

        {/* Puzzle Context & Prompt */}
        <div className="mt-5 space-y-4">
          <p className="text-base font-medium leading-relaxed text-[var(--bv-ink)]">
            {puzzle.question}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs text-[var(--bv-muted)] leading-relaxed">
            <div>
              💡 <strong className="text-[var(--bv-ink)]">Why this matters:</strong> {puzzle.context}
            </div>
            <button
              type="button"
              onClick={() => onAskAi?.(puzzle.question)}
              className="px-3 py-1.5 rounded-lg bg-[var(--bv-surface)] text-[var(--bv-brand)] hover:bg-[var(--bv-brand)] hover:text-white border border-[var(--bv-line)] font-bold text-xs transition flex items-center gap-1 shrink-0"
            >
              <span>🌷 Ask Sprout AI for a Gentle Hint</span>
            </button>
          </div>
        </div>

        {/* Interactive Lab Section */}
        <div className="mt-6 p-5 rounded-2xl border border-[var(--bv-line)] bg-[var(--bv-surface-2)]/60">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--bv-ink-soft)] mb-4 flex items-center gap-2">
            <span>Interactive Simulator</span>
            <span className="text-[11px] font-normal text-[var(--bv-muted)]">— test your hypothesis in real time</span>
          </h3>

          {/* Type 1: Switches & Bulb */}
          {puzzle.interactiveType === 'switches' && (
            <div className="space-y-6">
              {!isUpstairs ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <span>📍 Downstairs Room (Switches)</span>
                    </h4>
                    <button 
                      onClick={resetSwitches}
                      className="text-xs flex items-center gap-1 text-[var(--bv-muted)] hover:text-[var(--bv-ink)]"
                    >
                      <RefreshCw className="size-3" /> Reset
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { num: 1, state: switch1, set: setSwitch1 },
                      { num: 2, state: switch2, set: setSwitch2 },
                      { num: 3, state: switch3, set: setSwitch3 }
                    ].map(sw => (
                      <div 
                        key={sw.num}
                        onClick={() => sw.set(!sw.state)}
                        className={`cursor-pointer select-none p-4 rounded-xl border text-center transition ${
                          sw.state 
                            ? 'bg-[var(--bv-brand)]/15 border-[var(--bv-brand)] text-[var(--bv-brand)] shadow-sm' 
                            : 'bg-[var(--bv-surface)] border-[var(--bv-line)] hover:border-[var(--bv-line-strong)]'
                        }`}
                      >
                        <div className="text-xs font-semibold text-[var(--bv-muted)]">Switch {sw.num}</div>
                        <div className="text-lg font-bold mt-1">
                          {sw.state ? '⚡ ON' : '⚪ OFF'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleWarmUp}
                      className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[var(--bv-surface)] border border-[var(--bv-line)] hover:border-[var(--bv-brand)] transition flex items-center gap-2 text-[var(--bv-ink)]"
                    >
                      <Flame className="size-3.5 text-amber-500" />
                      Wait 5 minutes (let filament warm)
                    </button>

                    <button
                      onClick={() => setIsUpstairs(true)}
                      className="ml-auto px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--bv-brand)] text-white hover:bg-[var(--bv-brand-strong)] transition flex items-center gap-1.5 shadow-sm"
                    >
                      Walk Upstairs (One-time visit!) <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)]">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-sm">📍 Upstairs Sealed Room (Single Bulb)</h4>
                    <button
                      onClick={() => setIsUpstairs(false)}
                      className="text-xs text-[var(--bv-muted)] hover:underline"
                    >
                      ← Return downstairs (Reset)
                    </button>
                  </div>

                  <div className="flex flex-col items-center justify-center py-6 gap-3">
                    <div className={`size-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isBulbLit 
                        ? 'bg-amber-400 text-amber-950 shadow-[0_0_30px_rgba(251,191,36,0.8)] scale-110' 
                        : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      <Lightbulb className="size-10" />
                    </div>

                    <div className="text-center">
                      <div className="font-bold text-sm">
                        Bulb Visual State: {isBulbLit ? '✨ GLOWING BRIGHTLY' : '🌑 DARK / OFF'}
                      </div>
                      <div className="text-xs text-[var(--bv-muted)] mt-1">
                        {touchedBulb ? (
                          <span className="font-semibold text-amber-600 dark:text-amber-400">
                            ✋ Physical Check: Bulb feels {isBulbHot ? '🔥 HOT TO THE TOUCH' : '❄️ COLD TO THE TOUCH'}!
                          </span>
                        ) : (
                          'You haven\'t touched the glass yet.'
                        )}
                      </div>
                    </div>

                    {!touchedBulb && (
                      <button
                        onClick={() => setTouchedBulb(true)}
                        className="mt-2 text-xs px-3 py-1.5 rounded-lg border border-[var(--bv-line)] hover:bg-[var(--bv-surface-2)] transition font-medium"
                      >
                        ✋ Touch the light bulb glass
                      </button>
                    )}
                  </div>

                  {/* Deduction choice */}
                  <div className="mt-6 pt-4 border-t border-[var(--bv-line)]">
                    <p className="text-xs font-semibold mb-2 text-[var(--bv-ink-soft)]">
                      Based on what you observe, which switch operates this bulb?
                    </p>
                    <div className="flex gap-2 mb-3">
                      {[1, 2, 3].map(num => (
                        <button
                          key={num}
                          onClick={() => setSelectedSwitchAnswer(num)}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition ${
                            selectedSwitchAnswer === num
                              ? 'bg-[var(--bv-brand)] text-white border-[var(--bv-brand)]'
                              : 'bg-[var(--bv-surface-2)] border-[var(--bv-line)] hover:border-[var(--bv-line-strong)]'
                          }`}
                        >
                          Switch {num}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={submitSwitchGuess}
                      disabled={selectedSwitchAnswer === null}
                      className="w-full py-2.5 rounded-xl bg-[var(--bv-brand)] text-white font-semibold text-xs hover:bg-[var(--bv-brand-strong)] transition disabled:opacity-50"
                    >
                      Confirm Deduction
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Type 2: Fencepost */}
          {puzzle.interactiveType === 'fencepost' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Row Count: {rowCount}</span>
                <span className="text-[var(--bv-brand)]">Separators: {Math.max(0, rowCount - 1)}</span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                value={rowCount}
                onChange={e => setRowCount(parseInt(e.target.value))}
                className="w-full accent-[var(--bv-brand)] cursor-pointer"
              />

              {/* Visual rows and separators */}
              <div className="p-4 rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] space-y-2">
                {Array.from({ length: rowCount }).map((_, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[var(--bv-surface-2)] text-xs font-medium">
                      <span>📄 Row {idx + 1}</span>
                      <span className="text-[10px] text-[var(--bv-muted)]">data payload</span>
                    </div>
                    {idx < rowCount - 1 && (
                      <div className="flex items-center gap-2 text-[10px] font-bold text-rose-500 justify-center py-0.5">
                        <div className="h-[1px] flex-1 bg-rose-400/40" />
                        <span>— Separator #{idx + 1} —</span>
                        <div className="h-[1px] flex-1 bg-rose-400/40" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-semibold block mb-1">
                  How many separator lines appear between 10 rows?
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={fencepostAnswer}
                    onChange={e => setFencepostAnswer(e.target.value)}
                    placeholder="Enter total separators"
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] focus:outline-none focus:border-[var(--bv-brand)]"
                  />
                  <button
                    onClick={submitFencepost}
                    className="px-5 py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition"
                  >
                    Check
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Type 3: Edge Cases */}
          {puzzle.interactiveType === 'edge-cases' && (
            <div className="space-y-4">
              <p className="text-xs text-[var(--bv-muted)]">
                Try passing inputs into the simulator. Can you find an input that exposes NaN, undefined, or crashes the scoring engine?
              </p>

              <div className="flex flex-wrap gap-2 text-xs">
                {['[]', '[100, 95, 88]', '[0, 0, 0]', '[-50, 100]', '["90", "10"]', 'null'].map(sample => (
                  <button
                    key={sample}
                    onClick={() => {
                      setCustomTestInput(sample);
                      testEdgeCase(sample);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[var(--bv-surface)] border border-[var(--bv-line)] hover:border-[var(--bv-brand)] font-mono text-[11px] transition"
                  >
                    Try {sample}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTestInput}
                  onChange={e => setCustomTestInput(e.target.value)}
                  placeholder="Enter JSON test input (e.g. [])"
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] font-mono focus:outline-none focus:border-[var(--bv-brand)]"
                />
                <button
                  onClick={() => testEdgeCase(customTestInput)}
                  className="px-4 py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition"
                >
                  Run Test
                </button>
              </div>

              {edgeCaseResults.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--bv-muted)]">Test Log:</span>
                  {edgeCaseResults.map((r, i) => (
                    <div 
                      key={i}
                      className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                        r.status === 'broken' 
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400' 
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {r.status === 'broken' ? <AlertCircle className="size-4 shrink-0 mt-0.5" /> : <CheckCircle2 className="size-4 shrink-0 mt-0.5" />}
                      <div>
                        <span className="font-mono font-semibold">{r.input}</span>: {r.note}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feedback Message */}
        {feedback.message && (
          <div className={`mt-4 p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
            feedback.status === 'correct' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' 
              : feedback.status === 'wrong'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
          }`}>
            {feedback.status === 'correct' ? (
              <Trophy className="size-5 shrink-0 text-emerald-500" />
            ) : feedback.status === 'wrong' ? (
              <AlertCircle className="size-5 shrink-0 text-rose-500" />
            ) : (
              <Lightbulb className="size-5 shrink-0 text-amber-500" />
            )}
            <div>{feedback.message}</div>
          </div>
        )}

        {/* Official Solution Explanation */}
        <div className="mt-6 pt-5 border-t border-[var(--bv-line)]">
          <details className="group cursor-pointer">
            <summary className="text-xs font-bold text-[var(--bv-brand)] hover:underline flex items-center justify-between">
              <span>View Architectural Solution & Engineering Takeaway</span>
              <span className="text-[11px] text-[var(--bv-muted)] group-open:rotate-180 transition">▼</span>
            </summary>
            <div className="mt-3 p-4 rounded-xl bg-[var(--bv-surface-2)] text-xs text-[var(--bv-ink-soft)] leading-relaxed whitespace-pre-line border border-[var(--bv-line)]">
              {puzzle.solutionExplanation}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};
