import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Shared social-preview image renderer used by both app/opengraph-image.tsx
 * and app/twitter-image.tsx. Mirrors the PID 1 — Agent OS token system
 * from app/globals.css (kept in sync manually — ImageResponse can't read
 * CSS, and next/og only accepts inline styles, no class names). Flat,
 * near-black terminal surface — no gradients, no glow.
 */
export const size = { width: 1200, height: 630 } as const;
export const contentType = "image/png";
export const alt = site.title;

const BACKGROUND = "#0A0A0C";
const TEXT = "#F4F3EF";
const MUTED = "#8B8B92";
const AMBER = "#FFB020";
const GREEN = "#33FF9C";
const BORDER = "#2A2A2E";

export function renderOgImage() {
  const domain = site.url.replace(/^https?:\/\//, "");
  const role = site.title.split("—")[1]?.trim() ?? "LLM & Agentic AI Engineer";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: BACKGROUND,
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 46,
              height: 46,
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              color: AMBER,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            &gt;_
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            {domain}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontSize: 78,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: -2,
            color: TEXT,
          }}
        >
          {site.title.split("—")[0].trim()}
        </div>

        <div style={{ display: "flex", marginTop: 20, fontSize: 32, color: GREEN }}>{role}</div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 22,
            color: MUTED,
          }}
        >
          <span style={{ color: GREEN, marginRight: 14 }}>$</span>
          status --seeking
          <span style={{ color: MUTED, marginLeft: 14 }}>
            → open to internships 2026
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
