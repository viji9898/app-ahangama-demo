#!/usr/bin/env node
/**
 * generate-guide-qr-codes-tasklist.mjs
 *
 * Generates the SVG + PNG artwork for the 20 November 2026 Ahangama Guide
 * task-list QR batch. The original seven QR codes and the earlier 39 QR codes
 * are NOT touched.
 *
 * Run with:  node scripts/generate-guide-qr-codes-tasklist.mjs
 *
 * Output: ahangama-guide-qr-codes-tasklist/
 */

import QRCode from "qrcode";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { GUIDE_QR_REDIRECTS_TASKLIST } from "../src/data/guideQrRedirectsTasklist.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "ahangama-guide-qr-codes-tasklist");

mkdirSync(OUT_DIR, { recursive: true });

const BASE_URL = "https://ahangama.com";

if (GUIDE_QR_REDIRECTS_TASKLIST.length !== 196) {
  throw new Error(
    `Expected 196 task-list QR entries, found ${GUIDE_QR_REDIRECTS_TASKLIST.length}`,
  );
}

const slugs = GUIDE_QR_REDIRECTS_TASKLIST.map((s) => s.slug);
const sections = GUIDE_QR_REDIRECTS_TASKLIST.map((s) => s.section);
const codeIds = GUIDE_QR_REDIRECTS_TASKLIST.map((s) => s.codeId);
const files = GUIDE_QR_REDIRECTS_TASKLIST.map((s) => s.file);
const encodedSlugs = GUIDE_QR_REDIRECTS_TASKLIST.map(
  (s) => s.encodedSlug ?? s.slug,
);
const urls = encodedSlugs.map((slug) => `${BASE_URL}/go/${slug}`);

for (const [name, values] of [
  ["slug", slugs],
  ["section", sections],
  ["codeId", codeIds],
  ["file", files],
  ["encoded slug", encodedSlugs],
  ["permanent URL", urls],
]) {
  const dupes = values.filter((v, i) => values.indexOf(v) !== i);
  if (dupes.length) {
    throw new Error(`Duplicate ${name}: ${[...new Set(dupes)].join(", ")}`);
  }
}

// ── QR options — identical print specs to the earlier batches ───────────────
const SVG_OPTIONS = {
  type: "svg",
  errorCorrectionLevel: "H",
  margin: 4,
  color: {
    dark: "#000000",
    light: "#ffffff",
  },
  width: 1200,
};

const PNG_OPTIONS = {
  type: "png",
  errorCorrectionLevel: "H",
  margin: 4,
  color: {
    dark: "#000000",
    light: "#ffffff",
  },
  width: 1200,
};

console.log(`\nGenerating 196 task-list QR codes → ${OUT_DIR}\n`);

let index = 0;
for (const entry of GUIDE_QR_REDIRECTS_TASKLIST) {
  index += 1;
  const encodedSlug = entry.encodedSlug ?? entry.slug;
  const url = `${BASE_URL}/go/${encodedSlug}`;

  const svgContent = await QRCode.toString(url, SVG_OPTIONS);
  writeFileSync(join(OUT_DIR, `${entry.file}.svg`), svgContent, "utf8");

  const pngBuffer = await QRCode.toBuffer(url, PNG_OPTIONS);
  writeFileSync(join(OUT_DIR, `${entry.file}.png`), pngBuffer);

  if (index % 25 === 0 || index === GUIDE_QR_REDIRECTS_TASKLIST.length) {
    console.log(`  … ${index}/${GUIDE_QR_REDIRECTS_TASKLIST.length}`);
  }
}

console.log("\nAll 196 task-list QR codes generated successfully.\n");
