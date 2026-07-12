import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Static export: this runs at build time and is emitted to out/sitemap.xml.
// Required for output: "export" — sitemap.ts compiles to a route handler,
// and unopted route handlers are dynamic by default.
// See node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // /resume/ is intentionally absent: it is noindex (robots in its
    // metadata), and noindex pages don't belong in a sitemap.
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.url}/work/argus-v/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
