import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getProgress } from "@/lib/queries";
import { guidedProjects } from "@/content";
import { Pill, LinkButton } from "@/components/ui";
import { Icon } from "@/components/icon-registry";
import { ProjectChecklist } from "@/components/projects/checklist";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = guidedProjects.find((p) => p.slug === slug);
  return { title: project ? `${project.title} · Guided project` : "Project" };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = guidedProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  const user = await requireUser();
  const progress = getProgress(user.id);
  const state = progress.projects.get(project.slug);
  const steps = state?.steps ?? [];
  const completed = Boolean(state?.completed);

  const projectXp =
    project.difficulty === "Beginner" ? 120 : project.difficulty === "Intermediate" ? 180 : 240;

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/build" className="font-semibold text-brand hover:underline">
          Guided projects
        </Link>
        <Icon name="chevronRight" size={13} />
        <span className="text-ink">{project.title}</span>
      </nav>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="brand">{project.difficulty}</Pill>
          <Pill>
            <Icon name="clock" size={13} /> ~{project.minutes} min
          </Pill>
          <Pill tone="accent">{projectXp} XP</Pill>
          {completed && <Pill tone="success">✓ Finished</Pill>}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">{project.title}</h1>
        <p className="text-base font-semibold text-brand">{project.tagline}</p>
        <p className="max-w-3xl leading-relaxed text-ink-soft">{project.overview}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <Pill key={tech}>{tech}</Pill>
          ))}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* main column */}
        <div className="space-y-6 lg:col-span-2">
          <section className="bv-card p-5" aria-labelledby="learn-heading">
            <h2 id="learn-heading" className="text-base font-bold text-ink">
              What you will practice
            </h2>
            <ul className="mt-3 space-y-2">
              {project.youWillLearn.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-ink-soft">
                  <Icon name="check" size={16} className="mt-0.5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bv-card p-5" aria-labelledby="stages-heading">
            <h2 id="stages-heading" className="text-base font-bold text-ink">
              How to build it
            </h2>
            <ol className="mt-4 space-y-4">
              {project.stages.map((stage, index) => (
                <li key={index} className="flex gap-4">
                  <span
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-ink">{stage.title}</h3>
                    {stage.body.map((paragraph, i) => (
                      <p key={i} className="mt-1 text-sm leading-relaxed text-ink-soft">
                        {paragraph}
                      </p>
                    ))}
                    {stage.tip && (
                      <p className="mt-2 rounded-lg border border-accent/25 bg-brand-soft/50 px-3 py-2 text-sm text-ink-soft">
                        <span className="font-semibold text-accent">Tip: </span>
                        {stage.tip}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="bv-card p-5" aria-labelledby="requirements-heading">
            <h2 id="requirements-heading" className="text-base font-bold text-ink">
              Real-world requirements
            </h2>
            <ul className="mt-3 space-y-2">
              {project.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-ink-soft">
                  <Icon name="target" size={16} className="mt-0.5 shrink-0 text-brand" />
                  {req}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* sidebar */}
        <aside className="space-y-4">
          <ProjectChecklist
            projectSlug={project.slug}
            items={project.checklist}
            initialSteps={steps}
            initialCompleted={completed}
            xp={projectXp}
          />

          {completed && (
            <section className="bv-card p-5">
              <h2 className="text-base font-bold text-ink">Show it off 🎉</h2>
              <p className="mt-1 text-sm text-muted">
                Finished builds belong on your Builder ID — the shareable page employers see.
              </p>
              <div className="mt-3">
                <LinkButton href="/profile#portfolio" variant="secondary" size="sm">
                  Add to your portfolio
                </LinkButton>
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}