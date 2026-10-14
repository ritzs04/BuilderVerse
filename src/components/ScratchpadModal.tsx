import React, { useState } from 'react';
import { X, Play, RotateCcw, Terminal, Sparkles, Code2, Layout, Copy, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const JS_PRESETS = [
  {
    name: 'Array .map() & .filter()',
    code: `const students = [
  { name: "Maya", xp: 120, ready: true },
  { name: "Leo", xp: 45, ready: false },
  { name: "Priya", xp: 210, ready: true }
];

// 1. Filter students who are ready
const readyStudents = students.filter(s => s.ready);
console.log("Ready builders:", readyStudents);

// 2. Map into badge titles
const badges = readyStudents.map(s => s.name + " (" + s.xp + " XP)");
console.log("Certificates:", badges);`
  },
  {
    name: 'Async Promise & Delay',
    code: `function waitAndGreet(name, ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Welcome to BuilderVerse, " + name + "! 🌸");
    }, ms);
  });
}

console.log("Starting network countdown...");
waitAndGreet("Alex", 300).then(msg => {
  console.log("Resolved result:", msg);
});`
  },
  {
    name: 'String Sanitizer & Edge Cases',
    code: `function cleanBuilderHandle(handle) {
  if (!handle || typeof handle !== 'string') {
    return 'anonymous_builder';
  }
  return handle.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
}

console.log("Test 1:", cleanBuilderHandle("  @Maya_Dev!  "));
console.log("Test 2:", cleanBuilderHandle(null));
console.log("Test 3:", cleanBuilderHandle("Super*Coder#2026"));`
  }
];

export const ScratchpadModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'js' | 'css'>('js');

  // JS Sandbox State
  const [jsCode, setJsCode] = useState(JS_PRESETS[0].code);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);
  const [copied, setCopied] = useState(false);

  // CSS Lab State
  const [cssDisplay, setCssDisplay] = useState<'flex' | 'grid' | 'block'>('flex');
  const [cssJustify, setCssJustify] = useState<'center' | 'space-between' | 'space-around' | 'flex-start'>('center');
  const [cssGap, setCssGap] = useState(16);
  const [cssPadding, setCssPadding] = useState(20);
  const [cssRadius, setCssRadius] = useState(16);
  const [cssBoxSizing, setCssBoxSizing] = useState<'border-box' | 'content-box'>('border-box');

  const runJsCode = () => {
    const logs: string[] = [];
    setHasError(false);

    // Safe simulated sandbox environment
    const originalLog = console.log;
    const originalError = console.error;

    try {
      console.log = (...args: any[]) => {
        logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '));
      };
      console.error = (...args: any[]) => {
        logs.push('🚨 Error: ' + args.join(' '));
      };

      // Execute inside Function sandbox
      const fn = new Function(jsCode);
      fn();

      setConsoleLogs(logs.length > 0 ? logs : ['[Code executed cleanly with 0 console logs]']);
    } catch (err: any) {
      setHasError(true);
      setConsoleLogs([`🚨 ${err.name}: ${err.message}`]);
    } finally {
      console.log = originalLog;
      console.error = originalError;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(jsCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden"
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
              🧪
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
                  Developer Sandbox
                </span>
                <span className="text-[11px] text-[var(--bv-muted)]">
                  Safe in-browser playground
                </span>
              </div>
              <h2 className="text-base font-bold text-[var(--bv-ink)]">
                Interactive Scratchpad & Visual Lab
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
            onClick={() => setActiveTab('js')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'js'
                ? 'border-[var(--bv-brand)] text-[var(--bv-brand)] font-bold'
                : 'border-transparent text-[var(--bv-muted)] hover:text-[var(--bv-ink)]'
            }`}
          >
            <Code2 className="size-3.5" /> JavaScript Logic Scratchpad
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'css'
                ? 'border-[var(--bv-brand)] text-[var(--bv-brand)] font-bold'
                : 'border-transparent text-[var(--bv-muted)] hover:text-[var(--bv-ink)]'
            }`}
          >
            <Layout className="size-3.5" /> CSS Visual Lab & Box Model
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === 'js' ? (
            <div className="space-y-4">
              {/* Presets Row */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-semibold text-[var(--bv-muted)]">
                  Quick Starter Templates:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {JS_PRESETS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setJsCode(p.code);
                        setConsoleLogs([]);
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--bv-surface-2)] text-[var(--bv-ink-soft)] hover:text-[var(--bv-brand)] border border-[var(--bv-line)] font-medium transition"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Editor */}
              <div className="rounded-2xl overflow-hidden border border-zinc-700/60 bg-zinc-950 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-zinc-400 select-none">
                  <div className="flex items-center gap-1.5">
                    <div className="size-2.5 rounded-full bg-rose-500/80" />
                    <div className="size-2.5 rounded-full bg-amber-500/80" />
                    <div className="size-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-[11px] font-sans">scratchpad.js</span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
                  >
                    {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <textarea
                  value={jsCode}
                  onChange={e => setJsCode(e.target.value)}
                  rows={8}
                  spellCheck={false}
                  className="w-full p-4 bg-transparent text-emerald-400 font-mono text-xs leading-relaxed resize-none focus:outline-none"
                />
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--bv-muted)]">
                  Code runs directly inside your browser sandbox.
                </span>
                <button
                  onClick={runJsCode}
                  className="px-5 py-2.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-sm flex items-center gap-1.5"
                >
                  <Play className="size-3.5 fill-current" /> Run & Log Output
                </button>
              </div>

              {/* Console Output Box */}
              <div className="rounded-2xl overflow-hidden border border-[var(--bv-line)] bg-zinc-900 text-zinc-300 font-mono text-xs">
                <div className="px-3.5 py-1.5 bg-zinc-950 border-b border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="size-3" /> Console Output
                  </span>
                  {hasError && <span className="text-rose-400 font-bold">Runtime Exception Caught</span>}
                </div>
                <div className="p-4 whitespace-pre-wrap leading-relaxed min-h-[80px]">
                  {consoleLogs.length > 0 ? consoleLogs.join('\n') : '// Output will appear here after clicking "Run"...'}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <p className="text-xs text-[var(--bv-muted)]">
                Tweak live CSS rules below to build visual intuition for flexbox alignment, box-sizing, and padding.
              </p>

              {/* Visual Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--bv-surface-2)]/50 border border-[var(--bv-line)] text-xs">
                <div>
                  <label className="font-semibold block mb-1">display:</label>
                  <div className="flex gap-1">
                    {(['flex', 'grid', 'block'] as const).map(d => (
                      <button
                        key={d}
                        onClick={() => setCssDisplay(d)}
                        className={`flex-1 py-1 rounded-lg border text-[11px] font-mono transition ${
                          cssDisplay === d
                            ? 'bg-[var(--bv-brand)] text-white font-bold border-[var(--bv-brand)]'
                            : 'bg-[var(--bv-surface)] border-[var(--bv-line)]'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">justify-content:</label>
                  <select
                    value={cssJustify}
                    onChange={e => setCssJustify(e.target.value as any)}
                    className="w-full p-1.5 rounded-lg bg-[var(--bv-surface)] border border-[var(--bv-line)] font-mono text-[11px]"
                  >
                    <option value="center">center</option>
                    <option value="space-between">space-between</option>
                    <option value="space-around">space-around</option>
                    <option value="flex-start">flex-start</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">box-sizing:</label>
                  <div className="flex gap-1">
                    {(['border-box', 'content-box'] as const).map(b => (
                      <button
                        key={b}
                        onClick={() => setCssBoxSizing(b)}
                        className={`flex-1 py-1 rounded-lg border text-[11px] font-mono transition ${
                          cssBoxSizing === b
                            ? 'bg-[var(--bv-brand)] text-white font-bold border-[var(--bv-brand)]'
                            : 'bg-[var(--bv-surface)] border-[var(--bv-line)]'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>gap:</span>
                    <span className="font-mono text-[var(--bv-brand)]">{cssGap}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="36"
                    value={cssGap}
                    onChange={e => setCssGap(parseInt(e.target.value))}
                    className="w-full accent-[var(--bv-brand)] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>padding:</span>
                    <span className="font-mono text-[var(--bv-brand)]">{cssPadding}px</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="48"
                    value={cssPadding}
                    onChange={e => setCssPadding(parseInt(e.target.value))}
                    className="w-full accent-[var(--bv-brand)] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>border-radius:</span>
                    <span className="font-mono text-[var(--bv-brand)]">{cssRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    value={cssRadius}
                    onChange={e => setCssRadius(parseInt(e.target.value))}
                    className="w-full accent-[var(--bv-brand)] cursor-pointer"
                  />
                </div>
              </div>

              {/* Rendered Live Box */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--bv-muted)] block">
                  Live Visual Preview:
                </span>

                <div className="p-8 rounded-2xl border border-[var(--bv-line)] bg-zinc-950/5 flex items-center justify-center min-h-[160px]">
                  <div
                    style={{
                      display: cssDisplay,
                      justifyContent: cssJustify,
                      gap: `${cssGap}px`,
                      padding: `${cssPadding}px`,
                      borderRadius: `${cssRadius}px`,
                      boxSizing: cssBoxSizing,
                      width: '100%',
                      maxWidth: '440px',
                      backgroundColor: 'var(--bv-surface)',
                      border: '2px dashed var(--bv-brand)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div className="p-3 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold text-center">
                      Item 1
                    </div>
                    <div className="p-3 rounded-xl bg-purple-600 text-white text-xs font-bold text-center">
                      Item 2
                    </div>
                    <div className="p-3 rounded-xl bg-indigo-600 text-white text-xs font-bold text-center">
                      Item 3
                    </div>
                  </div>
                </div>
              </div>

              {/* Generated CSS snippet */}
              <div className="p-3.5 rounded-xl bg-zinc-950 text-emerald-400 font-mono text-xs border border-zinc-800">
                <span className="text-zinc-500">// Copy into your stylesheet:</span>
                <pre className="mt-1">{`.container {
  display: ${cssDisplay};
  justify-content: ${cssJustify};
  gap: ${cssGap}px;
  padding: ${cssPadding}px;
  border-radius: ${cssRadius}px;
  box-sizing: ${cssBoxSizing};
}`}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
