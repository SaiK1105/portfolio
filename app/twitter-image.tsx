import { alt, contentType, renderOgImage, size } from "@/lib/og-image";

// Required for `output: "export"` — generated at build time, not per-request.
export const dynamic = "force-static";

export { alt, contentType, size };

export default function Image() {
  return renderOgImage();
}
