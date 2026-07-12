/**
 * Screenshot helper: serves out/ is assumed running on :4321.
 * Scrolls through each page so whileInView animations complete,
 * then captures full-page + per-section shots for design review.
 * Usage: bun scripts/shoot.mjs <outDir>
 */
import { chromium } from "playwright";

const OUT = process.argv[2] ?? "/tmp/shots";
const BASE = "http://localhost:4321";

const browser = await chromium.launch();

async function shoot(path, name, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  // scroll to bottom in steps to fire whileInView(once) reveals
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 350));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 600));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  await page.close();
  console.log(`shot: ${name}`);
}

await shoot("/", "home-desktop", 1440, 900);
await shoot("/", "home-mobile", 390, 844);
await shoot("/work/argus-v/", "case-desktop", 1440, 900);
await browser.close();
