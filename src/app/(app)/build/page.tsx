import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getProgress } from "@/lib/queries";
import { guidedProjects } from "@/content";
import { Card, Pill, LinkButton, SectionHeading, ProgressBar } from "@/components/ui";
import { Icon } from "@/components/icon-registry";

export const metadata: Metadata = {
  title: "Guided Projects",
  description: "Small, real builds with a checklist that walks you through every step.",
};

export default async function BuildPage() {
  const user = await requireUser();
  const progress = getProgress(user.id);
  const projectCount = guidedProjects.length;
  const finished = guidedProjects.filter((p) => progress.projects.get(p.slug)?.completed).length;

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          level="h1"
          eyebrow="Put a real build on your resume"
          title="Guided projects"
          sub="Reading only takes you so far — these walk you through complete, showable builds. Finish the checklist and you have a portfolio piece people can actually click."
        />
        <div className="text-right">
          <p className="text-2xl font-bold text-ink">
            {finished}/{projectCount}
          </p>
          <p className="text-xs text-muted">projects finished</p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {guidedProjects.map((project) => {
          const state = progress.projects.get(project.slug);
          const done = state?.steps.length ?? 0;
          const complete = Boolean(state?.completed);
          return (
            <Card key={project.slug} className="flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <span
                  className="grid size-12 place-items-center rounded-xl bg-surface-2 text-brand ring-1 ring-line"
                  aria-hidden
                >
                  <Icon name={project.icon} size={22} />
                </span>
                {complete ? (
                  <Pill tone="success">✓ Finished</Pill>
                ) : done > 0 ? (
                  <Pill tone="brand">In progress</Pill>
                ) : (
                  <Pill>{project.difficulty}</Pill>
                )}
              </div>

              <h2 className="mt-3 text-lg font-bold text-ink">{project.title}</h2>
              <p className="text-sm font-medium text-brand">{project.tagline}</p>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                {project.overview}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tech.slice(0, 4).map((tech) => (
                  <Pill key={tech} className="!text-[0.7rem]">
                    {tech}
                  </Pill>
                ))}
              </div>

              <div className="mt-4">
                <ProgressBar
                  value={done}
                  max={project.checklist.length || 1}
                  showValue={false}
                  label={`${done}/${project.checklist.length} steps · ~${project.minutes} min`}
                />
              </div>

              <div className="mt-4">
                <LinkButton
                  href={`/build/${project.slug}`}
                  variant={done > 0 && !complete ? "primary" : "secondary"}
                  size="sm"
                >
                  {done === 0 ? "Start building" : complete ? "Review the build" : "Keep going"}
                </LinkButton>
              </div>
            </Card>
          );
        })}
      </section>

      <Card flat className="flex flex-wrap items-center justify-between gap-3 bg-surface-2">
        <div>
          <p className="text-sm font-semibold text-ink">Want ideas without training wheels?</p>
          <p className="text-sm text-muted">
            The Ideas Vault has 20 real-world concepts with feature lists and challenges.
          </p>
        </div>
        <Link href="/ideas" className="text-sm font-semibold text-brand hover:underline">
          Open the Ideas Vault →
        </Link>
      </Card>
    </div>
  );
}