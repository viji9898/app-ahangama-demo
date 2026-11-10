#!/usr/bin/env node
/**
 * generate-guide-qr-codes-new.mjs
 *
 * Generates the 37 NEW QR code files (SVG + PNG) for the Physical Ahangama
 * Guide 2026/27. The original seven QR codes are NOT touched.
 *
 * Run with:  node scripts/generate-guide-qr-codes-new.mjs
 *
 * Output: ahangama-guide-qr-codes-new/
 */

import QRCode from "qrcode";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { GUIDE_QR_REDIRECTS_NEW } from "../src/data/guideQrRedirectsNew.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "ahangama-guide-qr-codes-new");

mkdirSync(OUT_DIR, { recursive: true });

const BASE_URL = "https://ahangama.com";

// ── Sanity checks ────────────────────────────────────────────────────────────
if (GUIDE_QR_REDIRECTS_NEW.length !== 37) {
  throw new Error(
    `Expected 37 new QR entries, found ${GUIDE_QR_REDIRECTS_NEW.length}`,
  );
}

const slugs = GUIDE_QR_REDIRECTS_NEW.map((s) => s.slug);
const sections = GUIDE_QR_REDIRECTS_NEW.map((s) => s.section);
const codeIds = GUIDE_QR_REDIRECTS_NEW.map((s) => s.codeId);
const files = GUIDE_QR_REDIRECTS_NEW.map((s) => s.file);
const urls = slugs.map((slug) => `${BASE_URL}/go/${slug}`);

for (const [name, values] of [
  ["slug", slugs],
  ["section", sections],
  ["codeId", codeIds],
  ["file", files],
  ["permanent URL", urls],
]) {
  const dupes = values.filter((v, i) => values.indexOf(v) !== i);
  if (dupes.length) {
    throw new Error(`Duplicate ${name}: ${[...new Set(dupes)].join(", ")}`);
  }
}

// ── QR options — identical print specs to the original seven codes ──────────
const SVG_OPTIONS = {
  type: "svg",
  errorCorrectionLevel: "H", // highest error correction for print resilience
  margin: 4, // 4-module quiet zone (ISO spec minimum)
  color: {
    dark: "#000000",
    light: "#ffffff",
  },
  width: 1200, // intrinsic size hint (SVG is scalable)
};

const PNG_OPTIONS = {
  type: "png",
  errorCorrectionLevel: "H",
  margin: 4,
  color: {
    dark: "#000000",
    light: "#ffffff",
  },
  width: 1200, // 1200 × 1200 px — high-res for print
};

console.log(`\nGenerating 37 new QR codes → ${OUT_DIR}\n`);

let index = 0;
for (const entry of GUIDE_QR_REDIRECTS_NEW) {
  index += 1;
  const url = `${BASE_URL}/go/${entry.slug}`;

  // --- SVG ---
  const svgContent = await QRCode.toString(url, SVG_OPTIONS);
  writeFileSync(join(OUT_DIR, `${entry.file}.svg`), svgContent, "utf8");

  // --- PNG ---
  const pngBuffer = await QRCode.toBuffer(url, PNG_OPTIONS);
  writeFileSync(join(OUT_DIR, `${entry.file}.png`), pngBuffer);

  console.log(`  ✓  ${String(index).padStart(2, "0")}. ${entry.label}`);
  console.log(`        URL : ${url}`);
  console.log(`        SVG : ahangama-guide-qr-codes-new/${entry.file}.svg`);
  console.log(`        PNG : ahangama-guide-qr-codes-new/${entry.file}.png`);
}

console.log("\nAll 37 new QR codes generated successfully.\n");
