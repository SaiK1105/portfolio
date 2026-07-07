import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Shared social-preview image renderer used by both app/opengraph-image.tsx
 * and app/twitter-image.tsx. Mirrors the dark editorial token system from
 * app/globals.css (kept in sync manually — ImageResponse can't read CSS).
 */
export const size = { width: 1200, height: 630 } as const;
export const contentType = "image/png";
export const alt = site.title;

const BACKGROUND = "#050505";
const FOREGROUND = "#e8e4d8";
const ACCENT = "#e3d5b8";
const MUTED = "#9a9a9a";

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
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
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          {site.shortName}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: FOREGROUND,
          }}
        >
          {site.title.split("—")[0].trim()}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 34,
            color: ACCENT,
          }}
        >
          LLM &amp; Agentic AI Engineer
        </div>
      </div>
    ),
    { ...size }
  );
}
