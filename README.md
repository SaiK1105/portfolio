# saik.co.in — Agent-OS Portfolio

Personal portfolio of **S Sai Kumar**, built as a tiny operating system for
an AI agent. Live at **[saik.co.in](https://saik.co.in)**.

## The interesting part: a real agent harness

The hero terminal isn't a chat widget — it's a multi-provider,
tool-calling agent loop running in a Cloudflare Pages Function
([`functions/api/chat.ts`](functions/api/chat.ts)):

- **Harness loop** — up to two tool rounds + a final answer. The model
  calls a server-executed `read_case_study` tool, the document feeds back
  as an OpenAI-protocol `tool` message, and the next round answers
  grounded in it. Repeat-read dedupe stops tool spin.
- **Client-executed tools** — `navigate` / `open_case_study` /
  `open_resume` are validated server-side (enum whitelists), forwarded as
  actions, and re-validated in the browser before execution.
- **Provider chain** — NVIDIA NIM → Kimi (Cast AI) → Workers AI safety
  net, with retry-on-5xx, a hard request deadline, and keyword-RAG
  grounding on the degraded path so no provider can hallucinate project
  facts.
- **Prompt-injection defense** — instruction hierarchy, delimited visitor
  input, role-injection pre-filter, in-character deflection.
- **Visible traces** — tool calls render in the terminal
  (`● read_case_study(argus-v)` … `└ done`), Claude-Code style.

## Stack

Next.js (App Router, static export) · Tailwind v4 · Framer Motion ·
Cloudflare Pages + Functions · Bun

## OS shell

Boot sequence, menubar with live clock + light/dark themes, dock,
window-chrome sections (`flagship.exe`, `research.ipynb`,
`daemon.service`, htop-style skills, `education.log`), a kernel-panic
404 — and SK-01, the resident pet that watches your cursor and minimizes
the terminal into itself.

## Develop

```bash
bun install
bun run dev        # local dev
bun run build      # static export to out/
```

API keys (`NVIDIA_API_KEY`, `KIMI_API_KEY`) live as Cloudflare Pages
secrets — nothing sensitive is in this repo.
