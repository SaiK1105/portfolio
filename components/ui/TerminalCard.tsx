"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { about, hero, projects, skills } from "@/lib/content";
import { site } from "@/lib/site";
import { VIEWPORT_ONCE } from "@/lib/motion";

const CHAR_DELAY_MS = 30;
const LINE_PAUSE_MS = 350;

const HINT_LINE = "type 'help' or ask me anything";
const PROMPT = "sai@agent:~$ ";
const MAX_INPUT_LENGTH = 500;
const MAX_HISTORY_TURNS = 8;
const REQUEST_TIMEOUT_MS = 15_000;

/** Day-flavored line above the hint, keyed by Date#getDay() (0 = Sunday). */
const DAY_GREETINGS: Record<number, string> = {
  0: "sunday: existential refactoring",
  1: "monday: compiling motivation…",
  2: "tuesday: cache warm, brain cold",
  3: "wednesday: reality.exe still responding",
  4: "thursday: nearly there, allegedly",
  5: "friday: shipping before the weekend",
  6: "saturday: running in maintenance mode",
};

type ConversationMessage = { role: "user" | "assistant"; content: string };

type Entry =
  | { kind: "echo"; text: string }
  | { kind: "output"; text: string; tone?: "muted" }
  | { kind: "thinking" };

function helpLines(): string[] {
  return [
    "help      - list commands",
    "whoami    - about sai",
    "projects  - featured work",
    "skills    - tech stack",
    "resume    - open resume.pdf",
    "contact   - email + github",
    "clear     - clear the screen",
    "or just ask a question",
  ];
}

function whoamiLines(): string[] {
  const tagline = hero.tagline.replace(/[{}]/g, "");
  return [`${site.shortName} — ${hero.kicker}. ${tagline}`];
}

function projectLines(): string[] {
  return projects.items.map((p) => `${p.name} — ${p.title}`);
}

function skillLines(): string[] {
  return skills.groups.map((g) => `${g.title}: ${g.items.join(", ")}`);
}

/** Drop any pending "thinking…" entry and append the real result in its place. */
function replaceThinking(history: Entry[], replacement: Entry): Entry[] {
  return [...history.filter((e) => e.kind !== "thinking"), replacement];
}

/** Blinking block cursor — hard on/off, no fade, like a real terminal caret. */
function Cursor() {
  return (
    <motion.span
      aria-hidden="true"
      className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-accent align-middle"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
    />
  );
}

/**
 * TerminalCard — the site's signature element. A minimal terminal window
 * that types out `about.terminalLines` one character at a time once it
 * scrolls into view, then hands control to the visitor: local commands
 * resolve instantly; anything else is forwarded to /api/chat.
 * Respects prefers-reduced-motion by rendering the intro instantly.
 */
export function TerminalCard({ className = "" }: { className?: string } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInView = useInView(ref, { once: VIEWPORT_ONCE.once, margin: VIEWPORT_ONCE.margin });
  const prefersReducedMotion = useReducedMotion();

  const lines = about.terminalLines;
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const skipTyping = Boolean(prefersReducedMotion);
  const introDone = skipTyping || lineIndex >= lines.length;

  const [history, setHistory] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const conversationRef = useRef<ConversationMessage[]>([]);
  const [dayLine, setDayLine] = useState<string | null>(null);

  // Computed client-side only — the day depends on the visitor's clock,
  // so resolving it during SSR would risk a hydration mismatch.
  useEffect(() => {
    setDayLine(DAY_GREETINGS[new Date().getDay()] ?? null);
  }, []);

  useEffect(() => {
    if (!isInView || skipTyping) return;
    if (lineIndex >= lines.length) return;

    const currentLine = lines[lineIndex];

    if (charIndex < currentLine.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), CHAR_DELAY_MS);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setLineIndex((l) => l + 1);
      setCharIndex(0);
    }, LINE_PAUSE_MS);
    return () => clearTimeout(t);
  }, [isInView, skipTyping, lineIndex, charIndex, lines]);

  useEffect(() => {
    if (!introDone) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [introDone, history]);

  function pushEntries(entries: Entry[]) {
    setHistory((h) => [...h, ...entries]);
  }

  async function runFreeText(raw: string) {
    setIsLoading(true);
    pushEntries([{ kind: "thinking" }]);

    const nextMessages = [...conversationRef.current, { role: "user" as const, content: raw }].slice(
      -MAX_HISTORY_TURNS,
    );
    conversationRef.current = nextMessages;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = (await res.json()) as { reply?: string; error?: string };
      if (typeof data.reply !== "string") throw new Error("malformed response");

      conversationRef.current = [
        ...nextMessages,
        { role: "assistant" as const, content: data.reply },
      ].slice(-MAX_HISTORY_TURNS);
      setHistory((h) => replaceThinking(h, { kind: "output", text: data.reply as string }));
    } catch {
      setHistory((h) =>
        replaceThinking(h, {
          kind: "output",
          text: "agent offline — try 'help' for local commands",
          tone: "muted",
        }),
      );
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }

  async function runCommand(raw: string) {
    const normalized = raw.trim().toLowerCase().replace(/\s+/g, " ");

    if (normalized === "clear") {
      setHistory([]);
      return;
    }

    pushEntries([{ kind: "echo", text: raw }]);

    switch (normalized) {
      case "help":
        pushEntries(helpLines().map((text) => ({ kind: "output", text })));
        return;
      case "whoami":
        pushEntries(whoamiLines().map((text) => ({ kind: "output", text })));
        return;
      case "projects":
        pushEntries(projectLines().map((text) => ({ kind: "output", text })));
        return;
      case "skills":
        pushEntries(skillLines().map((text) => ({ kind: "output", text })));
        return;
      case "resume":
        pushEntries([{ kind: "output", text: "opening resume.pdf …" }]);
        window.open("/resume.pdf", "_blank");
        return;
      case "contact":
        pushEntries([{ kind: "output", text: `${site.email} · ${site.github}` }]);
        return;
      case "sudo hire-me":
        pushEntries([
          { kind: "output", text: `permission granted. forwarding to ${site.email} …` },
        ]);
        window.location.href = `mailto:${site.email}`;
        return;
      default:
        await runFreeText(raw);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) return;
    const raw = input.trim();
    if (!raw) return;
    setInput("");
    void runCommand(raw);
  }

  function focusInput() {
    inputRef.current?.focus();
  }

  return (
    <div
      ref={ref}
      className={`card-surface flex flex-col overflow-hidden rounded-2xl ${className}`}
      onClick={focusInput}
    >
      {/* Header row */}
      <div className="flex shrink-0 items-center gap-2 border-b border-white/6 px-5 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="ml-2 font-mono text-xs text-muted">sai@agent — zsh</span>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1 flex-col px-5 py-6 font-mono text-sm leading-relaxed">
        {/* Accessible full-text fallback; visual typing below is decorative. */}
        <p className="sr-only">{lines.join(". ")}</p>

        <div aria-hidden="true" className="shrink-0">
          {lines.map((line, i) => {
            const isLast = i === lines.length - 1;
            const colorClass = isLast ? "text-status-present" : "text-accent/90";

            if (skipTyping || i < lineIndex) {
              return (
                <div key={line} className={colorClass}>
                  {line}
                </div>
              );
            }

            if (i === lineIndex) {
              return (
                <div key={line} className={colorClass}>
                  {line.slice(0, charIndex)}
                  <Cursor />
                </div>
              );
            }

            return null;
          })}
        </div>

        {/*
          The scrollback + prompt row mounts immediately (not gated on
          introDone) so visitors see from second one that this terminal
          takes input — it's just dimmed and disabled until the intro
          finishes typing.
        */}
        <div
          ref={scrollRef}
          className="mt-4 min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain"
        >
          {introDone && (
            <>
              {dayLine && <div className="text-muted">{dayLine}</div>}
              <div className="text-accent/90">{HINT_LINE}</div>

              {history.map((entry, i) => {
                if (entry.kind === "thinking") {
                  return (
                    <div key={i} className="text-muted">
                      thinking<span className="animate-pulse">…</span>
                    </div>
                  );
                }
                if (entry.kind === "echo") {
                  return (
                    <div key={i} className="text-accent/90">
                      <span className="text-accent-1">{PROMPT}</span>
                      {entry.text}
                    </div>
                  );
                }
                return (
                  <div
                    key={i}
                    className={`whitespace-pre-wrap ${entry.tone === "muted" ? "text-muted" : "text-accent/90"}`}
                  >
                    {entry.text}
                  </div>
                );
              })}
            </>
          )}

          <form
            onSubmit={handleSubmit}
            className={`flex items-baseline text-accent/90 transition-opacity duration-300 ease-[var(--ease-signature)] ${
              introDone ? "opacity-100" : "opacity-50"
            }`}
          >
            <span className="shrink-0 text-accent-1">{PROMPT}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              disabled={isLoading || !introDone}
              maxLength={MAX_INPUT_LENGTH}
              aria-label="terminal input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="min-w-0 flex-1 border-0 bg-transparent font-mono text-accent/90 caret-accent outline-none"
            />
            {!input && !inputFocused && <Cursor />}
          </form>
        </div>
      </div>
    </div>
  );
}
