"use client";

import { useActionState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { addPortfolioProjectAction, deletePortfolioProjectAction } from "@/app/actions/account";
import type { PortfolioResult } from "@/app/actions/account";
import { Button, Input, Textarea, Pill } from "@/components/ui";

interface PortfolioProject {
  id: string;
  name: string;
  description: string;
  tech: string;
  difficulty: string;
  github_url: string | null;
  live_url: string | null;
  completed_date: string | null;
}

const initialState: PortfolioResult = { ok: true };

export function PortfolioManager({
  projects,
}: {
  projects: PortfolioProject[];
}) {
  const [state, formAction, pending] = useActionState(addPortfolioProjectAction, initialState);

  return (
    <div className="space-y-4">
      {projects.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.id} className="bv-card-flat relative p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-ink">{project.name}</h3>
                  <p className="mt-0.5 text-xs text-muted">
                    {project.difficulty}
                    {project.completed_date ? ` · ${project.completed_date}` : ""}
                  </p>
                </div>
                <Pill tone="brand">{project.tech.split(",")[0].trim()}</Pill>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{project.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand hover:underline"
                  >
                    GitHub
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-accent hover:underline"
                  >
                    Live demo
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => void deletePortfolioProjectAction(project.id)}
                  className="ml-auto inline-flex items-center gap-1 text-danger hover:underline"
                  aria-label={`Delete ${project.name}`}
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form action={formAction} className="bv-card-flat space-y-3 !p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-ink">
          <Plus size={16} className="text-brand" /> Add a project you built
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input name="name" placeholder="Project name *" required />
          <Input name="tech" placeholder="Tech stack * (e.g. React, Tailwind)" required />
        </div>
        <Textarea name="description" placeholder="What does it do and what did you learn?" rows={2} />
        <div className="grid gap-3 sm:grid-cols-3">
          <select name="difficulty" className="bv-input text-sm" defaultValue="Beginner" aria-label="Difficulty">
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <Input name="github_url" type="url" placeholder="GitHub URL (optional)" />
          <Input name="live_url" type="url" placeholder="Live URL (optional)" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input name="completed_date" type="date" aria-label="Date completed" />
          <div className="flex items-end">
            <Button type="submit" disabled={pending} className="!w-full">
              {pending ? "Adding…" : "Add to portfolio"}
            </Button>
          </div>
        </div>

        {!state.ok && (
          <p role="alert" className="text-sm font-medium text-danger">
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
}