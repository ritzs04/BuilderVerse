import React, { useState } from 'react';
import { X, Sparkles, Send, Bug, Lightbulb, Brain, Layers, Copy, Check, Heart, Terminal } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'debug' | 'explain' | 'hint' | 'project';
  initialContext?: string;
  initialCode?: string;
  initialError?: string;
}

interface Message {
  sender: 'user' | 'sprout';
  text: string;
  timestamp: string;
  isErrorExplanation?: boolean;
}

const PRESET_QUERIES = [
  { label: 'Why is my variable undefined?', text: 'Why is my variable returning undefined even though I defined it?' },
  { label: 'Explain Flexbox in plain English', text: 'Can you explain CSS flexbox and justify-content using a simple real-life analogy?' },
  { label: 'What is a Promise in JS?', text: 'What is a Promise and async/await in JavaScript? Why do we need it?' },
  { label: 'How does event bubbling work?', text: 'How does DOM event bubbling work, and why does event delegation save memory?' }
];

export const AiMentorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialMode = 'explain',
  initialContext = '',
  initialCode = '',
  initialError = ''
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'debug' | 'explain' | 'hint' | 'project'>(initialMode);
  const [prompt, setPrompt] = useState('');
  const [codeSnippet, setCodeSnippet] = useState(initialCode);
  const [errorSnippet, setErrorSnippet] = useState(initialError);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'sprout',
      text: "Hello, Builder! 🌷 I'm Sprout AI, your gentle coding companion. Feeling stuck or confused by an error? Don't worry at all — every error is just a puzzle with helpful clues. How can I help you today?",
      timestamp: 'Just now'
    }
  ]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim() && !codeSnippet.trim() && !errorSnippet.trim()) return;

    const userMessage: Message = {
      sender: 'user',
      text: textToSend || (errorSnippet ? `Help me understand this error: ${errorSnippet}` : 'Here is my code, please review it!'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          code: codeSnippet,
          errorText: errorSnippet,
          mode,
          context: initialContext || mode
        })
      });

      const data = await res.json();
      const replyText = data.reply || "Take a deep breath! Everything can be solved one line at a time. 🌸";

      setMessages(prev => [
        ...prev,
        {
          sender: 'sprout',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'sprout',
          text: "I had a tiny hiccup reaching my server, but here is a warm tip: check line numbers in the console and ensure all parentheses and brackets are properly closed! 🌷",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl h-[88vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bv-surface)',
          borderColor: 'var(--bv-line)',
          color: 'var(--bv-ink)'
        }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--bv-line)] bg-[var(--bv-surface)]">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[var(--bv-brand-soft)] text-2xl shadow-xs">
              🌷
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
                  Sprout AI
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bv-brand-soft)] text-[var(--bv-brand)]">
                  Gemini 3.8 Flash
                </span>
              </div>
              <h2 className="text-base font-bold text-[var(--bv-ink)]">
                The Gentle Coding Mentor
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

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-[var(--bv-line)] px-4 sm:px-6 bg-[var(--bv-surface-2)]/40 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'explain', label: '💡 Explain Concept', icon: <Lightbulb className="size-3.5" /> },
            { id: 'debug', label: '🐛 Diagnose Bug', icon: <Bug className="size-3.5" /> },
            { id: 'hint', label: '🧠 Socratic Hint', icon: <Brain className="size-3.5" /> },
            { id: 'project', label: '🛠️ Break Down Steps', icon: <Layers className="size-3.5" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as any)}
              className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                mode === tab.id
                  ? 'border-[var(--bv-brand)] text-[var(--bv-brand)] font-bold'
                  : 'border-transparent text-[var(--bv-muted)] hover:text-[var(--bv-ink)]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Chat Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                {msg.sender === 'sprout' ? (
                  <span className="text-[11px] font-bold text-[var(--bv-brand)] flex items-center gap-1">
                    <span>🌱 Sprout AI</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-[var(--bv-muted)]">
                    You
                  </span>
                )}
                <span className="text-[10px] text-[var(--bv-muted)]">· {msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[88%] sm:max-w-[82%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed relative group ${
                  msg.sender === 'user'
                    ? 'bg-[var(--bv-brand)] text-white rounded-tr-none shadow-sm'
                    : 'bg-[var(--bv-surface-2)] text-[var(--bv-ink)] rounded-tl-none border border-[var(--bv-line)]'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {msg.sender === 'sprout' && (
                  <button
                    onClick={() => handleCopy(msg.text, idx)}
                    className="absolute top-2 right-2 p-1 rounded-md text-[var(--bv-muted)] hover:text-[var(--bv-ink)] hover:bg-[var(--bv-surface)] opacity-0 group-hover:opacity-100 transition"
                    title="Copy advice"
                  >
                    {copiedIndex === idx ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[var(--bv-surface-2)] text-xs text-[var(--bv-brand)] border border-[var(--bv-line)] w-fit">
              <span className="animate-spin">🌸</span>
              <span className="font-semibold">Sprout AI is preparing a gentle, step-by-step answer...</span>
            </div>
          )}
        </div>

        {/* Preset Quick Chips if in Explain Mode */}
        {mode === 'explain' && (
          <div className="px-4 py-2 border-t border-[var(--bv-line)] bg-[var(--bv-surface)] overflow-x-auto flex gap-2 text-xs">
            {PRESET_QUERIES.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q.text)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-[var(--bv-surface-2)] hover:bg-[var(--bv-brand-soft)] hover:text-[var(--bv-brand)] text-[var(--bv-ink-soft)] text-[11px] font-medium transition"
              >
                💡 {q.label}
              </button>
            ))}
          </div>
        )}

        {/* Input composer with optional code drawer for Debug Mode */}
        <div className="p-4 border-t border-[var(--bv-line)] bg-[var(--bv-surface)] space-y-2">
          {mode === 'debug' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                placeholder="Error message (e.g. ReferenceError: nam is not defined)"
                value={errorSnippet}
                onChange={e => setErrorSnippet(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] focus:outline-none focus:border-[var(--bv-brand)] text-[var(--bv-ink)]"
              />
              <input
                type="text"
                placeholder="Paste confusing snippet (optional)"
                value={codeSnippet}
                onChange={e => setCodeSnippet(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] focus:outline-none focus:border-[var(--bv-brand)] font-mono text-[var(--bv-ink)]"
              />
            </div>
          )}

          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={
                mode === 'debug'
                  ? 'Ask why this bug happened or how to fix it...'
                  : mode === 'hint'
                    ? 'Ask for a hint without spoiling the solution...'
                    : 'Ask any question: "What does this code do?"...'
              }
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] focus:outline-none focus:border-[var(--bv-brand)] text-[var(--bv-ink)]"
            />
            <button
              type="submit"
              disabled={isLoading || (!prompt.trim() && !codeSnippet.trim() && !errorSnippet.trim())}
              className="px-4 py-2.5 rounded-2xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-sm disabled:opacity-40 flex items-center gap-1.5"
            >
              <Send className="size-3.5" />
              <span>Ask</span>
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-[var(--bv-muted)] px-1">
            <span>Powered by Gemini 3.8 Flash · Always patient, always supportive 🌸</span>
            <span>Zero judgment, only learning.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
