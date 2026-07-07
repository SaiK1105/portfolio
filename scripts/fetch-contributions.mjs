/**
 * Build-time fetch of GitHub contributions for the activity graph.
 * Writes public/data/contributions.json; on any failure the previously
 * committed JSON stays in place so offline builds keep working.
 * Run via: bun run scripts/fetch-contributions.mjs (prebuild hook)
 */
import { writeFile } from "node:fs/promises";

const USER = "SaiK1105";
const OUT = new URL("../lib/data/contributions.json", import.meta.url);

try {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`,
    { signal: AbortSignal.timeout(15000) },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data.contributions)) throw new Error("unexpected shape");
  await writeFile(OUT, JSON.stringify(data));
  console.log(`contributions: ${data.total?.lastYear ?? "?"} in last year`);
} catch (err) {
  console.warn(`contributions fetch failed (${err.message}) — keeping committed fallback`);
}
