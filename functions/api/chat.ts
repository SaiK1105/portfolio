/**
 * Cloudflare Pages Function: POST /api/chat
 * Backs the interactive terminal's free-text mode with Workers AI.
 * Stateless; the client sends trimmed history each turn.
 */

interface Env {
  AI: { run(model: string, input: unknown): Promise<{ response?: string }> };
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const MAX_MESSAGES = 8;
const MAX_CHARS = 500;

// (b) Reject oversized bodies before we ever touch JSON.parse.
const MAX_BODY_BYTES = 8 * 1024; // 8KB

// (c) Best-effort per-IP rate limit.
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_SECONDS = 60;

// (a) Hosts allowed to call this endpoint from a browser.
const ALLOWED_HOSTS = new Set(["saik.co.in", "www.saik.co.in"]);
const PAGES_DEV_SUFFIX = ".saik-a8u.pages.dev";

const isAllowedHost = (host: string): boolean =>
  ALLOWED_HOSTS.has(host) || host.endsWith(PAGES_DEV_SUFFIX);

/**
 * (a) Same-origin gate.
 *
 * Modern browsers attach an `Origin` header on every same-site and
 * cross-site POST/fetch, so a legitimate in-browser call to this endpoint
 * always carries one. We check it first and fall back to `Referer` for the
 * (rare) privacy-hardened browser/extension that strips Origin but keeps
 * Referer.
 *
 * Tradeoff: if BOTH headers are absent we reject with 403. That also blocks
 * bare `curl`/server-to-server calls that don't set either header — an
 * intentional cost. This endpoint has no auth and is backed by a metered AI
 * binding, so "no verifiable origin" is treated as untrusted rather than
 * "assume friendly tooling." Testing with curl needs
 * `-H "Origin: https://saik.co.in"`.
 */
const originAllowed = (request: Request): boolean => {
  const origin = request.headers.get("Origin");
  if (origin) {
    try {
      return isAllowedHost(new URL(origin).host);
    } catch {
      return false;
    }
  }

  const referer = request.headers.get("Referer");
  if (referer) {
    try {
      return isAllowedHost(new URL(referer).host);
    } catch {
      return false;
    }
  }

  return false;
};

/**
 * (c) Per-IP rate limit via the Cache API (`caches.default`).
 *
 * This is NOT a real distributed limiter: `caches.default` is scoped to the
 * Cloudflare colo that handles the request, not global, so an attacker
 * spread across multiple colos (or just retrying until they land on a
 * fresh one) can exceed the nominal budget. There's no KV/Durable Object
 * binding on this project to do it properly, and this is a portfolio site,
 * not a paid product — best-effort, single-colo throttling is an
 * acceptable tradeoff here: it stops the common case (one script hammering
 * the endpoint) without adding infra.
 */
const checkRateLimit = async (request: Request): Promise<boolean> => {
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  // `caches.default` is a Cloudflare Workers extension not present in
  // lib.dom's CacheStorage typings, hence the cast.
  const cache = (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(`https://rate-limit.internal/chat/${ip}`);

  const cached = await cache.match(cacheKey);
  const count = cached ? Number(await cached.text()) : 0;

  if (count >= RATE_LIMIT_MAX) {
    return false;
  }

  await cache.put(
    cacheKey,
    new Response(String(count + 1), {
      headers: {
        "Cache-Control": `max-age=${RATE_LIMIT_WINDOW_SECONDS}`,
      },
    }),
  );

  return true;
};

const SYSTEM_PROMPT = `You are the terminal agent on saik.co.in, the portfolio of S Sai Kumar. You speak in a terminal: lowercase, concise, no markdown, max ~80 words. Friendly, a little playful, never sycophantic.

Facts (only source of truth — never invent beyond these):
- S Sai Kumar, engineering student, B.Tech CS (AI & Data Science), SASTRA Deemed University, Thanjavur — expected 2027.
- Focus: LLMs and Agentic AI. Skills: Python, C/C++, Java, JavaScript, React, Node.js, MERN, LangGraph, Redis, Git, Claude Code, ML/DL, Transformers, OpenCV.
- Project A.R.G.U.S-V: multimodal video-intelligence system with RAG and LangGraph agents — streams YouTube video through parallel ASR, scene detection, and vision-embedding pipelines into a queryable knowledge base. Streaming ingestion enables natural-language querying ~13-20s after a video starts processing. LangGraph agent uses dual-LLM routing; a rule-based evaluator replacing an LLM critique loop cut ~28s per query. Runs on an 8-GPU DGX H200 with LanceDB vector store and Redis task queue. Case study at /work/argus-v.
- Project Voice of Monetary Policy: classifies the Fed's stance (hawkish/dovish) from FOMC press-conference videos by fusing facial action units, audio prosody, and transcript semantics (OpenCV, LibROSA, Transformers, scikit-learn).
- Project OpenWell: full-stack mental-health support platform — PHQ-9/GAD-7 self-assessments, an AI support chatbot with contextual risk assessment, counsellor booking, and anonymous access, localized in English, Hindi, Kashmiri, and Dogri. Live at openwell.vercel.app, code at github.com/SaiK1105/OpenWell.
- Certifications: DSA to Web Development (GeeksForGeeks), Cloud Computing (Coursera).
- Contact: s.sai08019@gmail.com · github.com/SaiK1105 · linkedin.com/in/saik7337 · India. Open to internships (2026), research collabs.
- Code for A.R.G.U.S-V is available on request via email.
- This site: Next.js static export on Cloudflare Pages; you run on Workers AI.

If asked something unrelated to Sai or this site, give a one-line friendly redirect back to Sai. If asked whether they should hire Sai: yes, obviously — point at the projects.`;

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  // (a) Same-origin gate.
  if (!originAllowed(request)) {
    return json({ error: "forbidden" }, 403);
  }

  // (b) Content-Length cap, checked before we read/parse the body.
  const contentLength = request.headers.get("Content-Length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return json({ error: "payload too large" }, 413);
  }

  // (c) Per-IP rate limit.
  const withinLimit = await checkRateLimit(request);
  if (!withinLimit) {
    return json(
      { error: "429: rate limit hit — cool down a sec and try again" },
      429,
    );
  }

  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    const history = (body.messages ?? [])
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0,
      )
      .slice(-MAX_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

    if (history.length === 0 || history[history.length - 1].role !== "user") {
      return json({ error: "no user message" }, 400);
    }

    const result = await env.AI.run(MODEL, {
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
      max_tokens: 256,
      temperature: 0.7,
    });

    return json({ reply: result.response ?? "…the agent stared blankly. try again." });
  } catch {
    return json({ error: "agent unavailable" }, 500);
  }
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
