import { ImageResponse } from "next/og";

/**
 * Favicon generated from the site's own "SK" monogram (see IslandNav),
 * replacing the stock create-next-app icon.
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
          background: "#060614",
          color: "#22d3ee",
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: -0.5,
        }}
      >
        SK
      </div>
    ),
    { ...size }
  );
}
