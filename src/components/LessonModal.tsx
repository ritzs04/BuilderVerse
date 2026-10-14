import React, { useState } from 'react';
import { LearningPath, Lesson } from '../data/builderVerseData';
import { X, CheckCircle2, ChevronRight, BookOpen, Award, ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  path: LearningPath | null;
  onClose: () => void;
  onCompleteLesson: (lessonId: string, xpEarned: number) => void;
  completedLessonIds: string[];
  onAskAi?: (concept: string, content: string) => void;
}

function getLineExplanation(line: string): string {
  const t = line.trim();
  if (t.startsWith('//') || t.startsWith('#')) return 'Comment note explaining the intent of the upcoming code block.';
  if (t.includes('<header')) return 'Creates the top landmark banner containing navigation for the page.';
  if (t.includes('<nav')) return 'Defines a block of primary navigation links for users and screen readers.';
  if (t.includes('<main')) return 'Encapsulates the dominant, unique content of this specific document.';
  if (t.includes('<article')) return 'Self-contained composition that can be distributed independently.';
  if (t.includes('<form')) return 'Collects user inputs and prepares them for client or server processing.';
  if (t.includes('<label')) return 'Provides an accessible, tap-friendly title bound to an input via "for".';
  if (t.includes('<input')) return 'Interactive input element where visitors enter their data.';
  if (t.includes('box-sizing: border-box')) return 'Ensures padding and borders do not inflate the total width of the box!';
  if (t.includes('.map(')) return 'Transforms every element in the array and returns a brand-new array of equal length.';
  if (t.includes('.filter(')) return 'Evaluates a truthy condition and keeps only matching elements in a new array.';
  if (t.includes('addEventListener')) return 'Listens for browser events (like clicks) and runs a callback function without blocking.';
  if (t.includes('querySelector')) return 'Searches the DOM and returns the first matching HTML element found.';
  if (t.includes('async function')) return 'Defines an asynchronous function that can pause with "await" without freezing the browser.';
  if (t.includes('await fetch')) return 'Sends a network request and pauses execution until the server responds.';
  if (t.includes('response.json()')) return 'Parses the raw HTTP body text into usable JavaScript objects.';
  if (t.includes('git checkout -b')) return 'Creates a new branch safely and immediately switches your workspace to it.';
  if (t.includes('git commit')) return 'Saves a checkpoint of your staged changes with an explanatory message.';
  if (t.includes('git push')) return 'Uploads your committed local branch history to GitHub remote.';
  return 'Executes this statement to set up data, structure, or visual styling.';
}

export const LessonModal: React.FC<Props> = ({ path, onClose, onCompleteLesson, completedLessonIds, onAskAi }) => {
  if (!path) return null;

  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const currentLesson: Lesson = path.lessons[activeLessonIndex] || path.lessons[0];

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [hoveredLineIdx, setHoveredLineIdx] = useState<number | null>(null);
  const [selectedLineIdx, setSelectedLineIdx] = useState<number | null>(null);

  const isCompleted = completedLessonIds.includes(currentLesson.id);

  const handleSelectOption = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedOption(idx);
  };

  const handleCheckQuiz = () => {
    if (selectedOption === null) return;
    setQuizSubmitted(true);
    if (selectedOption === currentLesson.quiz.correctIndex && !isCompleted) {
      onCompleteLesson(currentLesson.id, currentLesson.xp);
    }
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < path.lessons.length - 1) {
      setActiveLessonIndex(prev => prev + 1);
      setSelectedOption(null);
      setQuizSubmitted(false);
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(prev => prev - 1);
      setSelectedOption(null);
      setQuizSubmitted(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bv-surface)',
          borderColor: 'var(--bv-line)',
          color: 'var(--bv-ink)'
        }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--bv-line)] bg-[var(--bv-surface)]">
          <div className="flex items-center gap-3">
            <span 
              className="grid size-9 place-items-center rounded-xl font-bold text-white text-xs"
              style={{ backgroundColor: path.badgeColor }}
            >
              <BookOpen className="size-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
                  {path.title} Path
                </span>
                <span className="text-xs text-[var(--bv-muted)]">
                  Lesson {activeLessonIndex + 1} of {path.lessons.length}
                </span>
              </div>
              <h2 className="text-base font-bold text-[var(--bv-ink)]">{currentLesson.title}</h2>
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
          {/* Summary Banner */}
          <div className="p-4 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs text-[var(--bv-ink-soft)] leading-relaxed">
            <strong className="text-[var(--bv-ink)]">Goal:</strong> {currentLesson.summary}
          </div>

          {/* Lesson Concept Text */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--bv-brand)]">
                Core Concept
              </h3>
              <button
                type="button"
                onClick={() => onAskAi?.(currentLesson.title, currentLesson.content)}
                className="px-2.5 py-1 rounded-lg bg-[var(--bv-surface-2)] text-[var(--bv-brand)] hover:bg-[var(--bv-brand)] hover:text-white border border-[var(--bv-line)] text-xs font-semibold transition flex items-center gap-1"
              >
                <span>🌷 Ask Sprout AI: Explain with an everyday analogy</span>
              </button>
            </div>
            <div className="text-xs sm:text-sm text-[var(--bv-ink-soft)] leading-relaxed whitespace-pre-line">
              {currentLesson.content}
            </div>
          </div>

          {/* Code Example with "Explain this Line" feature */}
          <div className="rounded-2xl overflow-hidden border border-zinc-700/60 bg-zinc-950 font-mono text-xs">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-zinc-400 select-none">
              <span className="text-[11px] font-sans flex items-center gap-1.5">
                <span>Code Blueprint</span>
                <span className="text-[10px] text-[var(--bv-brand)] font-semibold bg-[var(--bv-surface-2)] px-2 py-0.5 rounded-full">
                  ✨ Hover or click any line to explain!
                </span>
              </span>
              <span className="text-[11px]">Interactive Explainer</span>
            </div>

            <div className="p-3 text-xs leading-relaxed space-y-0.5">
              {currentLesson.codeSnippet.split('\n').map((line, idx) => {
                const isSelected = selectedLineIdx === idx;
                const explanation = getLineExplanation(line);

                return (
                  <div key={idx} className="group/line">
                    <div
                      onClick={() => setSelectedLineIdx(isSelected ? null : idx)}
                      onMouseEnter={() => setHoveredLineIdx(idx)}
                      onMouseLeave={() => setHoveredLineIdx(null)}
                      className={`flex items-start gap-3 px-2 py-1 rounded-lg cursor-pointer transition ${
                        isSelected || hoveredLineIdx === idx
                          ? 'bg-zinc-800/80 text-emerald-300'
                          : 'hover:bg-zinc-900/60 text-emerald-400'
                      }`}
                    >
                      <span className="text-[11px] text-zinc-600 select-none w-5 text-right shrink-0">
                        {idx + 1}
                      </span>
                      <code className="flex-1 overflow-x-auto whitespace-pre">{line}</code>
                    </div>

                    {(isSelected || hoveredLineIdx === idx) && (
                      <div className="ml-8 my-1 p-2 rounded-xl bg-purple-950/60 border border-purple-800/40 text-purple-200 text-[11px] font-sans animate-in fade-in duration-150">
                        💡 <strong>Line {idx + 1}:</strong> {explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verification Quiz */}
          <div className="p-5 rounded-2xl border border-[var(--bv-line)] bg-[var(--bv-surface-2)]/60 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--bv-ink-soft)] flex items-center gap-1.5">
                <Award className="size-4 text-amber-500" />
                Knowledge Check (+{currentLesson.xp} XP)
              </h4>
              {isCompleted && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="size-3" /> Completed
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm font-semibold text-[var(--bv-ink)]">
              {currentLesson.quiz.question}
            </p>

            <div className="space-y-2">
              {currentLesson.quiz.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentLesson.quiz.correctIndex;
                let btnStyle = 'bg-[var(--bv-surface)] border-[var(--bv-line)] hover:border-[var(--bv-brand)]/50';

                if (quizSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-500/15 border-rose-500 text-rose-800 dark:text-rose-200';
                  } else {
                    btnStyle = 'opacity-50 border-[var(--bv-line)]';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-[var(--bv-brand)]/15 border-[var(--bv-brand)] text-[var(--bv-brand)] font-semibold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {quizSubmitted && isCorrect && <CheckCircle2 className="size-4 text-emerald-500 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={handleCheckQuiz}
                disabled={selectedOption === null}
                className="w-full py-2.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition disabled:opacity-40"
              >
                Submit Answer
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] text-xs text-[var(--bv-ink-soft)] leading-relaxed">
                <strong>Explanation:</strong> {currentLesson.quiz.explanation}
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--bv-line)] bg-[var(--bv-surface)]">
          <button
            onClick={handlePrevLesson}
            disabled={activeLessonIndex === 0}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-[var(--bv-line)] hover:bg-[var(--bv-surface-2)] transition disabled:opacity-40 flex items-center gap-1.5"
          >
            <ArrowLeft className="size-3.5" /> Previous
          </button>
          <button
            onClick={handleNextLesson}
            disabled={activeLessonIndex >= path.lessons.length - 1}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--bv-brand)] text-white hover:bg-[var(--bv-brand-strong)] transition disabled:opacity-40 flex items-center gap-1.5"
          >
            Next Lesson <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
