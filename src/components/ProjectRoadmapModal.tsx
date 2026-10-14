import React, { useState } from 'react';
import { GuidedProject, GUIDED_PROJECTS } from '../data/builderVerseData';
import { 
  X, MapPin, CheckCircle2, Circle, ArrowRight, Play, Trophy, 
  Sparkles, Compass, Route, Clock, Zap, Star, Filter, Target, 
  Layers, CheckSquare
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  completedProjectIds: string[];
  onSelectProject: (project: GuidedProject) => void;
  onTriggerConfetti?: () => void;
}

interface RoadmapPhase {
  id: string;
  number: number;
  title: string;
  tagline: string;
  description: string;
  color: string;
  projectSlugs: string[];
}

const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: 'phase-1',
    number: 1,
    title: 'Visual & Semantic Foundations',
    tagline: 'Structure, layout, and fundamental user interactions',
    description: 'Master semantic document trees, responsive box models, CSS Grid, and state machines before tackling complex data.',
    color: '#A65F79',
    projectSlugs: ['personal-portfolio', 'calculator']
  },
  {
    id: 'phase-2',
    number: 2,
    title: 'Networking & Data Persistence',
    tagline: 'Talking to servers, APIs, and client-side storage',
    description: 'Learn how modern applications fetch network data with async/await, handle HTTP status codes, and securely store local user state.',
    color: '#C27D38',
    projectSlugs: ['weather-app', 'password-manager']
  },
  {
    id: 'phase-3',
    number: 3,
    title: 'Interactive Experiences & Pipelines',
    tagline: 'Simulated real-time feeds and multi-stage workflow boards',
    description: 'Advance to state machines that handle chat messaging, typing indicators, auto-scrolling, and multi-column kanban board stages.',
    color: '#47765C',
    projectSlugs: ['chat-application', 'kanban-board']
  },
  {
    id: 'phase-4',
    number: 4,
    title: 'Computational & Algorithmic Engines',
    tagline: 'Asynchronous animations and performance visualization',
    description: 'Build algorithmic engines that animate computational sorting passes, step through loops, and measure time complexities.',
    color: '#795E6C',
    projectSlugs: ['algorithm-visualizer']
  }
];

export const ProjectRoadmapModal: React.FC<Props> = ({
  isOpen,
  onClose,
  completedProjectIds,
  onSelectProject,
  onTriggerConfetti
}) => {
  if (!isOpen) return null;

  const [activeCareerTrack, setActiveCareerTrack] = useState<'fullstack' | 'frontend' | 'interactive'>('fullstack');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('all');

  const totalProjects = GUIDED_PROJECTS.length;
  const completedCount = completedProjectIds.length;
  const completionPercent = Math.round((completedCount / totalProjects) * 100);

  // Find next recommended project
  const nextProject = GUIDED_PROJECTS.find(p => !completedProjectIds.includes(p.id)) || GUIDED_PROJECTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[92vh] rounded-3xl border flex flex-col shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bv-surface)',
          borderColor: 'var(--bv-line)'
        }}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[var(--bv-line)] flex items-start justify-between gap-4 bg-gradient-to-r from-[var(--bv-surface-2)]/60 to-[var(--bv-surface)]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bv-brand-soft)] text-[var(--bv-brand)] text-xs font-bold border border-[var(--bv-brand)]/20">
              <Compass className="size-3.5" />
              <span>Architectural Blueprint</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--bv-ink)] flex items-center gap-2">
              <span>Project Learning Roadmap</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                {completedCount} of {totalProjects} Built ({completionPercent}%)
              </span>
            </h2>
            <p className="text-xs text-[var(--bv-muted)] max-w-xl">
              A sequenced roadmap that bridges the gap between basic coding syntax and production-ready software engineering.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--bv-muted)] hover:text-[var(--bv-ink)] hover:bg-[var(--bv-surface-2)] transition cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Global Progress Bar Strip */}
        <div className="px-6 py-3.5 bg-[var(--bv-surface-2)]/40 border-b border-[var(--bv-line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="font-bold text-[var(--bv-ink)] shrink-0 flex items-center gap-1.5">
              <Route className="size-4 text-[var(--bv-brand)]" />
              Roadmap Progress:
            </span>
            <div className="w-36 sm:w-48 bg-[var(--bv-surface)] h-2.5 rounded-full overflow-hidden border border-[var(--bv-line)] shrink-0">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[var(--bv-brand)] to-emerald-500 transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <span className="font-extrabold text-[var(--bv-brand)] shrink-0">
              {completionPercent}%
            </span>
          </div>

          {/* Next Recommended Milestone Tag */}
          {nextProject && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[var(--bv-muted)]">Recommended Next:</span>
              <button
                onClick={() => {
                  onClose();
                  onSelectProject(nextProject);
                }}
                className="px-2.5 py-1 rounded-lg bg-[var(--bv-brand)] text-white text-[11px] font-bold hover:bg-[var(--bv-brand-strong)] transition flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <span>{nextProject.title}</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          )}
        </div>

        {/* Career Track Filter Buttons */}
        <div className="px-6 pt-4 pb-2 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--bv-line)]/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--bv-muted)] flex items-center gap-1">
              <Target className="size-3.5" /> Track:
            </span>
            {[
              { id: 'fullstack', label: '🚀 Full-Stack Path' },
              { id: 'frontend', label: '🎨 UI & Frontend' },
              { id: 'interactive', label: '⚡ Interactive Apps' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveCareerTrack(t.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeCareerTrack === t.id
                    ? 'bg-[var(--bv-brand)] text-white shadow-xs'
                    : 'bg-[var(--bv-surface-2)] text-[var(--bv-ink-soft)] hover:bg-[var(--bv-surface-3)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-[var(--bv-muted)] flex items-center gap-2">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="size-3.5" /> Built
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-[var(--bv-brand)] font-semibold">
              <Play className="size-3.5" /> Ready to Build
            </span>
          </div>
        </div>

        {/* Content Body: Timeline Roadmap */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8">
          {ROADMAP_PHASES.map((phase) => {
            const phaseProjects = GUIDED_PROJECTS.filter(p => phase.projectSlugs.includes(p.id));
            const completedInPhase = phaseProjects.filter(p => completedProjectIds.includes(p.id)).length;
            const isPhaseDone = completedInPhase === phaseProjects.length && phaseProjects.length > 0;

            return (
              <div 
                key={phase.id} 
                className="rounded-3xl border border-[var(--bv-line)] bg-[var(--bv-surface-2)]/30 p-5 sm:p-6 space-y-5"
              >
                {/* Phase Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--bv-line)]">
                  <div className="flex items-center gap-3">
                    <span 
                      className="grid size-9 place-items-center rounded-xl text-white font-black text-sm shadow-xs"
                      style={{ backgroundColor: phase.color }}
                    >
                      {phase.number}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-base text-[var(--bv-ink)] flex items-center gap-2">
                        <span>Phase {phase.number}: {phase.title}</span>
                        {isPhaseDone && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="size-3" /> Mastered
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-[var(--bv-muted)]">{phase.tagline}</p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[var(--bv-ink-soft)] px-2.5 py-1 rounded-lg bg-[var(--bv-surface)] border border-[var(--bv-line)] self-start sm:self-auto">
                    {completedInPhase} of {phaseProjects.length} Projects Built
                  </span>
                </div>

                {/* Projects in Phase */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phaseProjects.map((project, idx) => {
                    const isCompleted = completedProjectIds.includes(project.id);
                    const isNextTarget = nextProject?.id === project.id;

                    const difficultyBadge = 
                      project.difficulty === 'Beginner'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                        : project.difficulty === 'Intermediate'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                        : 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20';

                    return (
                      <div
                        key={project.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isCompleted
                            ? 'bg-emerald-500/5 border-emerald-500/30 shadow-xs'
                            : isNextTarget
                            ? 'bg-[var(--bv-surface)] border-2 border-[var(--bv-brand)] shadow-sm'
                            : 'bg-[var(--bv-surface)] border-[var(--bv-line)] hover:border-[var(--bv-brand)]/40'
                        }`}
                      >
                        <div className="space-y-2.5">
                          {/* Top Row: Milestone Step & Status */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-[var(--bv-brand)]">
                                Milestone {phase.number}.{idx + 1}
                              </span>
                              {isNextTarget && !isCompleted && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--bv-brand)] text-white animate-pulse">
                                  Current Goal
                                </span>
                              )}
                            </div>

                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${difficultyBadge}`}>
                              {project.difficulty}
                            </span>
                          </div>

                          {/* Title & Tagline */}
                          <div>
                            <h4 className="font-extrabold text-sm text-[var(--bv-ink)] flex items-center justify-between">
                              <span>{project.title}</span>
                              {isCompleted && (
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="size-4" />
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-[var(--bv-muted)] mt-0.5 line-clamp-1">
                              {project.tagline}
                            </p>
                          </div>

                          {/* Key Skills Chip List */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {project.skillsGained.slice(0, 3).map(skill => (
                              <span 
                                key={skill}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bv-surface-2)] text-[var(--bv-ink-soft)] font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Footer & Launch Action */}
                        <div className="mt-4 pt-3 border-t border-[var(--bv-line)] flex items-center justify-between text-xs font-bold">
                          <span className="text-amber-600 flex items-center gap-1">
                            <Zap className="size-3 fill-amber-500" />
                            +{project.xp} XP
                          </span>

                          <button
                            onClick={() => {
                              onClose();
                              onSelectProject(project);
                            }}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer ${
                              isCompleted
                                ? 'bg-[var(--bv-surface-2)] text-[var(--bv-ink)] hover:bg-[var(--bv-surface-3)]'
                                : 'bg-[var(--bv-brand)] text-white hover:bg-[var(--bv-brand-strong)] shadow-xs'
                            }`}
                          >
                            <span>{isCompleted ? 'Review Project' : 'Open Milestone'}</span>
                            <ArrowRight className="size-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Callout */}
        <div className="p-4 sm:p-5 border-t border-[var(--bv-line)] bg-[var(--bv-surface-2)]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[var(--bv-muted)]">
            <Sparkles className="size-4 text-[var(--bv-brand)] shrink-0" />
            <span>Completing all milestones certifications awards the exclusive <strong>Full-Stack Architect</strong> badge!</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--bv-brand)] text-white font-bold hover:bg-[var(--bv-brand-strong)] transition cursor-pointer shrink-0"
          >
            Done Viewing
          </button>
        </div>
      </div>
    </div>
  );
};
