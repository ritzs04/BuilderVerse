import React, { useState } from 'react';
import { GuidedProject } from '../data/builderVerseData';
import { triggerProjectConfetti } from '../utils/confetti';
import { 
  X, CheckSquare, Square, Trophy, Play, CheckCircle2, Clock, 
  Sparkles, Key, Send, Search, Calculator as CalcIcon, CloudSun, User
} from 'lucide-react';

interface Props {
  project: GuidedProject | null;
  onClose: () => void;
  onComplete: (projectId: string, xpEarned: number) => void;
  isCompleted: boolean;
}

export const ProjectModal: React.FC<Props> = ({ project, onClose, onComplete, isCompleted }) => {
  if (!project) return null;

  const [activeTab, setActiveTab] = useState<'interactive' | 'checklist'>('interactive');
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  // Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrev, setCalcPrev] = useState<string | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);

  // Weather App State
  const [weatherCity, setWeatherCity] = useState('Tokyo');
  const [weatherUnit, setWeatherUnit] = useState<'C' | 'F'>('C');

  // Password Vault State
  const [passLength, setPassLength] = useState(16);
  const [generatedPass, setGeneratedPass] = useState('k9$mQ#v91Lp!@xZ4');
  const [vaultEntries, setVaultEntries] = useState([
    { site: 'GitHub', user: 'builder@verse.dev' },
    { site: 'Vercel', user: 'builder@verse.dev' }
  ]);
  const [newSite, setNewSite] = useState('');
  const [newUser, setNewUser] = useState('');

  // Chat App State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Welcome to the BuilderVerse live channel! What are you building today?', time: '10:00 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Kanban Board State
  const [kanbanTasks, setKanbanTasks] = useState([
    { id: 'k1', title: 'Design Database Schema', column: 'done', priority: 'High' },
    { id: 'k2', title: 'Implement Auth Session Hook', column: 'in-progress', priority: 'Urgent' },
    { id: 'k3', title: 'Write Playwright E2E Tests', column: 'todo', priority: 'Medium' },
    { id: 'k4', title: 'Configure CI/CD Pipelines', column: 'todo', priority: 'Low' },
  ]);
  const [newKanbanTitle, setNewKanbanTitle] = useState('');

  // Sorting Visualizer State
  const [arrayBars, setArrayBars] = useState([45, 18, 85, 32, 95, 12, 64, 78, 25, 52]);
  const [isSorting, setIsSorting] = useState(false);
  const [activeCompareIndices, setActiveCompareIndices] = useState<number[]>([]);

  const toggleTask = (task: string) => {
    setCheckedTasks(prev => {
      const next = { ...prev, [task]: !prev[task] };
      // Check if all tasks done
      const allDone = project.checklist.every(t => next[t]);
      if (allDone && !isCompleted) {
        triggerProjectConfetti();
        onComplete(project.id, project.xp);
      }
      return next;
    });
  };

  // Calculator helper
  const handleCalcNum = (num: string) => {
    setCalcDisplay(prev => (prev === '0' || prev === 'Error' ? num : prev + num));
  };
  const handleCalcOp = (op: string) => {
    setCalcPrev(calcDisplay);
    setCalcOp(op);
    setCalcDisplay('0');
  };
  const handleCalcEqual = () => {
    if (!calcPrev || !calcOp) return;
    const a = parseFloat(calcPrev);
    const b = parseFloat(calcDisplay);
    let res = 0;
    if (calcOp === '+') res = a + b;
    if (calcOp === '-') res = a - b;
    if (calcOp === '×') res = a * b;
    if (calcOp === '÷') res = b === 0 ? NaN : a / b;
    setCalcDisplay(isNaN(res) ? 'Error' : parseFloat(res.toFixed(6)).toString());
    setCalcPrev(null);
    setCalcOp(null);
  };

  // Password generator
  const generateNewPass = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~';
    let p = '';
    for (let i = 0; i < passLength; i++) {
      p += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPass(p);
  };

  // Chat message send
  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText, time: 'Just now' }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: `Awesome! "${userText}" sounds like a solid architectural milestone. Keep shipping clean code!`,
          time: 'Just now'
        }
      ]);
    }, 600);
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--bv-line)] bg-[var(--bv-surface)]">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-purple-500/10 text-purple-600 font-bold text-xs">
              <Play className="size-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">Guided Project</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bv-surface-2)] text-[var(--bv-ink-soft)] font-medium">
                  {project.difficulty}
                </span>
                <span className="text-xs text-[var(--bv-muted)] flex items-center gap-1">
                  <Clock className="size-3" /> {project.estimatedTime}
                </span>
                {isCompleted && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="size-3.5" /> Built & Verified
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-[var(--bv-ink)] mt-0.5">{project.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--bv-muted)] hover:text-[var(--bv-ink)] hover:bg-[var(--bv-surface-2)] transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[var(--bv-line)] px-6 bg-[var(--bv-surface-2)]/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('interactive')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'interactive' 
                ? 'border-[var(--bv-brand)] text-[var(--bv-brand)] font-bold' 
                : 'border-transparent text-[var(--bv-muted)] hover:text-[var(--bv-ink)]'
            }`}
          >
            🚀 Live Interactive Demo
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'checklist' 
                ? 'border-[var(--bv-brand)] text-[var(--bv-brand)] font-bold' 
                : 'border-transparent text-[var(--bv-muted)] hover:text-[var(--bv-ink)]'
            }`}
          >
            📋 Build Checklist & Requirements
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'interactive' ? (
            <div className="space-y-6">
              <div className="text-xs sm:text-sm text-[var(--bv-muted)] leading-relaxed">
                {project.description}
              </div>

              {/* Live Interactive App Preview based on Project ID */}
              <div className="p-6 rounded-2xl border border-[var(--bv-line)] bg-[var(--bv-surface-2)]/60">
                {/* 1. Calculator */}
                {project.id === 'calculator' && (
                  <div className="max-w-xs mx-auto p-4 rounded-2xl bg-zinc-900 text-white shadow-xl border border-zinc-800">
                    <div className="text-[10px] text-zinc-400 font-mono text-right h-4 mb-1">
                      {calcPrev} {calcOp}
                    </div>
                    <div className="text-right text-3xl font-mono font-bold tracking-tight mb-4 px-2 py-2 bg-zinc-950 rounded-xl overflow-x-auto text-emerald-400">
                      {calcDisplay}
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm font-semibold">
                      <button onClick={() => { setCalcDisplay('0'); setCalcPrev(null); setCalcOp(null); }} className="p-3 rounded-xl bg-zinc-800 text-rose-400 hover:bg-zinc-700 transition">AC</button>
                      <button onClick={() => setCalcDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0')} className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition">⌫</button>
                      <button onClick={() => handleCalcOp('%')} className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition">%</button>
                      <button onClick={() => handleCalcOp('÷')} className="p-3 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition">÷</button>

                      {['7','8','9'].map(n => <button key={n} onClick={() => handleCalcNum(n)} className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition">{n}</button>)}
                      <button onClick={() => handleCalcOp('×')} className="p-3 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition">×</button>

                      {['4','5','6'].map(n => <button key={n} onClick={() => handleCalcNum(n)} className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition">{n}</button>)}
                      <button onClick={() => handleCalcOp('-')} className="p-3 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition">-</button>

                      {['1','2','3'].map(n => <button key={n} onClick={() => handleCalcNum(n)} className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition">{n}</button>)}
                      <button onClick={() => handleCalcOp('+')} className="p-3 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition">+</button>

                      <button onClick={() => handleCalcNum('0')} className="col-span-2 p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition">0</button>
                      <button onClick={() => !calcDisplay.includes('.') && setCalcDisplay(prev => prev + '.')} className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition">.</button>
                      <button onClick={handleCalcEqual} className="p-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 font-bold transition">=</button>
                    </div>
                  </div>
                )}

                {/* 2. Weather App */}
                {project.id === 'weather-app' && (
                  <div className="max-w-md mx-auto p-5 rounded-2xl bg-[var(--bv-surface)] border border-[var(--bv-line)] shadow-lg space-y-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="size-4 absolute left-3 top-2.5 text-[var(--bv-muted)]" />
                        <input
                          type="text"
                          value={weatherCity}
                          onChange={e => setWeatherCity(e.target.value)}
                          placeholder="Search city (e.g. London, Tokyo)"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] focus:outline-none focus:border-[var(--bv-brand)]"
                        />
                      </div>
                      <button
                        onClick={() => setWeatherUnit(prev => prev === 'C' ? 'F' : 'C')}
                        className="px-3 py-2 text-xs font-bold rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)]"
                      >
                        °{weatherUnit}
                      </button>
                    </div>

                    <div className="p-5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-wider font-semibold opacity-80">Currently in</div>
                        <h3 className="text-xl font-bold">{weatherCity || 'Tokyo'}</h3>
                        <div className="text-3xl font-extrabold mt-2">
                          {weatherUnit === 'C' ? '22°C' : '71°F'}
                        </div>
                        <div className="text-xs opacity-90 mt-1">Partly Cloudy · Humidity 48%</div>
                      </div>
                      <CloudSun className="size-16 text-amber-300 animate-pulse" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      {['Tomorrow', 'Thu', 'Fri'].map((day, idx) => (
                        <div key={day} className="p-2.5 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)]">
                          <div className="font-semibold">{day}</div>
                          <div className="font-bold text-[var(--bv-brand)] mt-1">{20 + idx}°{weatherUnit}</div>
                          <div className="text-[10px] text-[var(--bv-muted)]">Sunny</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Password Manager */}
                {project.id === 'password-manager' && (
                  <div className="max-w-md mx-auto p-5 rounded-2xl bg-[var(--bv-surface)] border border-[var(--bv-line)] shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)] flex items-center gap-1.5">
                        <Key className="size-3.5" /> Password Vault & Generator
                      </span>
                      <button
                        onClick={generateNewPass}
                        className="text-xs text-[var(--bv-brand)] font-semibold hover:underline"
                      >
                        Regenerate
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-950 text-emerald-400 font-mono text-xs flex items-center justify-between">
                      <span>{generatedPass}</span>
                      <button
                        onClick={() => navigator.clipboard?.writeText(generatedPass)}
                        className="text-[10px] bg-zinc-800 text-white px-2 py-1 rounded hover:bg-zinc-700"
                      >
                        Copy
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-[var(--bv-muted)]">
                        <span>Length: {passLength} chars</span>
                        <span className="text-emerald-500 font-semibold">Entropy: High</span>
                      </div>
                      <input
                        type="range"
                        min="8"
                        max="32"
                        value={passLength}
                        onChange={e => setPassLength(parseInt(e.target.value))}
                        className="w-full accent-[var(--bv-brand)] cursor-pointer"
                      />
                    </div>

                    <div className="pt-2 border-t border-[var(--bv-line)]">
                      <h4 className="text-xs font-bold mb-2">Saved Vault Entries</h4>
                      <div className="space-y-1.5 mb-3 max-h-28 overflow-y-auto">
                        {vaultEntries.map((v, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[var(--bv-surface-2)] text-xs">
                            <span className="font-semibold">{v.site}</span>
                            <span className="text-[var(--bv-muted)] font-mono">{v.user}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Website"
                          value={newSite}
                          onChange={e => setNewSite(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-[var(--bv-surface-2)] border border-[var(--bv-line)]"
                        />
                        <input
                          type="text"
                          placeholder="Username"
                          value={newUser}
                          onChange={e => setNewUser(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-[var(--bv-surface-2)] border border-[var(--bv-line)]"
                        />
                        <button
                          onClick={() => {
                            if (newSite && newUser) {
                              setVaultEntries(prev => [...prev, { site: newSite, user: newUser }]);
                              setNewSite('');
                              setNewUser('');
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[var(--bv-brand)] text-white text-xs font-bold"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Chat Application */}
                {project.id === 'chat-application' && (
                  <div className="max-w-md mx-auto p-4 rounded-2xl bg-[var(--bv-surface)] border border-[var(--bv-line)] shadow-lg flex flex-col h-80">
                    <div className="flex items-center gap-2 pb-3 border-b border-[var(--bv-line)]">
                      <div className="size-3 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold">Builder Room #global</span>
                    </div>

                    <div className="flex-1 overflow-y-auto py-3 space-y-3">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-[var(--bv-brand)] text-white rounded-tr-none'
                                : 'bg-[var(--bv-surface-2)] text-[var(--bv-ink)] rounded-tl-none border border-[var(--bv-line)]'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[10px] text-[var(--bv-muted)] mt-1 px-1">{msg.time}</span>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={sendChatMessage} className="flex gap-2 pt-2 border-t border-[var(--bv-line)]">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] focus:outline-none focus:border-[var(--bv-brand)]"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)]"
                      >
                        <Send className="size-3.5" />
                      </button>
                    </form>
                  </div>
                )}

                {/* 5. Personal Portfolio */}
                {project.id === 'personal-portfolio' && (
                  <div className="max-w-md mx-auto p-5 rounded-2xl bg-[var(--bv-surface)] border border-[var(--bv-line)] shadow-lg space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white grid place-items-center font-bold text-lg">
                        <User className="size-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">Alex Rivera</h4>
                        <p className="text-xs text-[var(--bv-muted)]">Full-Stack Apprentice · BuilderVerse Graduate</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bv-surface-2)] text-xs text-[var(--bv-ink-soft)] leading-relaxed">
                      "Building resilient web apps with semantic markup, fast CSS, and typed JavaScript. Check out my recent open source builds below."
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--bv-muted)]">Featured Projects:</span>
                      <div className="p-2.5 rounded-lg border border-[var(--bv-line)] bg-[var(--bv-surface)] flex items-center justify-between text-xs">
                        <span className="font-semibold">Weather Radar Engine</span>
                        <span className="text-[10px] font-mono text-[var(--bv-brand)]">Live Demo ↗</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-[var(--bv-line)] bg-[var(--bv-surface)] flex items-center justify-between text-xs">
                        <span className="font-semibold">Local Password Vault</span>
                        <span className="text-[10px] font-mono text-[var(--bv-brand)]">Live Demo ↗</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Kanban Board Engine (Advanced) */}
                {project.id === 'kanban-board' && (
                  <div className="max-w-xl mx-auto p-4 rounded-2xl bg-[var(--bv-surface)] border border-[var(--bv-line)] shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
                          Workflow Pipeline
                        </span>
                        <span className="text-[10px] bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">
                          Advanced
                        </span>
                      </div>
                      <span className="text-xs text-[var(--bv-muted)]">
                        {kanbanTasks.length} Total Tasks
                      </span>
                    </div>

                    {/* Columns grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(['todo', 'in-progress', 'done'] as const).map(col => {
                        const colTitle = col === 'todo' ? 'To Do' : col === 'in-progress' ? 'In Progress' : 'Done';
                        const colBg = col === 'todo' ? 'border-zinc-300 dark:border-zinc-700' : col === 'in-progress' ? 'border-amber-400/50' : 'border-emerald-400/50';
                        const colBadge = col === 'todo' ? 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400' : col === 'in-progress' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600';
                        const colTasks = kanbanTasks.filter(t => t.column === col);

                        return (
                          <div key={col} className={`p-3 rounded-xl bg-[var(--bv-surface-2)]/60 border ${colBg} flex flex-col justify-between min-h-[170px]`}>
                            <div>
                              <div className="flex items-center justify-between pb-2 border-b border-[var(--bv-line)] mb-2">
                                <span className="text-xs font-bold text-[var(--bv-ink)]">{colTitle}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${colBadge}`}>
                                  {colTasks.length}
                                </span>
                              </div>

                              <div className="space-y-2">
                                {colTasks.map(task => (
                                  <div
                                    key={task.id}
                                    className="p-2 rounded-lg bg-[var(--bv-surface)] border border-[var(--bv-line)] shadow-xs space-y-1.5 text-xs"
                                  >
                                    <div className="font-medium text-[var(--bv-ink)] leading-snug">
                                      {task.title}
                                    </div>
                                    <div className="flex items-center justify-between pt-1">
                                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                        task.priority === 'Urgent' ? 'bg-red-500/10 text-red-600' :
                                        task.priority === 'High' ? 'bg-amber-500/10 text-amber-600' :
                                        'bg-blue-500/10 text-blue-600'
                                      }`}>
                                        {task.priority}
                                      </span>
                                      <div className="flex items-center gap-1">
                                        {col !== 'todo' && (
                                          <button
                                            title="Move backward"
                                            onClick={() => {
                                              const nextCol = col === 'done' ? 'in-progress' : 'todo';
                                              setKanbanTasks(prev => prev.map(t => t.id === task.id ? { ...t, column: nextCol } : t));
                                            }}
                                            className="px-1 text-[10px] font-bold hover:text-[var(--bv-brand)] transition"
                                          >
                                            ←
                                          </button>
                                        )}
                                        {col !== 'done' && (
                                          <button
                                            title="Move forward"
                                            onClick={() => {
                                              const nextCol = col === 'todo' ? 'in-progress' : 'done';
                                              setKanbanTasks(prev => prev.map(t => t.id === task.id ? { ...t, column: nextCol } : t));
                                            }}
                                            className="px-1 text-[10px] font-bold hover:text-[var(--bv-brand)] transition"
                                          >
                                            →
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {colTasks.length === 0 && (
                                  <div className="text-[10px] text-center text-[var(--bv-muted)] py-4 italic">
                                    Empty stage
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Add Task */}
                    <div className="flex gap-2 pt-2 border-t border-[var(--bv-line)]">
                      <input
                        type="text"
                        placeholder="Add task to pipeline..."
                        value={newKanbanTitle}
                        onChange={e => setNewKanbanTitle(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && newKanbanTitle.trim()) {
                            setKanbanTasks(prev => [...prev, {
                              id: 'k-' + Date.now(),
                              title: newKanbanTitle.trim(),
                              column: 'todo',
                              priority: 'Medium'
                            }]);
                            setNewKanbanTitle('');
                          }
                        }}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)]"
                      />
                      <button
                        onClick={() => {
                          if (newKanbanTitle.trim()) {
                            setKanbanTasks(prev => [...prev, {
                              id: 'k-' + Date.now(),
                              title: newKanbanTitle.trim(),
                              column: 'todo',
                              priority: 'Medium'
                            }]);
                            setNewKanbanTitle('');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold"
                      >
                        + Add Card
                      </button>
                    </div>
                  </div>
                )}

                {/* 7. Algorithm & Sorting Visualizer (Advanced) */}
                {project.id === 'algorithm-visualizer' && (
                  <div className="max-w-md mx-auto p-5 rounded-2xl bg-[var(--bv-surface)] border border-[var(--bv-line)] shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
                        Sorting Execution Engine
                      </span>
                      <span className="text-[10px] bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">
                        Advanced
                      </span>
                    </div>

                    {/* Bar visualization */}
                    <div className="h-40 p-4 rounded-xl bg-zinc-950 flex items-end justify-center gap-2 border border-zinc-800">
                      {arrayBars.map((val, idx) => {
                        const isComparing = activeCompareIndices.includes(idx);
                        return (
                          <div
                            key={idx}
                            style={{ height: `${val}%` }}
                            className={`w-6 rounded-t transition-all duration-200 flex items-end justify-center pb-1 ${
                              isComparing
                                ? 'bg-amber-400 shadow-md'
                                : 'bg-[var(--bv-brand)] hover:bg-[var(--bv-brand-strong)]'
                            }`}
                          >
                            <span className="text-[9px] font-mono text-white font-bold">{val}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        disabled={isSorting}
                        onClick={() => {
                          const shuffled = [...arrayBars].sort(() => Math.random() - 0.5);
                          setArrayBars(shuffled);
                          setActiveCompareIndices([]);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs font-bold hover:bg-[var(--bv-surface-3)] transition disabled:opacity-50"
                      >
                        🎲 Shuffle
                      </button>

                      <button
                        disabled={isSorting}
                        onClick={async () => {
                          setIsSorting(true);
                          const arr = [...arrayBars];
                          const n = arr.length;
                          for (let i = 0; i < n - 1; i++) {
                            for (let j = 0; j < n - i - 1; j++) {
                              setActiveCompareIndices([j, j + 1]);
                              await new Promise(r => setTimeout(r, 120));
                              if (arr[j] > arr[j + 1]) {
                                const temp = arr[j];
                                arr[j] = arr[j + 1];
                                arr[j + 1] = temp;
                                setArrayBars([...arr]);
                                await new Promise(r => setTimeout(r, 120));
                              }
                            }
                          }
                          setActiveCompareIndices([]);
                          setIsSorting(false);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-sm disabled:opacity-50"
                      >
                        {isSorting ? 'Sorting in Progress...' : '▶ Run BubbleSort'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Skills Gained */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--bv-muted)] mb-2">
                  Skills you will acquire:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.skillsGained.map(skill => (
                    <span 
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs font-medium text-[var(--bv-ink)]"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-[var(--bv-muted)]">
                Check off each architectural milestone as you implement it. Completing all milestones awards +{project.xp} XP to your builder profile!
              </p>

              <div className="space-y-2">
                {project.checklist.map((task, idx) => {
                  const isChecked = checkedTasks[task] || isCompleted;
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleTask(task)}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center gap-3 cursor-pointer select-none transition ${
                        isChecked
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-medium'
                          : 'bg-[var(--bv-surface)] border-[var(--bv-line)] hover:border-[var(--bv-brand)]/40 text-[var(--bv-ink)]'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="size-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Square className="size-4 text-[var(--bv-muted)] shrink-0" />
                      )}
                      <span className={isChecked ? 'line-through opacity-80' : ''}>{task}</span>
                    </div>
                  );
                })}
              </div>

              {isCompleted && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-3">
                  <Trophy className="size-5 shrink-0 text-emerald-500" />
                  <div>
                    <strong>Project Certified!</strong> You verified all requirements for {project.title} and earned +{project.xp} XP!
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
