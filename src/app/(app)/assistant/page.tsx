import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { SectionHeading, Pill } from "@/components/ui";
import { Chat } from "@/components/assistant/chat";

export const metadata: Metadata = {
  title: "Builder AI",
  description: "Your built-in coding mentor — ask questions, plan projects, practice interviews.",
};

export default async function AssistantPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          level="h1"
          eyebrow="Your coding mentor"
          title="Builder AI"
          sub="Ask anything: a concept that won't click, a project plan, interview questions, or “why is my code broken?” — you get answers written for your exact level."
        />
        <Pill tone={process.env.AI_API_KEY?.trim() ? "accent" : "neutral"}>
          {process.env.AI_API_KEY?.trim() ? "Powered by your AI_API_KEY" : "Set AI_API_KEY to enable"}
        </Pill>
      </section>

      <Chat userName={user.name.split(" ")[0]} />
    </div>
  );
}