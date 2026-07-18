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
// The server's harness loop can make two 12s provider calls back to back
// (tool round + grounded answer), so the client waits out the worst case.
const REQUEST_TIMEOUT_MS = 30_000;
// Read only inside the "status" handler, never rendered during the
// static/SSR pass, so a module-scope Date.now() here can't hydration-mismatch.
const PAGE_LOAD = Date.now();

const THINKING_VERBS = [
  "thinking",
  "grepping",
  "pondering",
  "reticulating",
  "inferring",
  "brewing",
  "cerebrating",
  "vibing",
];

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
  | { kind: "thinking" }
  | { kind: "tool"; text: string };

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

/** Validate an action and describe it as bare call syntax (rendered as a ⏺/⎿ tool line), or null if it doesn't check out. */
function describeAction(action: ToolAction): string | null {
  switch (action.tool) {
    case "navigate": {
      const section = action.args.section;
      if (typeof section !== "string" || !SECTION_VALUES.has(section)) return null;
      return `navigate(${section})`;
    }
    case "open_case_study": {
      const project = action.args.project;
      if (typeof project !== "string" || !PROJECT_VALUES.has(project)) return null;
      return `open_case_study(${project})`;
    }
    case "open_resume":
      return "open_resume()";
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
    "status    - system status",
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

/** Drop any pending "thinking…" entry and append the real result(s) in its place. */
function replaceThinking(history: Entry[], ...replacements: Entry[]): Entry[] {
  return [...history.filter((e) => e.kind !== "thinking"), ...replacements];
}

/**
 * Validate the server's tool trace (lines like "read_case_study(argus-v)")
 * before rendering — array of short strings only, capped, else dropped.
 */
function sanitizeTrace(trace: unknown): string[] {
  if (!Array.isArray(trace)) return [];
  return trace
    .filter((t): t is string => typeof t === "string" && t.length > 0 && t.length <= 80)
    .slice(0, 4);
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
 * Claude-Code-style "thinking" line: cycles a verb + elapsed seconds while
 * a request is in flight. Reduced motion gets a static line, no intervals.
 */
function ThinkingLine() {
  const reducedMotion = useReducedMotion();
  const [verbIdx, setVerbIdx] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const start = Date.now();
    // 600ms tick with verb derived from elapsed time: seconds never skip
    // a number while verbs still rotate at a calm ~1.2s cadence.
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      setVerbIdx(Math.floor(elapsed / 1200) % THINKING_VERBS.length);
      setSeconds(Math.floor(elapsed / 1000));
    }, 600);
    return () => clearInterval(id);
  }, [reducedMotion]);

  if (reducedMotion) {
    return <div className="text-muted">✻ thinking…</div>;
  }

  return (
    <div>
      <span className="text-amber animate-pulse">✻</span> {THINKING_VERBS[verbIdx]}…{" "}
      <span className="text-muted">({seconds}s)</span>
    </div>
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
export function TerminalCard({
  className = "",
  onBusyChange,
}: { className?: string; onBusyChange?: (busy: boolean) => void } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInView = useInView(ref, { once: VIEWPORT_ONCE.once, margin: VIEWPORT_ONCE.margin });
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);

  const lines = about.terminalLines;
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // useReducedMotion is false during SSR but true on a reduce-user's first
  // client render — branching markup on it directly is a hydration mismatch
  // (React #418). Gate it behind mount so the first client render always
  // matches the server; reduce users see the full intro one frame later.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const skipTyping = mounted && reducedMotion;
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
    onBusyChange?.(true);
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
        trace?: unknown;
      };
      if (typeof data.reply !== "string") throw new Error("malformed response");

      conversationRef.current = [
        ...nextMessages,
        { role: "assistant" as const, content: data.reply },
      ].slice(-MAX_HISTORY_TURNS);

      // Tool trace first (Claude-Code-style ⏺/⎿ tool lines — the agent's
      // server-side work made visible), then the reply itself.
      const traceEntries: Entry[] = sanitizeTrace(data.trace).map((t) => ({
        kind: "tool",
        text: t,
      }));
      setHistory((h) =>
        replaceThinking(h, ...traceEntries, { kind: "output", text: data.reply as string }),
      );

      // Client-executed tools: print the reply first, then run each
      // validated action (scroll / open case study / open resume) and
      // echo a tool line for it (same ⏺/⎿ styling as the server trace).
      if (Array.isArray(data.actions)) {
        for (const action of data.actions) {
          const description = describeAction(action);
          if (!description) continue;
          pushEntries([{ kind: "tool", text: description }]);
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
      onBusyChange?.(false);
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
      case "status": {
        const uptimeSeconds = Math.floor((Date.now() - PAGE_LOAD) / 1000);
        // +1 counts the status command itself — the echo above went through
        // a functional setState, so `history` here is still the prior render.
        const messageCount = history.filter((e) => e.kind === "echo").length + 1;
        pushEntries(
          [
            "sai-os v1.0 — system status",
            `uptime: ${Math.floor(uptimeSeconds / 60)}m${uptimeSeconds % 60}s`,
            `messages this session: ${messageCount}`,
            "providers: nvidia → kimi → workers-ai",
            "all systems operational",
          ].map((text) => ({ kind: "output" as const, text })),
        );
        return;
      }
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
                    return <ThinkingLine key={i} />;
                  }
                  if (entry.kind === "echo") {
                    return (
                      <div key={i} className="text-text">
                        <span className="mr-1.5 text-green">{PROMPT}</span>
                        {entry.text}
                      </div>
                    );
                  }
                  // ● and └ instead of Claude Code's ⏺/⎿ — next/font serves a
                  // latin-subset IBM Plex Mono, so rarer glyphs tofu on machines
                  // whose fallback fonts lack them. These two are universal.
                  if (entry.kind === "tool") {
                    return (
                      <div key={i}>
                        <div className="text-text">
                          <span className="text-green">● </span>
                          {entry.text}
                        </div>
                        <div className="pl-5 text-muted">└ done</div>
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
