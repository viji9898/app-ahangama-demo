#!/usr/bin/env node
/**
 * generate-guide-qr-codes.mjs
 *
 * Generates seven QR code files (SVG + PNG) for the Physical Ahangama Guide.
 * Run with:  node scripts/generate-guide-qr-codes.mjs
 *
 * Output: ahangama-guide-qr-codes/
 */

import QRCode from "qrcode";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "ahangama-guide-qr-codes");

mkdirSync(OUT_DIR, { recursive: true });

const BASE_URL = "https://ahangama.com";

const QR_SECTIONS = [
  { slug: "eats",         label: "Best Eats",              file: "QR-Best-Eats",           codeId: "qr_best_eats"    },
  { slug: "stays",        label: "Best Stays",             file: "QR-Best-Stays",          codeId: "qr_best_stays"   },
  { slug: "wellness",     label: "Best Wellness",          file: "QR-Best-Wellness",       codeId: "qr_best_wellness"},
  { slug: "beaches-surf", label: "Best Beaches & Surf",    file: "QR-Best-Beaches-Surf",   codeId: "qr_beaches_surf" },
  { slug: "experiences",  label: "Best Experiences",       file: "QR-Best-Experiences",    codeId: "qr_experiences"  },
  { slug: "events",       label: "What's On in Ahangama",  file: "QR-Whats-On-Ahangama",   codeId: "qr_whats_on"     },
  { slug: "transport",    label: "Transport",              file: "QR-Transport",           codeId: "qr_transport"    },
];

// QR code options — optimised for high-quality print production
const SVG_OPTIONS = {
  type:         "svg",
  errorCorrectionLevel: "H",   // highest error correction for print resilience
  margin:       4,              // 4-module quiet zone (ISO spec minimum)
  color: {
    dark:  "#000000",
    light: "#ffffff",
  },
  width: 1200,                  // intrinsic size hint (SVG is scalable)
};

const PNG_OPTIONS = {
  type:         "png",
  errorCorrectionLevel: "H",
  margin:       4,
  color: {
    dark:  "#000000",
    light: "#ffffff",
  },
  width: 1200,                  // 1200 × 1200 px — high-res for print
};

console.log(`\nGenerating QR codes → ${OUT_DIR}\n`);

for (const section of QR_SECTIONS) {
  const url = `${BASE_URL}/go/${section.slug}`;

  // --- SVG ---
  const svgContent = await QRCode.toString(url, SVG_OPTIONS);
  const svgPath = join(OUT_DIR, `${section.file}.svg`);
  writeFileSync(svgPath, svgContent, "utf8");

  // --- PNG ---
  const pngBuffer = await QRCode.toBuffer(url, PNG_OPTIONS);
  const pngPath = join(OUT_DIR, `${section.file}.png`);
  writeFileSync(pngPath, pngBuffer);

  console.log(`  ✓  ${section.label}`);
  console.log(`       URL : ${url}`);
  console.log(`       SVG : ahangama-guide-qr-codes/${section.file}.svg`);
  console.log(`       PNG : ahangama-guide-qr-codes/${section.file}.png`);
  console.log();
}

console.log("All 7 QR codes generated successfully.\n");

