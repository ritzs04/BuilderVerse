import React, { useState } from 'react';
import { X, Check, Sparkles, User, Heart, Star, Palette } from 'lucide-react';

export interface AvatarOption {
  id: string;
  name: string;
  category: 'students' | 'animals' | 'bots' | 'nature';
  emoji: string;
  badgeBg: string;
  description: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  // Students
  { id: 'student-maya', name: 'Maya', category: 'students', emoji: '👩🏻‍💻', badgeBg: '#F5DCE3', description: 'Curious learner & UI designer' },
  { id: 'student-leo', name: 'Leo', category: 'students', emoji: '🧑🏽‍💻', badgeBg: '#EBD5DD', description: 'Problem solver & coffee lover' },
  { id: 'student-priya', name: 'Priya', category: 'students', emoji: '👩🏾‍💻', badgeBg: '#FCE7EB', description: 'Algorithm enthusiast & clean coder' },
  { id: 'student-sam', name: 'Sam', category: 'students', emoji: '🧑🏼‍💻', badgeBg: '#F2D7E0', description: 'Bug detective & open source builder' },
  { id: 'student-zara', name: 'Zara', category: 'students', emoji: '👩🏽‍🎨', badgeBg: '#F9E5EA', description: 'Creative front-end artist' },
  { id: 'student-alex', name: 'Alex', category: 'students', emoji: '🧑🏻‍💻', badgeBg: '#EED5DE', description: 'Full-stack apprentice & dreamer' },

  // Animals
  { id: 'animal-mochi', name: 'Mochi Cat', category: 'animals', emoji: '🐱', badgeBg: '#F5DCE3', description: 'Purrs quietly when code compiles' },
  { id: 'animal-pip', name: 'Pip Bunny', category: 'animals', emoji: '🐰', badgeBg: '#FFF0F4', description: 'Hops quickly through logic puzzles' },
  { id: 'animal-bao', name: 'Bao Panda', category: 'animals', emoji: '🐼', badgeBg: '#EBE2E6', description: 'Patient builder who loves bamboo breaks' },
  { id: 'animal-rusty', name: 'Rusty Fox', category: 'animals', emoji: '🦊', badgeBg: '#FDECEF', description: 'Clever thinker finding edge cases' },
  { id: 'animal-bear', name: 'Barnaby Bear', category: 'animals', emoji: '🐻', badgeBg: '#F0DFE6', description: 'Warm mentor who never gives up' },
  { id: 'animal-frog', name: 'Kero Frog', category: 'animals', emoji: '🐸', badgeBg: '#E5F3EB', description: 'Leaps gracefully over tricky bugs' },

  // Friendly Bots
  { id: 'bot-sprout', name: 'Sprout Bot', category: 'bots', emoji: '🤖🌱', badgeBg: '#E5F3EB', description: 'Watering your daily coding seeds' },
  { id: 'bot-pixel', name: 'Pixel Bot', category: 'bots', emoji: '👾', badgeBg: '#F5DCE3', description: 'Loves pixel art and retro styling' },
  { id: 'bot-sparky', name: 'Sparky Bot', category: 'bots', emoji: '⚡🤖', badgeBg: '#FFF7E6', description: 'High-energy assistant for syntax questions' },

  // Nature & Cozy
  { id: 'nature-sakura', name: 'Sakura Petal', category: 'nature', emoji: '🌸', badgeBg: '#FFEBF1', description: 'Gentle growth in every season' },
  { id: 'nature-star', name: 'Stargazer', category: 'nature', emoji: '⭐', badgeBg: '#FFF8E6', description: 'Reaching for big ideas with confidence' },
  { id: 'nature-clover', name: 'Lucky Sprout', category: 'nature', emoji: '🍀', badgeBg: '#E2F7EF', description: 'Brings good luck to git commits' }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarId: string;
  currentNickname: string;
  onSave: (avatarId: string, nickname: string) => void;
}

export const AvatarGalleryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentAvatarId,
  currentNickname,
  onSave
}) => {
  if (!isOpen) return null;

  const [selectedId, setSelectedId] = useState<string>(currentAvatarId || 'student-maya');
  const [nickname, setNickname] = useState<string>(currentNickname || 'Builder');
  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'animals' | 'bots' | 'nature'>('all');

  const selectedAvatar = AVATAR_OPTIONS.find(a => a.id === selectedId) || AVATAR_OPTIONS[0];

  const filteredAvatars = activeTab === 'all'
    ? AVATAR_OPTIONS
    : AVATAR_OPTIONS.filter(a => a.category === activeTab);

  const handleConfirm = () => {
    onSave(selectedId, nickname.trim() || 'Builder');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bv-surface)',
          borderColor: 'var(--bv-line)',
          color: 'var(--bv-ink)'
        }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--bv-line)] bg-[var(--bv-surface)]">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[var(--bv-brand-soft)] text-xl">
              🌷
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
                  Personalization
                </span>
                <span className="text-[11px] text-[var(--bv-muted)]">
                  Change anytime
                </span>
              </div>
              <h2 className="text-lg font-bold text-[var(--bv-ink)]">
                Choose Your Builder Avatar
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
          {/* Selected Avatar & Nickname card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-[var(--bv-line)] bg-[var(--bv-surface-2)]/50 flex flex-col sm:flex-row items-center gap-5">
            <div 
              className="size-20 rounded-2xl grid place-items-center text-4xl shadow-md border-2 border-white dark:border-[var(--bv-line)] shrink-0 transition-transform duration-200 scale-105"
              style={{ backgroundColor: selectedAvatar.badgeBg }}
            >
              {selectedAvatar.emoji}
            </div>

            <div className="flex-1 w-full space-y-2 text-center sm:text-left">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--bv-brand)]">
                  Selected Character
                </span>
                <h3 className="font-bold text-base text-[var(--bv-ink)]">
                  {selectedAvatar.name}
                </h3>
                <p className="text-xs text-[var(--bv-muted)]">
                  {selectedAvatar.description}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--bv-ink-soft)] block mb-1">
                  Your Builder Nickname:
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  maxLength={24}
                  placeholder="Enter your nickname"
                  className="w-full max-w-xs px-3 py-1.5 text-xs rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] focus:outline-none focus:border-[var(--bv-brand)] font-medium text-[var(--bv-ink)]"
                />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--bv-muted)]">
                Which little character feels like you?
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[var(--bv-surface-2)] text-xs font-semibold">
              {[
                { id: 'all', label: 'All Friends' },
                { id: 'students', label: '👩🏻‍💻 Students' },
                { id: 'animals', label: '🐱 Animals' },
                { id: 'bots', label: '🤖 Bots' },
                { id: 'nature', label: '🌸 Nature' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-[var(--bv-surface)] text-[var(--bv-brand)] shadow-sm font-bold'
                      : 'text-[var(--bv-muted)] hover:text-[var(--bv-ink)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Avatar Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredAvatars.map(av => {
              const isSelected = av.id === selectedId;

              return (
                <div
                  key={av.id}
                  onClick={() => setSelectedId(av.id)}
                  className={`p-3 rounded-2xl border text-center cursor-pointer select-none transition-all duration-200 relative ${
                    isSelected
                      ? 'bg-[var(--bv-surface)] border-[var(--bv-brand)] shadow-md ring-2 ring-[var(--bv-brand)]/20 -translate-y-0.5'
                      : 'bg-[var(--bv-surface)] border-[var(--bv-line)] hover:border-[var(--bv-line-strong)] hover:-translate-y-0.5'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 size-5 rounded-full bg-[var(--bv-brand)] text-white grid place-items-center shadow-sm">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                  )}

                  <div 
                    className="size-14 mx-auto rounded-xl grid place-items-center text-3xl mb-2"
                    style={{ backgroundColor: av.badgeBg }}
                  >
                    {av.emoji}
                  </div>

                  <h4 className="text-xs font-bold text-[var(--bv-ink)] truncate">
                    {av.name}
                  </h4>
                  <p className="text-[10px] text-[var(--bv-muted)] line-clamp-1 mt-0.5">
                    {av.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--bv-line)] bg-[var(--bv-surface)]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--bv-line)] hover:bg-[var(--bv-surface-2)] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="size-3.5" /> This Is My Avatar
          </button>
        </div>
      </div>
    </div>
  );
};
