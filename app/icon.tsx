import { ImageResponse } from "next/og";

/**
 * Favicon generated from the OS menu-bar prompt glyph (">_"), replacing
 * the stock create-next-app icon. Near-black surface, green terminal
 * accent — matches app/globals.css's --bg / --green tokens.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Required for `output: "export"` — generated at build time, not per-request.
export const dynamic = "force-static";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0C",
          color: "#33FF9C",
          fontFamily: "monospace",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: -0.5,
        }}
      >
        &gt;_
      </div>
    ),
    { ...size }
  );
}
