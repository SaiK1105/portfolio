import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Shared social-preview image renderer used by both app/opengraph-image.tsx
 * and app/twitter-image.tsx. Mirrors the vibrant gradient-modern token
 * system from app/globals.css (kept in sync manually — ImageResponse can't
 * read CSS, and next/og only accepts inline styles, no class names).
 */
export const size = { width: 1200, height: 630 } as const;
export const contentType = "image/png";
export const alt = site.title;

const BACKGROUND = "#060614";
const FOREGROUND = "#ededf4";
const MUTED = "#9ca0b0";
const ACCENT_1 = "#8b5cf6"; // violet
const ACCENT_2 = "#22d3ee"; // cyan
const ACCENT_3 = "#f472b6"; // pink

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: BACKGROUND,
          fontFamily: "sans-serif",
        }}
      >
        {/* Ambient glow — violet, top-left. */}
        <div
          style={{
            position: "absolute",
            display: "flex",
            top: "-220px",
            left: "-220px",
            width: "640px",
            height: "640px",
            borderRadius: "9999px",
            backgroundImage: `radial-gradient(circle, ${ACCENT_1} 0%, rgba(139,92,246,0) 70%)`,
            opacity: 0.35,
          }}
        />
        {/* Ambient glow — cyan, bottom-right. */}
        <div
          style={{
            position: "absolute",
            display: "flex",
            bottom: "-240px",
            right: "-200px",
            width: "620px",
            height: "620px",
            borderRadius: "9999px",
            backgroundImage: `radial-gradient(circle, ${ACCENT_2} 0%, rgba(34,211,238,0) 70%)`,
            opacity: 0.3,
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontFamily: "monospace",
            color: MUTED,
          }}
        >
          {site.url.replace(/^https?:\/\//, "")}
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            marginTop: 28,
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            backgroundImage: `linear-gradient(100deg, ${ACCENT_1} 0%, ${ACCENT_2} 60%, ${ACCENT_3} 120%)`,
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {site.title.split("—")[0].trim()}
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            marginTop: 28,
            fontSize: 34,
            color: FOREGROUND,
          }}
        >
          LLM &amp; Agentic AI Engineer
        </div>
      </div>
    ),
    { ...size }
  );
}
