"use client";

import { useActionState, useState } from "react";
import { addPersonalIdeaAction, deletePersonalIdeaAction } from "@/app/actions/account";
import { IDEA_CATEGORIES } from "@/lib/validation";
import { Button, Card, Input, Pill, SectionHeading, Textarea } from "@/components/ui";

export interface PersonalIdea {
  id: string;
  title: string;
  problem: string;
  who: string;
  solution: string;
  skills: string;
  category: string;
  created_at: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  education: "Education",
  safety: "Safety",
  accessibility: "Accessibility",
  environment: "Environment",
  community: "Community services",
  productivity: "Productivity",
  health: "Health awareness",
  civic: "Public-interest tech",
  other: "Something else",
};

type AddState = { ok: boolean; error?: string } | null;

async function submit(_prev: AddState, formData: FormData): Promise<AddState> {
  const result = await addPersonalIdeaAction(formData);
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

/**
 * Ideas Vault — the student's own ideas (§14). The curated bank shows what good
 * ideas look like; this form lets them capture problems they actually noticed,
 * which is where the best projects start.
 */
export function PersonalIdeas({ ideas }: { ideas: PersonalIdea[] }) {
  const [state, action, pending] = useActionState(submit, null);
  const [open, setOpen] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  async function remove(id: string) {
    setRemoving(id);
    await deletePersonalIdeaAction(id);
    setRemoving(null);
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionHeading
          level="h2"
          eyebrow="Your own thinking"
          title="My ideas"
          sub="The best projects start with a problem you noticed yourself. Describe it here — even one sentence is enough to begin."
        />
        <div className="flex flex-wrap gap-2">
          <Pill tone="accent">✍️ {ideas.length} of my own</Pill>
          <Button
            variant={open ? "secondary" : "primary"}
            size="sm"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "+ Add my own idea"}
          </Button>
        </div>
      </div>

      {open && (
        <Card>
          <form action={action} className="space-y-4">
            <div>
              <label htmlFor="idea-title" className="bv-label">
                Idea title
              </label>
              <Input
                id="idea-title"
                name="title"
                required
                maxLength={80}
                placeholder="e.g. Bus-stop timetable for my campus"
                className="mt-1.5"
              />
              <p className="mt-1 text-xs text-muted">A short name you will remember it by.</p>
            </div>

            <div>
              <label htmlFor="idea-problem" className="bv-label">
                What problem does it solve?
              </label>
              <Textarea
                id="idea-problem"
                name="problem"
                required
                rows={3}
                maxLength={500}
                placeholder="What goes wrong today, and who it affects."
                className="mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="idea-who" className="bv-label">
                Who has this problem? <span className="font-normal text-muted">(optional)</span>
              </label>
              <Input
                id="idea-who"
                name="who"
                maxLength={160}
                placeholder="e.g. students who catch the 7:40 bus"
                className="mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="idea-solution" className="bv-label">
                Your first idea for a solution{" "}
                <span className="font-normal text-muted">(optional)</span>
              </label>
              <Textarea
                id="idea-solution"
                name="solution"
                rows={3}
                maxLength={500}
                placeholder="A rough sketch is fine — you can refine it later."
                className="mt-1.5"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="idea-skills" className="bv-label">
                  Skills you would practise <span className="font-normal text-muted">(optional)</span>
                </label>
                <Input
                  id="idea-skills"
                  name="skills"
                  maxLength={160}
                  placeholder="e.g. forms, APIs, localStorage"
                  className="mt-1.5"
                />
              </div>
              <div>
                <label htmlFor="idea-category" className="bv-label">
                  Category
                </label>
                <select
                  id="idea-category"
                  name="category"
                  defaultValue="productivity"
                  className="bv-input mt-1.5 w-full text-sm"
                >
                  {IDEA_CATEGORIES.map((value) => (
                    <option key={value} value={value}>
                      {CATEGORY_LABEL[value] ?? value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {state?.ok && (
              <p
                role="status"
                className="rounded-xl bg-success-soft px-4 py-3 text-sm font-semibold text-success"
              >
                Saved to your Ideas Vault. Every builder starts exactly like this. 🌱
              </p>
            )}
            {state?.error && (
              <p
                role="alert"
                className="rounded-xl bg-danger-soft px-4 py-3 text-sm font-semibold text-danger"
              >
                {state.error}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : "Save my idea"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {ideas.length === 0 ? (
        <Card flat className="px-6 py-10 text-center">
          <p className="text-3xl" aria-hidden>
            💡
          </p>
          <p className="mt-2 font-semibold text-ink">No ideas of your own yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">
            Noticing a problem is a real skill. Add one idea and you already have the seed of a
            portfolio project.
          </p>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {ideas.map((idea) => (
            <li key={idea.id} className="bv-card flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-ink">{idea.title}</h3>
                <Pill tone="accent">{CATEGORY_LABEL[idea.category] ?? idea.category}</Pill>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{idea.problem}</p>

              {idea.who && (
                <p className="mt-2 text-sm text-ink-soft">
                  <span className="font-semibold">Who:</span> {idea.who}
                </p>
              )}
              {idea.solution && (
                <p className="mt-2 text-sm text-ink-soft">
                  <span className="font-semibold">My idea:</span> {idea.solution}
                </p>
              )}
              {idea.skills && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {idea.skills.split(",").map((skill) => (
                    <Pill key={skill} className="!text-[0.7rem]">
                      {skill.trim()}
                    </Pill>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <span className="text-xs text-muted">
                  Added {new Date(idea.created_at).toLocaleDateString()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(idea.id)}
                  disabled={removing === idea.id}
                >
                  {removing === idea.id ? "Removing…" : "Remove"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
