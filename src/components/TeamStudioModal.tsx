import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2, Copy } from 'lucide-react';

/** TEAM PROJECT STUDIO — small team workspace (localStorage bv_teams). */
interface TeamTask { id: string; title: string; assignee: string; done: boolean; }
interface Team { id: string; name: string; goal: string; code: string; owner: string; members: string[]; tasks: TeamTask[]; log: string[]; }
const KEY = 'bv_teams';
const load = (): Team[] => { try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : []; } catch { return []; } };
const makeCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();
interface Props { isOpen: boolean; onClose: () => void; username: string; }
export const TeamStudioModal: React.FC<Props> = ({ isOpen, onClose, username }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [name, setName] = useState(''); const [goal, setGoal] = useState('');
  const [task, setTask] = useState(''); const [assignee, setAssignee] = useState('');
  useEffect(() => { if (isOpen) { setTeams(load()); setActiveId(null); } }, [isOpen]);
  if (!isOpen) return null;
  const active = teams.find(t => t.id === activeId) || null;
  const update = (n: Team[]) => { setTeams(n); localStorage.setItem(KEY, JSON.stringify(n)); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border bg-[var(--bv-surface)] text-[var(--bv-ink)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--bv-line)]">
          <h2 className="font-extrabold">Team Project Studio</h2>
          <button onClick={onClose}><X className="size-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3 text-sm">
          {!active && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl border space-y-2">
                <div className="font-bold">Create a team</div>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Team name" className="w-full p-2 rounded-xl border text-xs" />
                <input value={goal} onChange={e => setGoal(e.target.value)} placeholder="Project goal" className="w-full p-2 rounded-xl border text-xs" />
                <button onClick={() => { if (!name.trim()) return; const t: Team = { id: 'team-' + Date.now(), name: name.trim(), goal: goal.trim(), code: makeCode(), owner: username, members: [username], tasks: [], log: [username + ' created the team'] }; const n = [t, ...teams]; update(n); setActiveId(t.id); setName(''); setGoal(''); }} className="w-full py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold flex items-center justify-center gap-1"><Plus className="size-3.5" /> Create</button>
              </div>
              {teams.map(t => (
                <button key={t.id} onClick={() => setActiveId(t.id)} className="w-full text-left p-3 rounded-xl border text-xs">
                  <div className="font-bold">{t.name}</div>
                  <div className="opacity-70">{t.goal} · {t.tasks.filter(x => x.done).length}/{t.tasks.length} done</div>
                </button>
              ))}
            </div>
          )}
          {active && (
            <div className="space-y-3">
              <button onClick={() => setActiveId(null)} className="text-xs font-bold text-[var(--bv-brand)]">← All teams</button>
              <div className="flex items-center justify-between gap-2">
                <div><div className="font-extrabold">{active.name}</div><div className="text-[11px] opacity-70">{active.goal} · {active.members.join(', ')}</div></div>
                <button onClick={() => navigator.clipboard?.writeText(active.code)} className="text-xs font-mono font-bold border rounded-lg px-2 py-1 flex items-center gap-1" title="Copy invite code"><Copy className="size-3" />{active.code}</button>
              </div>
              <div className="flex gap-2">
                <input value={task} onChange={e => setTask(e.target.value)} placeholder="Task" className="flex-1 p-2 rounded-xl border text-xs" />
                <input value={assignee} onChange={e => setAssignee(e.target.value)} placeholder="Who" className="w-20 p-2 rounded-xl border text-xs" />
                <button onClick={() => { if (!task.trim()) return; update(teams.map(t => t.id === active.id ? { ...t, tasks: [...t.tasks, { id: 'x' + Date.now(), title: task.trim(), assignee: assignee.trim() || username, done: false }], log: [...t.log, username + ' added: ' + task.trim()] } : t)); setTask(''); }} className="px-3 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold">Add</button>
              </div>
              {active.tasks.map(x => (
                <label key={x.id} className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={x.done} onChange={() => update(teams.map(t => t.id === active.id ? { ...t, tasks: t.tasks.map(y => y.id === x.id ? { ...y, done: !y.done } : y), log: [...t.log, username + (x.done ? ' reopened: ' : ' finished: ') + x.title] } : t))} />
                  <span className={x.done ? 'line-through opacity-60' : ''}>{x.title}</span>
                  <span className="text-[10px] opacity-60">· {x.assignee}</span>
                  {active.owner === username && <button onClick={() => update(teams.map(t => t.id === active.id ? { ...t, tasks: t.tasks.filter(y => y.id !== x.id) } : t))} className="ml-auto text-rose-500"><Trash2 className="size-3" /></button>}
                </label>
              ))}
              <div className="p-3 rounded-2xl border space-y-1">
                <div className="font-bold text-xs">Contributions</div>
                {active.log.slice(-6).map((l, i) => <div key={i} className="text-[11px] opacity-70">• {l}</div>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
