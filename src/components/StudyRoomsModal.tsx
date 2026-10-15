import React, { useEffect, useState } from 'react';
import { X, Users, Plus, Trash2, Play, Pause, RotateCcw, Copy } from 'lucide-react';

/** STUDY ROOMS — private study spaces (localStorage bv_study_rooms). */
interface ChecklistItem { id: string; text: string; done: boolean; }
interface StudyRoom {
  id: string; name: string; goal: string; language: string;
  code: string; members: string[]; owner: string;
  checklist: ChecklistItem[]; notes: string;
}
const KEY = 'bv_study_rooms';
const load = (): StudyRoom[] => {
  try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : []; } catch { return []; }
};
const makeCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();
interface Props { isOpen: boolean; onClose: () => void; username: string; }
export const StudyRoomsModal: React.FC<Props> = ({ isOpen, onClose, username }) => {
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [task, setTask] = useState('');
  const [secs, setSecs] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  useEffect(() => { if (isOpen) setRooms(load()); }, [isOpen]);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSecs(s => (s <= 1 ? (setRunning(false), 0) : s - 1)), 1000);
    return () => clearInterval(t);
  }, [running]);
  if (!isOpen) return null;
  const active = rooms.find(r => r.id === activeId) || null;
  const update = (n: StudyRoom[]) => { setRooms(n); localStorage.setItem(KEY, JSON.stringify(n)); };
  const mm = String(Math.floor(secs / 60)).padStart(2, '0') + ':' + String(secs % 60).padStart(2, '0');
  const create = () => {
    if (!name.trim()) return;
    const r: StudyRoom = { id: 'room-' + Date.now(), name: name.trim(), goal: goal.trim() || 'Learn together', language: 'General', code: makeCode(), members: [username], owner: username, checklist: [], notes: '' };
    const n = [r, ...rooms]; update(n); setActiveId(r.id); setName(''); setGoal('');
  };
  const join = () => {
    const r = rooms.find(x => x.code === joinCode.trim().toUpperCase());
    if (!r) { alert('No room with that code.'); return; }
    if (!r.members.includes(username)) update(rooms.map(x => x.id === r.id ? { ...x, members: [...x.members, username] } : x));
    setActiveId(r.id); setJoinCode('');
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border bg-[var(--bv-surface)] text-[var(--bv-ink)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--bv-line)]">
          <div className="flex items-center gap-2"><Users className="size-5 text-[var(--bv-brand)]" /><h2 className="font-extrabold">Study Rooms</h2></div>
          <button onClick={onClose}><X className="size-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3 text-sm">
          {!active && (
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl border border-[var(--bv-line)] space-y-2">
                  <h3 className="font-bold">Create a room</h3>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Room name" className="w-full p-2 rounded-xl border text-xs" />
                  <input value={goal} onChange={e => setGoal(e.target.value)} placeholder="Learning goal" className="w-full p-2 rounded-xl border text-xs" />
                  <button onClick={create} className="w-full py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold flex items-center justify-center gap-1"><Plus className="size-3.5" /> Create</button>
                </div>
                <div className="p-3 rounded-2xl border border-[var(--bv-line)] space-y-2">
                  <h3 className="font-bold">Join with code</h3>
                  <input value={joinCode} onChange={e => setJoinCode(e.target.value)} placeholder="CODE" className="w-full p-2 rounded-xl border text-xs font-mono uppercase" />
                  <button onClick={join} className="w-full py-2 rounded-xl border text-xs font-bold">Join</button>
                </div>
              </div>
              {rooms.map(r => (
                <button key={r.id} onClick={() => setActiveId(r.id)} className="w-full text-left p-3 rounded-xl border text-xs">
                  <div className="font-bold">{r.name}</div>
                  <div className="opacity-70">{r.goal} · {r.members.length} member(s)</div>
                </button>
              ))}
            </div>
          )}
          {active && (
            <div className="space-y-3">
              <button onClick={() => setActiveId(null)} className="text-xs font-bold text-[var(--bv-brand)]">← All rooms</button>
              <div className="flex items-center justify-between gap-2">
                <div><div className="font-extrabold">{active.name}</div><div className="text-[11px] opacity-70">{active.goal} · {active.members.join(', ')}</div></div>
                <div className="flex items-center gap-1 text-xs">
                  <code className="px-2 py-1 rounded-lg border font-mono font-bold">{active.code}</code>
                  <button onClick={() => navigator.clipboard?.writeText(active.code)} title="Copy code"><Copy className="size-3.5" /></button>
                </div>
              </div>
              <div className="p-3 rounded-2xl border space-y-2">
                <div className="font-bold text-xs">Focus timer 🍅 {mm}</div>
                <div className="flex gap-2">
                  <button onClick={() => setRunning(!running)} className="px-3 py-1 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold flex items-center gap-1">{running ? <Pause className="size-3" /> : <Play className="size-3" />}{running ? 'Pause' : 'Start'}</button>
                  <button onClick={() => { setRunning(false); setSecs(25 * 60); }} className="px-3 py-1 rounded-xl border text-xs font-bold flex items-center gap-1"><RotateCcw className="size-3" /> Reset</button>
                </div>
                <div className="flex gap-2">
                  <input value={task} onChange={e => setTask(e.target.value)} placeholder="Add shared task" className="flex-1 p-2 rounded-xl border text-xs" />
                  <button onClick={() => { if (!task.trim()) return; update(rooms.map(r => r.id === active.id ? { ...r, checklist: [...r.checklist, { id: 't' + Date.now(), text: task.trim(), done: false }] } : r)); setTask(''); }} className="px-3 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold">Add</button>
                </div>
                {active.checklist.map(c => (
                  <label key={c.id} className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={c.done} onChange={() => update(rooms.map(r => r.id === active.id ? { ...r, checklist: r.checklist.map(x => x.id === c.id ? { ...x, done: !x.done } : x) } : r))} />
                    <span className={c.done ? 'line-through opacity-60' : ''}>{c.text}</span>
                  </label>
                ))}
                <textarea value={active.notes} onChange={e => update(rooms.map(r => r.id === active.id ? { ...r, notes: e.target.value } : r))} placeholder="Session notes…" rows={3} className="w-full p-2 rounded-xl border text-xs" />
                <button onClick={() => { update(rooms.filter(r => r.id !== active.id)); setActiveId(null); }} className="text-[11px] font-bold text-rose-600 flex items-center gap-1"><Trash2 className="size-3" /> Delete / leave</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
