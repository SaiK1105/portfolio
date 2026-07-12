/**
 * Case study copy for /work/argus-v — A.R.G.U.S-V.
 * All facts sourced from the project's own docs. Do not invent beyond them.
 * Serif-italic accent fragments are marked with {braces}, rendered via
 * components/ui/Accent.tsx#renderAccent — same idiom as lib/content.ts.
 */

export const caseMeta = {
  title: "A.R.G.U.S-V — case study — S Sai Kumar",
  description:
    "How A.R.G.U.S-V answers natural-language questions about YouTube videos while they're still processing — a streaming ASR + vision-embedding pipeline built on LangGraph, vLLM, and a DGX H200.",
} as const;

export const hero = {
  kicker: "Case study — 2026",
  title: "A.R.G.U.S-V",
  subtitle:
    "a video intelligence system that answers questions about videos while they're still processing",
  chips: [
    "Python",
    "LangGraph",
    "vLLM",
    "Whisper/Canary ASR",
    "Qwen3-VL",
    "LanceDB",
    "Redis",
    "FastAPI",
    "DGX H200",
  ],
  meta: "built on a shared DGX H200 · 2026",
} as const;

export const problem = {
  kicker: "01 — The problem",
  title: "Watching {hours} to find one answer doesn't scale.",
  paragraph:
    "The goal: paste a YouTube URL, ask questions in natural language, and get grounded answers — without waiting for the whole video to finish processing.",
} as const;

export const system = {
  kicker: "02 — The system",
  title: "One pipeline, {eight GPUs}, no idle time.",
  intro:
    "A single video fans out into parallel download, transcription, and vision pipelines that converge into a queryable vector store — queried by an agent that routes each question to the right model.",
  steps: [
    { label: "Video URL", detail: "Pasted by the user" },
    { label: "Parallel byte-range download", detail: "Fetched in concurrent chunks", tag: "yt-dlp" },
    { label: "Chunked audio", detail: "Split for streaming ingestion" },
    {
      label: "ASR microservice",
      detail: "Canary-1B-Flash primary, faster-whisper fallback",
      tag: ":19002",
      parallel: true,
    },
    {
      label: "Scene detection + frame extraction",
      detail: "Keyframes for the visual track",
      tag: "keyframes",
      parallel: true,
    },
    {
      label: "Qwen3-VL embeddings",
      detail: "Vision microservice",
      tag: ":19003",
      parallel: true,
    },
    { label: "LanceDB vector store", detail: "13k+ rows", tag: "LanceDB" },
    {
      label: "LangGraph VideoQAAgent",
      detail: "Dual-LLM routing — reasoning model + speed model",
      tag: "dual-LLM",
    },
    { label: "Answer", detail: "Grounded in retrieved chunks" },
  ],
  note:
    "A Redis task queue coordinates persistent workers across all 8 GPUs — no per-request process spin-up.",
} as const;

export const thesis = {
  kicker: "03 — What made it fast",
  title: "The {thesis}.",
  quote: "ASR was never the bottleneck. Pipeline design was.",
  stats: [
    { value: "13–20s", label: "to first query, from ~2–3 min" },
    { value: "~30×", label: "real-time processing, sustained" },
    { value: "−28s", label: "per query, LLM critique → rules" },
  ],
  findings: [
    {
      number: "01",
      title: "Streaming ingestion",
      body: "The first audio chunk starts processing within seconds, so querying unlocks long before the video has finished.",
    },
    {
      number: "02",
      title: "Parallelism everywhere",
      body: "Scatter-gather chunking runs against hot, persistent model workers — no per-request cold starts, no idle GPUs.",
    },
    {
      number: "03",
      title: "Cheaper judgment",
      body: "A rule-based evaluator replaced an LLM critique loop, at no measurable cost to answer quality.",
    },
  ],
} as const;

export const lessons = {
  kicker: "04 — Hard-won lessons",
  title: "What broke, and what {fixed it}.",
  items: [
    {
      problem: "GPU OOM kills",
      fix: "Split ASR and vision into separate FastAPI services, each with its own GPU memory budget.",
    },
    {
      problem: "Frame I/O bottleneck",
      fix: "Extract frames to a RAM disk (/dev/shm) instead of spinning disk.",
    },
    {
      problem: "Slow queue reads",
      fix: "Batch database writes through a sink worker — 128 rows or a 2s flush, whichever comes first.",
    },
    {
      problem: "Model cold starts",
      fix: "Persistent, pre-loaded model workers instead of loading a model per task.",
    },
  ],
} as const;

export const footer = {
  kicker: "Want the details?",
  email: "s.sai08019@gmail.com",
  backLabel: "← back to projects",
  backHref: "/#projects",
} as const;
