#!/usr/bin/env node
/**
 * verify-guide-qr-codes-tasklist.mjs
 *
 * Decodes every task-list PNG and confirms that:
 *   - the PNG is 1200 × 1200
 *   - it contains exactly the permanent /go/ URL for its entry
 *   - the matching SVG exists
 *
 * Run with:  node scripts/verify-guide-qr-codes-tasklist.mjs
 */

import fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PNG } from "pngjs";
import jsQR from "jsqr";
import { GUIDE_QR_REDIRECTS_TASKLIST as ENTRIES } from "../src/data/guideQrRedirectsTasklist.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "ahangama-guide-qr-codes-tasklist");
const BASE_URL = "https://ahangama.com";

let passed = 0;
const failures = [];

for (const entry of ENTRIES) {
  const expected = `${BASE_URL}/go/${entry.encodedSlug ?? entry.slug}`;
  const pngPath = join(OUT_DIR, `${entry.file}.png`);
  const svgPath = join(OUT_DIR, `${entry.file}.svg`);

  if (!fs.existsSync(pngPath)) {
    failures.push(`${entry.slug}: missing PNG`);
    continue;
  }
  if (!fs.existsSync(svgPath)) {
    failures.push(`${entry.slug}: missing SVG`);
    continue;
  }

  const png = PNG.sync.read(fs.readFileSync(pngPath));
  if (png.width !== 1200 || png.height !== 1200) {
    failures.push(`${entry.slug}: ${png.width}×${png.height}, expected 1200×1200`);
    continue;
  }

  const decoded = jsQR(
    new Uint8ClampedArray(png.data),
    png.width,
    png.height,
  );
  if (!decoded) {
    failures.push(`${entry.slug}: QR did not decode`);
    continue;
  }
  if (decoded.data !== expected) {
    failures.push(`${entry.slug}: decoded ${decoded.data}, expected ${expected}`);
    continue;
  }
  passed += 1;
}

console.log(`Decoded OK: ${passed}/${ENTRIES.length}`);
if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log("All task-list QR images decode to their permanent /go/ URL.");
