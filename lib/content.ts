/**
 * Single source of truth for all site copy and data.
 * Derived from S_Sai_Kumar_Resume_Fixed.docx — do not invent facts.
 */

export const hero = {
  kicker: "LLM & Agentic AI",
  // Rendered as a giant fluid wordmark, one word per line on mobile.
  wordmark: "SAI KUMAR",
  // Serif-italic fragments are marked with {braces} and rendered in
  // Instrument Serif italic as two-tone accent text.
  tagline: "Engineering student building {intelligent systems} with LLMs, agents, and full-stack craft.",
  ctas: [
    { label: "View work", href: "#projects" },
    { label: "Resume", href: "/resume.pdf" },
  ],
} as const;

export const about = {
  heading: "About",
  // Word-level scroll reveal paragraph (manifesto).
  manifesto:
    "I build AI systems end to end — from multimodal pipelines that watch, listen, and read, to agent workflows that reason and act. Grounded in full-stack fundamentals, aimed at the frontier of LLMs and Agentic AI.",
  terminalLines: [
    "> ingesting video · audio · transcript streams",
    "> orchestrating LangGraph agent workflows",
    "> caching hot paths with Redis",
    "> classifying policy stance across 3 modalities",
    "> status: available for internships 2026",
  ],
} as const;

export const skills = {
  heading: "Skills",
  sub: "What I work with.",
  groups: [
    { title: "Languages", items: ["Python", "C/C++", "Java", "JavaScript"] },
    {
      title: "AI & ML",
      items: [
        "LLMs",
        "Agentic AI",
        "LangGraph",
        "Machine Learning",
        "Deep Learning",
        "Transformers",
        "OpenCV",
      ],
    },
    {
      title: "Web & Tools",
      items: ["React", "Node.js", "MERN stack", "Redis", "Git", "Claude Code", "HTML/CSS"],
    },
  ],
} as const;

export type ProjectLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const projects = {
  heading: "Projects",
  sub: "Selected work. A.R.G.U.S-V code available on request.",
  items: [
    {
      number: "01",
      kicker: "FEATURED",
      name: "A.R.G.U.S-V",
      title: "Video intelligence framework for YouTube",
      description:
        "Multimodal video-intelligence system with RAG and LangGraph agents — streams YouTube video through parallel ASR, scene detection, and vision-embedding pipelines into a queryable knowledge base.",
      highlights: [
        "Streaming ingestion unlocks natural-language querying ~13–20s after a video starts processing, instead of minutes",
        "LangGraph agent with dual-LLM routing; replacing an LLM critique loop with rule-based evaluation cut ~28s per query",
        "8-GPU pipeline on DGX H200: FastAPI ASR + vision microservices, Redis task queue, LanceDB vector store",
      ],
      tech: ["Python", "LangGraph", "vLLM", "Whisper/Canary ASR", "Qwen3-VL", "LanceDB", "Redis", "FastAPI"],
      links: [
        { label: "Read the case study", href: "/work/argus-v/", external: false },
      ] satisfies ProjectLink[],
    },
    {
      number: "02",
      kicker: "RESEARCH",
      name: "Voice of Monetary Policy",
      title: "Multimodal analysis of FOMC meetings",
      description:
        "Replication of Gorodnichenko, Pham & Talavera (2023): does the Fed's tone of voice move markets independently of its words? Fuses vocal prosody (speech-emotion recognition) with BERT text sentiment across 792 FOMC segments, evaluated with bootstrap OLS on 22 financial instruments.",
      highlights: [
        "Two-modality fusion: vocal prosody (speech emotion) + transcript semantics (BERT)",
        "BERT hawkish/dovish classifier reaching F1 0.82",
        "Bootstrap OLS (2000 replications, BCa intervals) across ~181 meetings",
      ],
      tech: ["Python", "LibROSA", "BERT (Transformers)", "Bootstrap OLS", "pandas"],
      links: [
        { label: "Read the case study", href: "/work/vomp/", external: false },
      ] satisfies ProjectLink[],
    },
    {
      number: "03",
      kicker: "SHIPPED",
      name: "OpenWell",
      title: "Digital mental-health platform",
      description:
        "Full-stack mental-health support platform: PHQ-9/GAD-7 self-assessments, an AI support chatbot with contextual risk assessment, counsellor booking, and anonymous access — localized in English, Hindi, Kashmiri, and Dogri.",
      highlights: [
        "Supabase auth, database, realtime, and edge functions behind a React + TypeScript front end",
        "Anonymous-mode design so users can seek help without an account",
        "Four-language i18n including Kashmiri and Dogri",
      ],
      tech: ["TypeScript", "React", "Vite", "Tailwind", "shadcn/ui", "Supabase"],
      links: [
        { label: "Live demo", href: "https://openwell.vercel.app", external: true },
        { label: "GitHub", href: "https://github.com/SaiK1105/OpenWell", external: true },
      ] satisfies ProjectLink[],
    },
  ],
} as const;

export const education = {
  heading: "Education",
  items: [
    {
      status: "present" as const,
      degree: "B.Tech in Computer Science (AI & Data Science)",
      school: "SASTRA Deemed University",
      place: "Thanjavur, Tamil Nadu",
      period: "Expected 2027",
    },
    {
      status: "past" as const,
      degree: "Higher Secondary Education",
      school: "Kendriya Vidyalaya No. 1, Akhnoor",
      place: "Jammu & Kashmir",
      period: "2022",
    },
    {
      status: "past" as const,
      degree: "Secondary Education",
      school: "Kendriya Vidyalaya Hirapatti, Azamgarh",
      place: "Uttar Pradesh",
      period: "2020",
    },
  ],
  certifications: [
    "DSA to Web Development — GeeksForGeeks",
    "Cloud Computing — Coursera",
  ],
} as const;

export const github = {
  heading: "GitHub",
  sub: "Public activity",
} as const;

export const contact = {
  heading: "Contact",
  // Serif-italic fragment in {braces}.
  headline: "Let's build {something together}.",
  blurb: "Open to internships, research collaborations, and interesting agent problems.",
} as const;
