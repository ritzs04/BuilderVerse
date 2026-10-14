"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { SendHorizontal, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { askBuilderAction, type AiResult } from "@/app/actions/ai";
import { Button, Textarea, Spinner } from "@/components/ui";
import { Icon } from "@/components/icon-registry";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Explain closures like I am a total beginner.",
  "Give me a 20-minute practice plan for today.",
  "Mock interview: ask me a JavaScript question.",
  "Why might my CSS grid not center anything?",
];

export function Chat({ userName }: { userName: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hey ${userName} 👋 I am Builder AI. Ask me anything about the lessons, project ideas, debugging, or interview prep.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setError(null);
    setMessages((current) => [...current, { role: "user", content: trimmed }]);
    setInput("");
    startTransition(async () => {
      const result: AiResult = await askBuilderAction(trimmed);
      if (result.ok) {
        setMessages((current) => [...current, { role: "assistant", content: result.reply }]);
      } else if ("unavailable" in result) {
        setUnavailable(true);
        setError(
          "Builder AI is not configured in this environment. Ask your site owner to set AI_API_KEY (and optionally AI_BASE_URL, AI_MODEL) in .env.local.",
        );
      } else {
        setError(result.error);
        setMessages((current) => [...current, { role: "assistant", content: "Something went wrong — please try again." }]);
      }
    });
  }

  return (
    <section className="bv-card flex min-h-[28rem] flex-col overflow-hidden p-0">
      {/* messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-5 py-5"
        role="log"
        aria-live="polite"
        aria-label="Chat with Builder AI"
        style={{ maxHeight: "46vh" }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={clsx(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {message.role === "assistant" && (
              <span
                className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand ring-1 ring-line"
                aria-hidden
              >
                <Sparkles size={15} />
              </span>
            )}
            <div
              className={clsx(
                "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
                message.role === "user"
                  ? "bg-brand-soft text-ink"
                  : "bg-surface-2 text-ink-soft",
              )}
            >
              {message.content}
            </div>
          </div>
        ))}

        {pending && (
          <div className="flex items-center gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
              <Sparkles size={15} />
            </span>
            <span className="flex items-center gap-2 rounded-2xl bg-surface-2 px-4 py-3 text-sm text-muted">
              <Spinner className="!text-brand" /> Thinking…
            </span>
          </div>
        )}

        {!pending && messages.length === 1 && !unavailable && (
          <div className="space-y-2 pt-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Try one of these
            </p>
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => send(suggestion)}
                className="block rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 text-left text-sm text-ink-soft transition hover:border-brand/40 hover:text-ink"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* input */}
      <form
        className="border-t border-line bg-surface p-4"
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
      >
        {error && (
          <p role="alert" className="mb-3 rounded-xl bg-warning-soft px-4 py-2.5 text-xs font-medium text-warning">
            {error}
          </p>
        )}
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            placeholder="Ask Builder AI anything…"
            aria-label="Message Builder AI"
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
          />
          <Button
            type="submit"
            disabled={pending || !input.trim()}
            aria-label="Send message"
            className="!px-4"
          >
            <SendHorizontal size={17} />
          </Button>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[0.7rem] text-muted">
          <Icon name="shield" size={12} /> Builder AI can make mistakes. Verify important code
          before shipping.
        </p>
      </form>
    </section>
  );
}