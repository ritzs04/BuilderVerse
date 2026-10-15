import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2, Bookmark, Flag } from 'lucide-react';

/** BUILDER COMMUNITY (localStorage bv_posts). */
interface Comment { id: string; by: string; text: string; }
interface Post { id: string; type: string; title: string; body: string; link: string; by: string; comments: Comment[]; }
const KEY = 'bv_posts';
const load = (k: string, fb: any) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : fb; } catch { return fb; } };
interface Props { isOpen: boolean; onClose: () => void; username: string; onEarnXp: (n: number) => void; }
export const CommunityModal: React.FC<Props> = ({ isOpen, onClose, username, onEarnXp }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [marks, setMarks] = useState<string[]>([]);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [title, setTitle] = useState(''); const [body, setBody] = useState('');
  const [type, setType] = useState('showcase'); const [link, setLink] = useState('');
  useEffect(() => { if (isOpen) { setPosts(load(KEY, [])); setMarks(load('bv_bookmarks', [])); } }, [isOpen]);
  if (!isOpen) return null;
  const update = (n: Post[]) => { setPosts(n); localStorage.setItem(KEY, JSON.stringify(n)); };
  const visible = posts.filter(p => filter === 'all' || p.type === filter).filter(p => !q || (p.title + p.body).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border bg-[var(--bv-surface)] text-[var(--bv-ink)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--bv-line)]">
          <h2 className="font-extrabold">Builder Community</h2>
          <button onClick={onClose}><X className="size-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3 text-sm">
          <div className="p-3 rounded-2xl border text-[11px] opacity-80">Be kind. No harassment or spam. Celebrate effort, give constructive feedback.</div>
          <div className="p-3 rounded-2xl border space-y-2">
            <div className="flex gap-2">
              <select value={type} onChange={e => setType(e.target.value)} className="p-2 rounded-xl border text-xs">
                <option value="showcase">Showcase</option><option value="question">Question</option><option value="tip">Tip</option>
              </select>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="flex-1 p-2 rounded-xl border text-xs" />
            </div>
            <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Share…" rows={2} className="w-full p-2 rounded-xl border text-xs" />
            <div className="flex gap-2">
              <input value={link} onChange={e => setLink(e.target.value)} placeholder="Link https://…" className="flex-1 p-2 rounded-xl border text-xs" />
              <button onClick={() => { if (!title.trim() || !body.trim()) return; if (link.trim() && !/^https?:\/\//i.test(link.trim())) { alert('Links must start with http(s)://'); return; } const p: Post = { id: 'post-' + Date.now(), type, title: title.trim(), body: body.trim(), link: link.trim(), by: username, comments: [] }; update([p, ...posts]); setTitle(''); setBody(''); setLink(''); if (!localStorage.getItem('bv_community_xp')) { localStorage.setItem('bv_community_xp', '1'); onEarnXp(5); } }} className="px-3 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold flex items-center gap-1"><Plus className="size-3.5" /> Post</button>
            </div>
          </div>
          <div className="flex gap-2 items-center text-xs">
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…" className="p-2 rounded-xl border text-xs flex-1" />
            {['all', 'showcase', 'question', 'tip'].map(f => <button key={f} onClick={() => setFilter(f)} className={'px-2 py-1 rounded-full border font-bold ' + (filter === f ? 'bg-[var(--bv-brand)] text-white' : '')}>{f}</button>)}
          </div>
          {visible.length === 0 && <p className="text-xs opacity-60">Nothing here yet — be the first to share. 🌷</p>}
          {visible.map(p => (
            <div key={p.id} className="p-3 rounded-2xl border space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border">{p.type}</span>
                <span className="font-bold">{p.title}</span>
                <span className="ml-auto flex gap-1">
                  <button onClick={() => { const n = marks.includes(p.id) ? marks.filter(m => m !== p.id) : [...marks, p.id]; setMarks(n); localStorage.setItem('bv_bookmarks', JSON.stringify(n)); }}><Bookmark className={'size-3.5 ' + (marks.includes(p.id) ? 'fill-amber-400 text-amber-400' : '')} /></button>
                  {p.by === username && <button onClick={() => update(posts.filter(x => x.id !== p.id))}><Trash2 className="size-3.5 text-rose-500" /></button>}
                </span>
              </div>
              <p className="text-xs opacity-80">{p.body}</p>
              <div className="text-[11px] opacity-60">by {p.by}{p.link && <> · <a href={p.link} target="_blank" rel="noreferrer" className="underline">link</a></>}</div>
              <div className="flex items-center gap-1 text-[11px] opacity-50"><Flag className="size-3" /> Be kind in replies</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
