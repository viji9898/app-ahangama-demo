#!/usr/bin/env node
/**
 * generate-qr-reference-sheet-tasklist.mjs
 *
 * Generates the CSV and PDF reference sheets for the 196 task-list QR codes.
 * Depends on the SVG/PNG files produced by:
 *   node scripts/generate-guide-qr-codes-tasklist.mjs
 *
 * Run with:  node scripts/generate-qr-reference-sheet-tasklist.mjs
 *
 * Output: ahangama-guide-qr-codes-tasklist/
 */

import { writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { GUIDE_QR_REDIRECTS_TASKLIST } from "../src/data/guideQrRedirectsTasklist.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "ahangama-guide-qr-codes-tasklist");

const BASE_URL = "https://ahangama.com";
const EVENT_NAME = "qr_scan";
const QR_SOURCE = "physical_guide";
const QR_MEDIUM = "qr";
const QR_CAMPAIGN = "ahangama_guide_2026_27";

const ENTRIES = GUIDE_QR_REDIRECTS_TASKLIST;

if (ENTRIES.length !== 196) {
  throw new Error(`Expected 196 task-list QR entries, found ${ENTRIES.length}`);
}

// Ensure every generated PNG exists before building the PDF.
const missing = ENTRIES.filter(
  (entry) => !existsSync(join(OUT_DIR, `${entry.file}.png`)),
);
if (missing.length) {
  throw new Error(
    `Missing PNG files for: ${missing.map((m) => m.label).join(", ")}. ` +
      "Run scripts/generate-guide-qr-codes-tasklist.mjs first.",
  );
}

const resolveDestination = (destination) =>
  destination.startsWith("http") ? destination : `${BASE_URL}${destination}`;

const statusLabel = (entry) =>
  entry.status === "confirmed" ? "Confirmed" : "Planned – temporary fallback";

const csvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

// ── CSV ──────────────────────────────────────────────────────────────────────

const csvHeader = [
  "Page Title",
  "Slug",
  "Encoded QR URL",
  "Actual Destination",
  "Actual Destination URL",
  "Planned / Future Destination",
  "Status",
  "Guide Group",
  "QR Section ID",
  "GA4 Event Name",
  "qr_section",
  "qr_code_id",
  "qr_source",
  "qr_medium",
  "qr_campaign",
  "Missing Information",
  "SVG Filename",
  "PNG Filename",
];

const csvRows = ENTRIES.map((entry) => {
  const encodedSlug = entry.encodedSlug ?? entry.slug;
  return [
    entry.label,
    entry.slug,
    `${BASE_URL}/go/${encodedSlug}`,
    entry.destination,
    resolveDestination(entry.destination),
    entry.plannedDestination,
    statusLabel(entry),
    entry.group,
    entry.codeId,
    EVENT_NAME,
    entry.section,
    entry.codeId,
    QR_SOURCE,
    QR_MEDIUM,
    QR_CAMPAIGN,
    entry.provisionalNote ?? "",
    `${entry.file}.svg`,
    `${entry.file}.png`,
  ]
    .map(csvCell)
    .join(",");
});

writeFileSync(
  join(OUT_DIR, "QR-Reference-Sheet.csv"),
  [csvHeader.map(csvCell).join(","), ...csvRows].join("\n"),
  "utf8",
);
console.log(`✓  QR-Reference-Sheet.csv (${ENTRIES.length} rows)`);

// ── PDF ──────────────────────────────────────────────────────────────────────

const doc = new jsPDF({
  orientation: "landscape",
  unit: "mm",
  format: "a4",
  compress: true,
});

const PAGE_W = 297;
const PAGE_H = 210;
const MARGIN = 12;
const COLS = 3;
const ROWS = 4;
const PER_PAGE = COLS * ROWS;
const GRID_TOP = 26;
const ROW_H = 45;
const COL_W = (PAGE_W - MARGIN * 2) / COLS;
const QR_SIZE = 26;
const TEXT_X_OFFSET = 31;
const TEXT_W = COL_W - TEXT_X_OFFSET - 4;

// Embed 480 px renderings in the PDF (≈470 dpi at 26 mm). The standalone PNG
// assets remain 1200 × 1200 px as required; this only keeps the PDF portable.
const qrDataUrls = await Promise.all(
  ENTRIES.map((entry) =>
    QRCode.toDataURL(`${BASE_URL}/go/${entry.encodedSlug ?? entry.slug}`, {
      errorCorrectionLevel: "H",
      margin: 4,
      width: 480,
      color: { dark: "#000000", light: "#ffffff" },
    }),
  ),
);

function fitTextLine(text, maxWidth) {
  if (doc.getTextWidth(text) <= maxWidth) return text;
  let trimmed = text;
  while (trimmed.length > 1 && doc.getTextWidth(`${trimmed}…`) > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return `${trimmed}…`;
}

function drawPageHeader() {
  doc.setFillColor(31, 42, 36);
  doc.rect(0, 0, PAGE_W, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12.5);
  doc.setFont("helvetica", "bold");
  doc.text("Ahangama.com — Task-list Physical Guide QR Codes (196)", MARGIN, 9);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Campaign: ahangama_guide_2026_27  ·  Event: qr_scan  ·  Source: physical_guide  ·  Medium: qr",
    MARGIN,
    15,
  );
  doc.text(
    "Confirmed = live destination  ·  Planned = safe /guide fallback until final destination is supplied",
    PAGE_W - MARGIN,
    15,
    { align: "right" },
  );
}

function drawCell(entry, idx) {
  const positionOnPage = idx % PER_PAGE;
  const row = Math.floor(positionOnPage / COLS);
  const col = positionOnPage % COLS;
  const cellX = MARGIN + col * COL_W;
  const cellY = GRID_TOP + row * ROW_H;

  // QR image, top-left of the cell
  doc.addImage(qrDataUrls[idx], "PNG", cellX + 2, cellY + 1, QR_SIZE, QR_SIZE);

  const textX = cellX + TEXT_X_OFFSET;
  let y = cellY + 3.4;

  // Title
  doc.setTextColor(31, 42, 36);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.9);
  const titleLines = doc.splitTextToSize(entry.label, TEXT_W).slice(0, 2);
  titleLines.forEach((line) => {
    doc.text(fitTextLine(line, TEXT_W), textX, y);
    y += 3.1;
  });

  // Status badge
  const isConfirmed = entry.status === "confirmed";
  doc.setFontSize(5.6);
  doc.setTextColor(isConfirmed ? 22 : 156, isConfirmed ? 112 : 82, isConfirmed ? 60 : 12);
  doc.text(
    isConfirmed ? "CONFIRMED" : "PLANNED – TEMPORARY FALLBACK",
    textX,
    y + 0.6,
  );
  y += 4.2;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(85, 92, 88);
  doc.setFontSize(5.1);

  const lines = [
    [`slug: ${entry.slug}`, 2],
    [`QR: ${BASE_URL}/go/${entry.encodedSlug ?? entry.slug}`, 2],
    [`To: ${entry.destination}`, 2],
    [`Section: ${entry.section}  ·  Code: ${entry.codeId}`, 2],
    [`Source: ${QR_SOURCE}  ·  Medium: ${QR_MEDIUM}  ·  Campaign: ${QR_CAMPAIGN}`, 1],
  ];

  for (const [text, maxLines] of lines) {
    const wrapped = doc.splitTextToSize(text, TEXT_W).slice(0, maxLines);
    wrapped.forEach((line) => {
      doc.text(fitTextLine(line, TEXT_W), textX, y);
      y += 2.5;
    });
  }

  // Faint cell separator
  if (row < ROWS - 1) {
    doc.setDrawColor(225, 218, 205);
    doc.setLineWidth(0.15);
    doc.line(cellX + 3, cellY + ROW_H - 1.5, cellX + COL_W - 3, cellY + ROW_H - 1.5);
  }
}

ENTRIES.forEach((entry, idx) => {
  if (idx > 0 && idx % PER_PAGE === 0) {
    doc.addPage();
  }
  if (idx % PER_PAGE === 0) {
    drawPageHeader();
  }
  drawCell(entry, idx);
});

// Page numbers + footer on every page
const pageCount = doc.getNumberOfPages();
for (let p = 1; p <= pageCount; p += 1) {
  doc.setPage(p);
  doc.setTextColor(130, 120, 110);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text(`Page ${p} of ${pageCount}`, PAGE_W - MARGIN, PAGE_H - 5, {
    align: "right",
  });
  doc.text(
    "Ahangama.com  ·  Confidential  ·  For internal use and graphic designer reference only",
    MARGIN,
    PAGE_H - 5,
  );
}

writeFileSync(
  join(OUT_DIR, "QR-Reference-Sheet.pdf"),
  Buffer.from(doc.output("arraybuffer")),
);
console.log(`✓  QR-Reference-Sheet.pdf (${pageCount} pages)`);
console.log(`\nReference sheets written to ahangama-guide-qr-codes-tasklist/\n`);
