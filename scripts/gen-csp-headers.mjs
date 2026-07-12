#!/usr/bin/env node
/**
 * Post-build step: hash-based CSP for Cloudflare Pages.
 *
 * Next static export (output: 'export') still emits per-page inline
 * <script> tags:
 *   - the RSC hydration bootstrap: `(self.__next_f=...).push([...])`
 *   - JSON-LD structured data: `<script type="application/ld+json">...`
 *
 * CSP's script-src directive governs ALL inline <script> elements
 * regardless of their `type` attribute — JSON-LD blocks are included in
 * that check (a common gotcha: they LOOK like inert data, but browsers
 * still enforce script-src against them). So dropping 'unsafe-inline'
 * from script-src requires an explicit 'sha256-<hash>' entry for every
 * unique inline script body across every exported page.
 *
 * Flow (see also public/_headers):
 *   1. `next build` copies public/_headers -> out/_headers verbatim. The
 *      source file's script-src contains a literal __SCRIPT_HASHES__
 *      placeholder token.
 *   2. This script (wired as the npm "postbuild" hook) walks out/**\/*.html,
 *      extracts every inline <script> body (tags with a `src` attribute are
 *      external and skipped — CSP doesn't need a hash for those), computes
 *      the CSP-spec sha256 base64 digest of each *unique* body, and
 *      rewrites out/_headers, replacing __SCRIPT_HASHES__ with
 *      'sha256-...' 'sha256-...' ...
 *
 * The digest is taken over the exact raw bytes between <script ...> and
 * </script> — script/style are HTML "raw text" elements, so there is no
 * entity-decoding step; the substring in the file IS the content the
 * browser hashes.
 *
 * style-src intentionally keeps 'unsafe-inline' — see comment in
 * public/_headers. CSP has no hash mechanism for inline style
 * ATTRIBUTES (only <style> elements), and Framer Motion / React set
 * style="..." attributes at runtime for animation, so hashing style-src
 * is not viable here without breaking the site.
 *
 * If a future build has ZERO inline scripts (fully externalized), the
 * placeholder is removed instead of being replaced, leaving a plain
 * script-src 'self' with no 'unsafe-inline' fallback.
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve(process.cwd(), "out");
const HEADERS_FILE = path.join(OUT_DIR, "_headers");
const PLACEHOLDER = "__SCRIPT_HASHES__";

function walkHtmlFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      results.push(...walkHtmlFiles(full));
    } else if (entry.toLowerCase().endsWith(".html")) {
      results.push(full);
    }
  }
  return results;
}

// Matches <script ...>...</script>, capturing the opening tag's attributes
// (group 1) and the raw body (group 2). Scripts with a `src` attribute are
// filtered out after matching since attribute order isn't fixed.
const SCRIPT_TAG_RE = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;

function extractInlineScriptBodies(html) {
  const bodies = [];
  let match;
  SCRIPT_TAG_RE.lastIndex = 0;
  while ((match = SCRIPT_TAG_RE.exec(html)) !== null) {
    const [, attrs, body] = match;
    if (/\bsrc\s*=/i.test(attrs)) continue; // external script — not hashed
    if (body.trim().length === 0) continue; // empty inline script is a no-op
    bodies.push(body);
  }
  return bodies;
}

function main() {
  if (!existsSync(OUT_DIR)) {
    console.error(`[gen-csp-headers] out/ not found at ${OUT_DIR} — run "next build" first.`);
    process.exit(1);
  }

  const htmlFiles = walkHtmlFiles(OUT_DIR);
  if (htmlFiles.length === 0) {
    console.error(`[gen-csp-headers] no .html files found under ${OUT_DIR} — did the build run?`);
    process.exit(1);
  }

  const hashes = new Set();
  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8");
    for (const body of extractInlineScriptBodies(html)) {
      const digest = createHash("sha256").update(body, "utf8").digest("base64");
      hashes.add(`'sha256-${digest}'`);
    }
  }

  if (!existsSync(HEADERS_FILE)) {
    console.error(
      `[gen-csp-headers] ${HEADERS_FILE} not found — expected public/_headers to be copied into out/ by "next build".`,
    );
    process.exit(1);
  }

  const headersContent = readFileSync(HEADERS_FILE, "utf8");

  // Only replace the placeholder on the actual Content-Security-Policy
  // header line, not anywhere else in the file (e.g. the explanatory
  // comment above it in public/_headers also mentions the placeholder
  // token by name — a blind whole-file replace would clobber that
  // comment instead of the real directive, since String#replace only
  // touches the first match).
  const lines = headersContent.split("\n");
  let replacedCspLine = false;
  const newLines = lines.map((line) => {
    if (!line.includes("Content-Security-Policy:") || !line.includes(PLACEHOLDER)) {
      return line;
    }
    replacedCspLine = true;
    if (hashes.size > 0) {
      return line.replace(PLACEHOLDER, [...hashes].sort().join(" "));
    }
    // No inline scripts anywhere in this build — drop the placeholder
    // (and its leading space) instead of leaving a dangling token, so
    // script-src ends up as plain 'self'.
    return line.replace(` ${PLACEHOLDER}`, "");
  });

  if (!replacedCspLine) {
    console.error(
      `[gen-csp-headers] no Content-Security-Policy line containing ${PLACEHOLDER} found in ${HEADERS_FILE} — is public/_headers still wired up with the placeholder?`,
    );
    process.exit(1);
  }

  writeFileSync(HEADERS_FILE, newLines.join("\n"));

  console.log(
    `[gen-csp-headers] scanned ${htmlFiles.length} html file(s), found ${hashes.size} unique inline script body/bodies, wrote script-src to ${HEADERS_FILE}`,
  );
}

main();
