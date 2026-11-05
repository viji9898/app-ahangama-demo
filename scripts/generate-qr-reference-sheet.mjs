#!/usr/bin/env node
/**
 * generate-qr-reference-sheet.mjs
 *
 * Generates the CSV and PDF reference sheets for the Physical Guide QR codes.
 * Run with:  node scripts/generate-qr-reference-sheet.mjs
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { jsPDF } from "jspdf";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "ahangama-guide-qr-codes");

const BASE_URL = "https://ahangama.com";

const SECTIONS = [
  {
    label:       "Best Eats",
    slug:        "eats",
    section:     "eats",
    codeId:      "qr_best_eats",
    svgFile:     "QR-Best-Eats.svg",
    pngFile:     "QR-Best-Eats.png",
  },
  {
    label:       "Best Stays",
    slug:        "stays",
    section:     "stays",
    codeId:      "qr_best_stays",
    svgFile:     "QR-Best-Stays.svg",
    pngFile:     "QR-Best-Stays.png",
  },
  {
    label:       "Best Wellness",
    slug:        "wellness",
    section:     "wellness",
    codeId:      "qr_best_wellness",
    svgFile:     "QR-Best-Wellness.svg",
    pngFile:     "QR-Best-Wellness.png",
  },
  {
    label:       "Best Beaches & Surf",
    slug:        "beaches-surf",
    section:     "beaches_surf",
    codeId:      "qr_beaches_surf",
    svgFile:     "QR-Best-Beaches-Surf.svg",
    pngFile:     "QR-Best-Beaches-Surf.png",
  },
  {
    label:       "Best Experiences",
    slug:        "experiences",
    section:     "experiences",
    codeId:      "qr_experiences",
    svgFile:     "QR-Best-Experiences.svg",
    pngFile:     "QR-Best-Experiences.png",
  },
  {
    label:       "What's On in Ahangama",
    slug:        "events",
    section:     "events",
    codeId:      "qr_whats_on",
    svgFile:     "QR-Whats-On-Ahangama.svg",
    pngFile:     "QR-Whats-On-Ahangama.png",
  },
  {
    label:       "Transport",
    slug:        "transport",
    section:     "transport",
    codeId:      "qr_transport",
    svgFile:     "QR-Transport.svg",
    pngFile:     "QR-Transport.png",
  },
];

// ── CSV ──────────────────────────────────────────────────────────────────────

const csvHeader = [
  "Section Name",
  "Permanent QR URL",
  "QR Section ID",
  "GA4 Event Name",
  "qr_section",
  "qr_code_id",
  "qr_source",
  "qr_medium",
  "qr_campaign",
  "SVG Filename",
  "PNG Filename",
].join(",");

const csvRows = SECTIONS.map((s) => {
  const url = `${BASE_URL}/go/${s.slug}`;
  return [
    `"${s.label}"`,
    `"${url}"`,
    `"${s.codeId}"`,
    `"qr_scan"`,
    `"${s.section}"`,
    `"${s.codeId}"`,
    `"physical_guide"`,
    `"qr"`,
    `"ahangama_guide_2026_27"`,
    `"${s.svgFile}"`,
    `"${s.pngFile}"`,
  ].join(",");
});

const csvContent = [csvHeader, ...csvRows].join("\n");
writeFileSync(join(OUT_DIR, "QR-Reference-Sheet.csv"), csvContent, "utf8");
console.log("✓  QR-Reference-Sheet.csv");

// ── PDF ──────────────────────────────────────────────────────────────────────

const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

const PAGE_W = 297;
const PAGE_H = 210;
const MARGIN = 14;

// ── header ──
doc.setFillColor(31, 42, 36);       // navy
doc.rect(0, 0, PAGE_W, 22, "F");
doc.setTextColor(255, 255, 255);
doc.setFontSize(14);
doc.setFont("helvetica", "bold");
doc.text("Ahangama.com — Physical Guide QR Code Reference Sheet", MARGIN, 14);
doc.setFontSize(8);
doc.setFont("helvetica", "normal");
doc.text(`Generated ${new Date().toISOString().slice(0, 10)}  ·  GA4 Property: G-HZ20D69WMB  ·  Campaign: ahangama_guide_2026_27`, PAGE_W - MARGIN, 14, { align: "right" });

// ── table header ──
const COL_WIDTHS = [38, 56, 32, 20, 24, 24, 20, 14, 36];
const COL_LABELS = ["Section Name", "Permanent QR URL", "QR Section ID", "GA4 Event", "qr_section", "qr_code_id", "qr_source", "qr_medium", "SVG / PNG Filename"];

let yHead = 32;
doc.setFillColor(200, 191, 170);  // warm sand
doc.rect(MARGIN, yHead - 5, PAGE_W - MARGIN * 2, 8, "F");
doc.setTextColor(31, 42, 36);
doc.setFontSize(7);
doc.setFont("helvetica", "bold");

let xHead = MARGIN + 1;
COL_LABELS.forEach((label, i) => {
  doc.text(label, xHead, yHead);
  xHead += COL_WIDTHS[i];
});

// ── rows ──
let yRow = yHead + 7;
doc.setFont("helvetica", "normal");
doc.setFontSize(6.5);

SECTIONS.forEach((s, idx) => {
  const url = `${BASE_URL}/go/${s.slug}`;
  const bg = idx % 2 === 0 ? [245, 240, 232] : [255, 255, 255];
  doc.setFillColor(...bg);
  doc.rect(MARGIN, yRow - 4.5, PAGE_W - MARGIN * 2, 8, "F");

  doc.setTextColor(31, 42, 36);
  const cells = [
    s.label,
    url,
    s.codeId,
    "qr_scan",
    s.section,
    s.codeId,
    "physical_guide",
    "qr",
    `${s.svgFile} / ${s.pngFile}`,
  ];
  let xCell = MARGIN + 1;
  cells.forEach((cell, i) => {
    doc.text(String(cell), xCell, yRow, { maxWidth: COL_WIDTHS[i] - 2 });
    xCell += COL_WIDTHS[i];
  });

  yRow += 8;
});

// ── implementation notes ──
yRow += 4;
doc.setDrawColor(200, 191, 170);
doc.setLineWidth(0.3);
doc.line(MARGIN, yRow, PAGE_W - MARGIN, yRow);
yRow += 6;

doc.setFont("helvetica", "bold");
doc.setFontSize(7.5);
doc.setTextColor(31, 42, 36);
doc.text("Implementation Notes", MARGIN, yRow);
yRow += 5;
doc.setFont("helvetica", "normal");
doc.setFontSize(6.5);
doc.setTextColor(60, 70, 65);

const notes = [
  "• All QR codes are permanent. The printed URLs (/go/*) will never change.",
  "• To update where a QR code redirects: edit src/data/guideQrRedirects.js and redeploy. No QR regeneration needed.",
  "• GA4 event name: qr_scan  |  Property: G-HZ20D69WMB  |  Parameters: qr_section, qr_code_id, qr_source, qr_medium, qr_campaign",
  "• The event fires once per session per code. Duplicate events from refreshes are suppressed via sessionStorage.",
  "• Ordinary visitors who navigate directly to the guide sections will NOT trigger qr_scan events.",
];
notes.forEach((note) => {
  doc.text(note, MARGIN, yRow);
  yRow += 4.5;
});

// ── footer ──
doc.setTextColor(130, 120, 110);
doc.setFontSize(6);
doc.text("Ahangama.com  ·  Confidential  ·  For internal use and graphic designer reference only", PAGE_W / 2, PAGE_H - 6, { align: "center" });

const pdfPath = join(OUT_DIR, "QR-Reference-Sheet.pdf");
writeFileSync(pdfPath, Buffer.from(doc.output("arraybuffer")));
console.log("✓  QR-Reference-Sheet.pdf");
console.log("\nReference sheets written to ahangama-guide-qr-codes/\n");

