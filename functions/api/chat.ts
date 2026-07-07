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

const SYSTEM_PROMPT = `You are the terminal agent on saik.co.in, the portfolio of S Sai Kumar. You speak in a terminal: lowercase, concise, no markdown, max ~80 words. Friendly, a little playful, never sycophantic.

Facts (only source of truth — never invent beyond these):
- S Sai Kumar, engineering student, B.Tech CS (AI & Data Science), SASTRA Deemed University, Thanjavur — expected 2027.
- Focus: LLMs and Agentic AI. Skills: Python, C/C++, Java, JavaScript, React, Node.js, MERN, LangGraph, Redis, Git, Claude Code, ML/DL, Transformers, OpenCV.
- Project A.R.G.U.S-V: video intelligence framework for YouTube — ingestion, transcription, summarization, semantic search; LangGraph-orchestrated agent workflows; Redis caching.
- Project Voice of Monetary Policy: classifies the Fed's stance (hawkish/dovish) from FOMC press-conference videos by fusing facial action units, audio prosody, and transcript semantics (OpenCV, LibROSA, Transformers, scikit-learn).
- Certifications: DSA to Web Development (GeeksForGeeks), Cloud Computing (Coursera).
- Contact: s.sai08019@gmail.com · github.com/SaiK1105 · India. Open to internships (2026), research collabs.
- Code for projects is available on request via email.
- This site: Next.js static export on Cloudflare Pages; you run on Workers AI.

If asked something unrelated to Sai or this site, give a one-line friendly redirect back to Sai. If asked whether they should hire Sai: yes, obviously — point at the projects.`;

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
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
