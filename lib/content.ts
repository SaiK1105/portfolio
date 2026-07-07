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

export const projects = {
  heading: "Projects",
  sub: "Selected work. Code available on request.",
  items: [
    {
      number: "01",
      kicker: "FEATURED",
      name: "A.R.G.U.S-V",
      title: "Video intelligence framework for YouTube",
      description:
        "End-to-end framework for intelligent analysis of YouTube content using LLMs and multimodal learning — ingestion, transcription, summarization, and semantic search that cuts manual review time.",
      highlights: [
        "LangGraph-orchestrated agent workflows for the analysis pipeline",
        "Redis caching for high-performance reuse of processed data",
        "Semantic search over transcribed and summarized video content",
      ],
      tech: ["Python", "LLMs", "LangGraph", "Redis"],
    },
    {
      number: "02",
      kicker: "RESEARCH",
      name: "Voice of Monetary Policy",
      title: "Multimodal analysis of FOMC meetings",
      description:
        "Research project classifying the Federal Reserve's policy stance (hawkish/dovish) from press-conference videos by fusing facial action units, audio prosody, and transcript semantics.",
      highlights: [
        "Three-modality fusion: computer vision, audio processing, and NLP",
        "Feature-extraction pipelines feeding trained ML classifiers",
        "Robust stance classification across meetings",
      ],
      tech: ["Python", "OpenCV", "LibROSA", "Transformers", "scikit-learn"],
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
