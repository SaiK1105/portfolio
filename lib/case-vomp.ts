/**
 * Case study copy for /work/vomp — Voice of Monetary Policy.
 * All facts sourced from MiniProjectReport_FOMC_Final.md and
 * Synopsis_MiniProject_FOMC.md (workspace/ai/FOMC/). Do not invent beyond
 * them — the project replicates Gorodnichenko, Pham & Talavera (2023) using
 * two modalities (voice + text); a visual/facial branch is explicitly
 * future work in the report, not something the pipeline implements today.
 * Serif-italic accent fragments are marked with {braces}, rendered via
 * components/ui/Accent.tsx#renderAccent — same idiom as lib/content.ts.
 */

export const caseMeta = {
  title: "Voice of Monetary Policy — case study — S Sai Kumar",
  description:
    "Does the Fed's tone of voice move markets independently of what they say? A replication of Gorodnichenko, Pham & Talavera (2023) fusing speech emotion recognition and BERT sentiment across 792 FOMC segments, evaluated with bootstrap OLS on 22 financial instruments.",
} as const;

export const hero = {
  kicker: "Case study — 2026",
  title: "Voice of Monetary Policy",
  subtitle:
    "classifying the Fed's hawkish/dovish stance from how policymakers say it, not just what they say",
  chips: [
    "Python",
    "LibROSA",
    "FFmpeg",
    "PyTorch/TensorFlow",
    "BERT (Transformers)",
    "Bootstrap OLS",
    "DGX H200",
  ],
  meta: "replicates Gorodnichenko, Pham & Talavera (2023, AER) · 792 segments / 181 FOMC meetings, 2011–2019",
} as const;

export const problem = {
  kicker: "01 — The problem",
  title: "Can you read the Fed's stance from how they {say} it?",
  paragraph:
    "Most research on FOMC press conferences treats the transcript as the whole signal — what the Chair said, run through text sentiment models. But the base paper this project replicates argues that's only half the story: tension, confidence, and hedging often show up in vocal tone before they show up in careful, sanitized language. The question: does voice carry information about monetary policy stance that text alone misses — and does that gap show up in how markets actually move?",
} as const;

export const system = {
  kicker: "02 — The system",
  title: "Two {modalities}, fused into one stance signal.",
  intro:
    "Each press conference is split into a preprocessed audio track and an aligned transcript, run through two independent classifiers, then fused into a combined voice-tone + text-sentiment reading that feeds an econometric model of market response.",
  steps: [
    {
      label: "FOMC press conference video",
      detail: "Official Federal Reserve recordings",
      tag: "792 segments / 181 meetings",
    },
    {
      label: "Preprocessing",
      detail: "16kHz audio extraction, VAD silence removal (-40dB), DTW alignment to transcript",
      tag: "FFmpeg",
    },
    {
      label: "Mel-spectrogram features",
      detail: "64 mel bands, 300Hz–8kHz, 25ms Hamming window, 10ms hop",
      tag: "LibROSA",
      parallel: true,
    },
    {
      label: "SER classifier",
      detail: "MLP on spectrogram statistics → positive/negative vocal valence",
      tag: "78% accuracy",
      parallel: true,
    },
    {
      label: "BERT tokenization + encoding",
      detail: "WordPiece, 512-token sequences over Statement, Remarks, and Q&A segments",
      tag: "Transformers",
      parallel: true,
    },
    {
      label: "BERT classifier",
      detail: "Fine-tuned on FOMC language → hawkish/dovish text sentiment",
      tag: "F1 0.82",
      parallel: true,
    },
    {
      label: "Multimodal fusion",
      detail: "Voice tone (emo) + weighted text sentiment (S_QASR), early + late fusion",
    },
    {
      label: "Bootstrap OLS regression",
      detail: "2000 replications, BCa confidence intervals at 90%",
      tag: "22 instruments · 0–15 day horizon",
    },
    {
      label: "Hawkish / dovish stance",
      detail: "Validated against cumulative abnormal returns",
    },
  ],
  note:
    "The fusion step controls for Swanson monetary-policy shocks and the Wu–Xia shadow rate, so voice and text are tested for information that survives alongside known policy-shock signals — not against a blank baseline.",
} as const;

export const thesis = {
  kicker: "03 — Results",
  title: "What the {numbers} say.",
  quote:
    "Voice tone stayed statistically significant even after controlling for text sentiment and policy shocks.",
  stats: [
    { value: "792/181", label: "segments / FOMC meetings, 2011–2019" },
    { value: "78%", label: "SER accuracy — vocal valence classification" },
    { value: "0.82", label: "BERT F1 — hawkish/dovish classification" },
  ],
  findings: [
    {
      number: "01",
      title: "Incremental, not redundant",
      body: "Voice-tone coefficients remained statistically significant after controlling for text sentiment and Swanson policy shocks — the two modalities carry complementary information, not the same signal twice.",
    },
    {
      number: "02",
      title: "Q&A carries the signal",
      body: "Unscripted Q&A segments produced the most informative vocal signals — likely because they reveal states that formal, prepared statements sanitize away.",
    },
    {
      number: "03",
      title: "Small-n econometrics",
      body: "Bootstrap OLS with 2000 replications and BCa confidence intervals compensates for the small-sample problem inherent to meeting-level FOMC data — only ~181 events across a decade.",
    },
  ],
} as const;

export const lessons = {
  kicker: "04 — Honest limitations",
  title: "What the model {doesn't} capture.",
  items: [
    {
      problem: "US Fed only",
      fix: "The framework is validated on FOMC communications alone — whether it generalizes to the ECB, BoE, or BoJ, with different communication cultures, is untested.",
    },
    {
      problem: "No visual modality",
      fix: "Voice and text only — facial expression and gesture aren't captured. A CNN/ViT visual branch is scoped as future work, not part of the current pipeline.",
    },
    {
      problem: "Binary sentiment",
      fix: "Both classifiers force a positive/negative, hawkish/dovish split, collapsing dimensional emotion — anger and nervousness look identical to the model.",
    },
    {
      problem: "~181 meetings",
      fix: "A decade of data is still a small-n problem; longer-horizon return estimates carry high variance despite the bootstrap correction.",
    },
  ],
} as const;

export const footer = {
  kicker: "Want the details?",
  email: "s.sai08019@gmail.com",
  backLabel: "← back to projects",
  backHref: "/#projects",
} as const;
