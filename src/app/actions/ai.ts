"use server";

import { first, run, isoNow } from "@/lib/db";
import { requireUserOrThrow } from "@/lib/auth";
import { getStats } from "@/lib/gamification";
import { getProgress } from "@/lib/queries";
import { levelForXp } from "@/content";

type ChatMessage = { role: "user" | "assistant"; content: string };

export type AiResult =
  | { ok: true; reply: string }
  | { ok: false; unavailable: true }
  | { ok: false; error: string };

const API_KEY = process.env.AI_API_KEY?.trim();
const BASE_URL = (process.env.AI_BASE_URL?.trim() ?? "https://api.openai.com/v1").replace(
  /\/+$/,
  "",
);
const MODEL = process.env.AI_MODEL?.trim() ?? "gpt-4o-mini";

const MAX_HISTORY = 12;

function buildSystemPrompt(userName: string, progressSummary: string): string {
  return [
    "You are Builder AI, the friendly built-in mentor inside BuilderVerse, a web development learning platform.",
    `The learner's name is ${userName}. Progress so far: ${progressSummary}.`,
    "Guidelines:",
    "- Keep answers concrete, beginner-friendly and code-first when useful.",
    "- Prefer one short working example over a long lecture.",
    "- If the learner mentions interview stress, be calm and encouraging, but honest.",
    "- If you do not know something, say so plainly. Never invent APIs or URLs.",
    "- The learner is studying HTML, CSS, JavaScript, the DOM, HTTP APIs and Git.",
  ].join("\n");
}

export async function askBuilderAction(message: string): Promise<AiResult> {
  const user = await requireUserOrThrow();
  const messageValue = message.trim();
  if (!messageValue) return { ok: false, error: "The message is empty." };

  if (!API_KEY) {
    return { ok: false, unavailable: true };
  }

  const stats = getStats(user.id);
  const progress = getProgress(user.id);
  const level = levelForXp(stats.xp);

  const progressSummary =
    `level ${level.level} (${level.title}), ${stats.xp} XP, ` +
    `${stats.lessonsCompleted} lessons, ${stats.thinkingSolved} thinking puzzles, ` +
    `${stats.debugSolved} debugging puzzles, ${stats.projectsCompleted} projects, ` +
    `${progress.completedLessons.size} lessons marked complete.`;

  const conversation = first<{ id: string; messages: string }>(
    "SELECT id, messages FROM ai_conversations WHERE user_id = ? AND mode = 'assistant'",
    user.id,
  );
  const parsedHistory: unknown = conversation ? JSON.parse(conversation.messages) : [];
const history: ChatMessage[] = Array.isArray(parsedHistory)
  ? parsedHistory.filter(
      (entry): entry is ChatMessage =>
        typeof entry === "object" &&
        entry !== null &&
        ((entry as ChatMessage).role === "user" || (entry as ChatMessage).role === "assistant") &&
        typeof (entry as ChatMessage).content === "string",
    )
  : [];

  const outgoing: ChatMessage[] = [...history, { role: "user", content: messageValue }];

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: buildSystemPrompt(user.name, progressSummary) },
          ...outgoing.slice(-MAX_HISTORY),
        ],
        temperature: 0.7,
        max_tokens: 700,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      if (response.status === 401 || response.status === 403) {
        return { ok: false, unavailable: true };
      }
      console.error(`Builder AI request failed (${response.status}):`, text.slice(0, 300));
      return { ok: false, error: "The AI service did not respond. Please try again in a moment." };
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return { ok: false, error: "The AI service returned an empty response. Try again." };
    }

    const updated = (
  [...outgoing, { role: "assistant" as const, content: reply }].slice(-MAX_HISTORY) as ChatMessage[]
);
    const messagesJson = JSON.stringify(updated);

    if (conversation) {
      run(
        "UPDATE ai_conversations SET messages = ?, updated_at = ? WHERE id = ?",
        messagesJson,
        isoNow(),
        conversation.id,
      );
    } else {
      run(
        "INSERT INTO ai_conversations (id, user_id, mode, title, messages, created_at, updated_at) VALUES (?, ?, 'assistant', 'General chat', ?, ?, ?)",
        crypto.randomUUID(),
        user.id,
        messagesJson,
        isoNow(),
        isoNow(),
      );
    }

    return { ok: true, reply };
  } catch (error) {
    console.error("Builder AI fetch failed:", error);
    return { ok: false, error: "Could not reach the AI service. Check your connection and try again." };
  }
}