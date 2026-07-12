"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { about, hero, projects, skills } from "@/lib/content";
import { site } from "@/lib/site";
import { VIEWPORT_ONCE } from "@/lib/motion";
import { Window } from "@/components/os/Window";

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

// Mirrors the tool contract in functions/api/chat.ts. The server already
// validates tool name + enum args before sending an action down, but we
// re-validate here too (defense in depth) rather than trust the wire.
type ToolAction = { tool: string; args: Record<string, unknown> };

const SECTION_VALUES = new Set([
  "home",
  "projects",
  "skills",
  "github",
  "education",
  "contact",
]);
const PROJECT_VALUES = new Set(["argus-v", "vomp"]);

/** Validate + describe an action as a subtle confirmation line, or null if it doesn't check out. */
function describeAction(action: ToolAction): string | null {
  switch (action.tool) {
    case "navigate": {
      const section = action.args.section;
      if (typeof section !== "string" || !SECTION_VALUES.has(section)) return null;
      return `→ scrolling to ${section}`;
    }
    case "open_case_study": {
      const project = action.args.project;
      if (typeof project !== "string" || !PROJECT_VALUES.has(project)) return null;
      return `→ opening ${project} case study`;
    }
    case "open_resume":
      return "→ opening resume";
    default:
      return null;
  }
}

/** Run the browser side-effect for an already-validated action. */
function executeAction(action: ToolAction, reducedMotion: boolean) {
  switch (action.tool) {
    case "navigate": {
      const section = action.args.section as string;
      document
        .getElementById(section)
        ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      return;
    }
    case "open_case_study": {
      const project = action.args.project as string;
      const slug = project === "vomp" ? "vomp" : "argus-v";
      window.open(`/work/${slug}/`, "_self");
      return;
    }
    case "open_resume":
      window.open("/resume.pdf", "_blank");
      return;
    default:
      return;
  }
}

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

/**
 * Blinking block cursor — hard on/off, no fade, like a real terminal caret.
 * Framer Motion's WAAPI-driven loop isn't reachable by the global CSS
 * prefers-reduced-motion block, so it renders as a static (non-animating)
 * caret when `reducedMotion` is set instead.
 */
function Cursor({ reducedMotion }: { reducedMotion: boolean }) {
  if (reducedMotion) {
    return (
      <span
        aria-hidden="true"
        className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-amber align-middle"
      />
    );
  }
  return (
    <motion.span
      aria-hidden="true"
      className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-amber align-middle"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
    />
  );
}

/**
 * TerminalCard — the site's signature element, reskinned as an OS window:
 * "sai@agent: ~/terminal — zsh". Types out `about.terminalLines` one
 * character at a time once it scrolls into view, then hands control to the
 * visitor: local commands resolve instantly; anything else is forwarded to
 * /api/chat. Respects prefers-reduced-motion by rendering the intro
 * instantly and killing the blinking caret.
 */
export function TerminalCard({ className = "" }: { className?: string } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInView = useInView(ref, { once: VIEWPORT_ONCE.once, margin: VIEWPORT_ONCE.margin });
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);

  const lines = about.terminalLines;
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const skipTyping = reducedMotion;
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
      if (res.status === 429) {
        let retryAfterSeconds: number | undefined;
        try {
          const data = (await res.json()) as { retryAfterSeconds?: number };
          retryAfterSeconds = data.retryAfterSeconds;
        } catch {
          // malformed/empty body — fall back to the generic cooldown line below
        }
        const cooldown =
          typeof retryAfterSeconds === "number" && retryAfterSeconds > 0
            ? `catching my breath — try again in ${retryAfterSeconds}s`
            : "catching my breath — try again in a few seconds";
        setHistory((h) =>
          replaceThinking(h, { kind: "output", text: cooldown, tone: "muted" }),
        );
        return;
      }

      if (res.status === 403) {
        setHistory((h) =>
          replaceThinking(h, {
            kind: "output",
            text: "connection blocked — refresh the page, or try 'help' for local commands",
            tone: "muted",
          }),
        );
        return;
      }

      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = (await res.json()) as {
        reply?: string;
        error?: string;
        actions?: ToolAction[];
      };
      if (typeof data.reply !== "string") throw new Error("malformed response");

      conversationRef.current = [
        ...nextMessages,
        { role: "assistant" as const, content: data.reply },
      ].slice(-MAX_HISTORY_TURNS);
      setHistory((h) => replaceThinking(h, { kind: "output", text: data.reply as string }));

      // Client-executed tools: print the reply first, then run each
      // validated action (scroll / open case study / open resume) and
      // echo a subtle confirmation line for it.
      if (Array.isArray(data.actions)) {
        for (const action of data.actions) {
          const description = describeAction(action);
          if (!description) continue;
          pushEntries([{ kind: "output", text: description, tone: "muted" }]);
          executeAction(action, reducedMotion);
        }
      }
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
    <div ref={ref}>
      <Window
        title="sai@agent: ~/terminal — zsh"
        aria-label="Live agent terminal"
        className={className}
      >
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- clicking anywhere in the terminal body focuses the real input below; the input itself carries the interactive semantics. */}
        <div
          onClick={focusInput}
          className="flex flex-col px-5 pb-5 pt-[18px]"
        >
          {/* Accessible full-text fallback; visual typing below is decorative. */}
          <p className="visually-hidden">{lines.join(". ")}</p>

          <div aria-hidden="true" className="shrink-0">
            {lines.map((line, i) => {
              const isLast = i === lines.length - 1;
              const colorClass = isLast ? "text-green" : "text-green/90";

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
                    <Cursor reducedMotion={reducedMotion} />
                  </div>
                );
              }

              return null;
            })}
          </div>

          {/*
            The scrollback + prompt row mounts immediately (not gated on
            introDone) so visitors see from second one that this terminal
            takes input — it's just dimmed (but keyboard-focusable) until the intro
            finishes typing. Capped height keeps the window a predictable
            size no matter how long the conversation runs.
          */}
          <div
            ref={scrollRef}
            className="mt-3 max-h-[210px] space-y-1.5 overflow-y-auto overscroll-contain sm:max-h-[260px]"
          >
            {introDone && (
              <>
                {dayLine && <div className="text-muted">{dayLine}</div>}
                <div className="text-green/90">{HINT_LINE}</div>

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
                      <div key={i} className="text-text">
                        <span className="mr-1.5 text-green">{PROMPT}</span>
                        {entry.text}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={i}
                      className={`whitespace-pre-wrap ${
                        entry.tone === "muted" ? "text-muted" : "text-green/90"
                      }`}
                    >
                      {entry.text}
                    </div>
                  );
                })}
              </>
            )}

            <form
              onSubmit={handleSubmit}
              className={`flex items-baseline transition-opacity duration-300 ease-[var(--ease-signature)] ${
                introDone ? "opacity-100" : "opacity-50"
              }`}
            >
              <span className="mr-1.5 shrink-0 text-green">{PROMPT}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                disabled={isLoading}
                maxLength={MAX_INPUT_LENGTH}
                aria-label="terminal input"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="ask the agent something…"
                className="min-w-0 flex-1 border-0 bg-transparent text-text caret-amber outline-none placeholder:text-muted/70"
              />
              {!input && !inputFocused && <Cursor reducedMotion={reducedMotion} />}
            </form>
          </div>
        </div>
      </Window>
    </div>
  );
}
