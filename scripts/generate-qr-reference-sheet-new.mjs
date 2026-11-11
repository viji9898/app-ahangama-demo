#!/usr/bin/env node
/**
 * generate-qr-reference-sheet-new.mjs
 *
 * Generates the CSV and PDF reference sheets for the 37 NEW Physical Guide QR
 * codes. Depends on the SVG/PNG files produced by:
 *   node scripts/generate-guide-qr-codes-new.mjs
 *
 * Run with:  node scripts/generate-qr-reference-sheet-new.mjs
 *
 * Output: ahangama-guide-qr-codes-new/
 */

import { writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { GUIDE_QR_REDIRECTS_NEW } from "../src/data/guideQrRedirectsNew.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "ahangama-guide-qr-codes-new");

const BASE_URL = "https://ahangama.com";
const EVENT_NAME = "qr_scan";
const QR_SOURCE = "physical_guide";
const QR_MEDIUM = "qr";
const QR_CAMPAIGN = "ahangama_guide_2026_27";

if (GUIDE_QR_REDIRECTS_NEW.length !== 37) {
  throw new Error(
    `Expected 37 new QR entries, found ${GUIDE_QR_REDIRECTS_NEW.length}`,
  );
}

// Ensure every generated PNG exists before building the PDF.
const missing = GUIDE_QR_REDIRECTS_NEW.filter(
  (entry) => !existsSync(join(OUT_DIR, `${entry.file}.png`)),
);
if (missing.length) {
  throw new Error(
    `Missing PNG files for: ${missing.map((m) => m.label).join(", ")}. ` +
      "Run scripts/generate-guide-qr-codes-new.mjs first.",
  );
}

const csvCell = (value) => `"${String(value).replace(/"/g, '""')}"`;

// ── CSV ──────────────────────────────────────────────────────────────────────

const csvHeader = [
  "Page Title",
  "Slug",
  "Encoded QR URL",
  "Canonical /go/ URL",
  "Legacy /go/ Aliases",
  "Planned Destination",
  "Live Destination",
  "Guide Group",
  "QR Section ID",
  "GA4 Event Name",
  "qr_section",
  "qr_code_id",
  "qr_source",
  "qr_medium",
  "qr_campaign",
  "SVG Filename",
  "PNG Filename",
];

const csvRows = GUIDE_QR_REDIRECTS_NEW.map((entry) => {
  const encodedSlug = entry.encodedSlug ?? entry.slug;
  return [
    entry.label,
    entry.slug,
    `${BASE_URL}/go/${encodedSlug}`,
    `${BASE_URL}/go/${entry.slug}`,
    (entry.legacySlugs ?? []).map((s) => `${BASE_URL}/go/${s}`).join(" "),
    entry.plannedDestination,
    entry.destination,
    entry.group,
    entry.codeId,
    EVENT_NAME,
    entry.section,
    entry.codeId,
    QR_SOURCE,
    QR_MEDIUM,
    QR_CAMPAIGN,
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
console.log("✓  QR-Reference-Sheet.csv (37 rows)");

// ── PDF ──────────────────────────────────────────────────────────────────────

const doc = new jsPDF({
  orientation: "landscape",
  unit: "mm",
  format: "a4",
  compress: true,
});

const PAGE_W = 297;
const PAGE_H = 210;
const MARGIN = 14;
const COLS = 3;
const ROWS = 4;
const PER_PAGE = COLS * ROWS;
const GRID_TOP = 25;
const ROW_H = 45;
const COL_W = (PAGE_W - MARGIN * 2) / COLS;
const QR_SIZE = 30;
const TOTAL_PAGES = Math.ceil(GUIDE_QR_REDIRECTS_NEW.length / PER_PAGE);

// Embed 480 px renderings in the PDF (≈400 dpi at 30 mm). The standalone PNG
// assets remain 1200 × 1200 px as required; this only keeps the PDF portable.
// Use encodedSlug when present so the PDF QR always matches the printed
// artwork; otherwise the canonical slug is used.
const qrDataUrls = await Promise.all(
  GUIDE_QR_REDIRECTS_NEW.map((entry) =>
    QRCode.toDataURL(`${BASE_URL}/go/${entry.encodedSlug ?? entry.slug}`, {
      errorCorrectionLevel: "H",
      margin: 4,
      width: 480,
      color: { dark: "#000000", light: "#ffffff" },
    }),
  ),
);

function drawPageHeader() {
  doc.setFillColor(31, 42, 36);
  doc.rect(0, 0, PAGE_W, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(
    "Ahangama.com — New Physical Guide QR Codes (37)",
    MARGIN,
    12.5,
  );
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Campaign: ahangama_guide_2026_27  ·  Event: qr_scan  ·  Source: physical_guide / qr",
    PAGE_W - MARGIN,
    12.5,
    { align: "right" },
  );
}

GUIDE_QR_REDIRECTS_NEW.forEach((entry, idx) => {
  const pageIndex = Math.floor(idx / PER_PAGE);
  const positionOnPage = idx % PER_PAGE;

  if (positionOnPage === 0) {
    if (pageIndex > 0) doc.addPage();
    drawPageHeader();
  }

  const row = Math.floor(positionOnPage / COLS);
  const col = positionOnPage % COLS;
  const cellX = MARGIN + col * COL_W;
  const cellY = GRID_TOP + row * ROW_H;

  // QR image (centred in its column)
  const qrX = cellX + (COL_W - QR_SIZE) / 2;
  doc.addImage(
    qrDataUrls[idx],
    "PNG",
    qrX,
    cellY,
    QR_SIZE,
    QR_SIZE,
  );

  // Title
  const titleY = cellY + QR_SIZE + 4.5;
  doc.setTextColor(31, 42, 36);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  const titleLines = doc
    .splitTextToSize(entry.label, COL_W - 6)
    .slice(0, 2);
  titleLines.forEach((line, lineIndex) => {
    doc.text(line, cellX + COL_W / 2, titleY + lineIndex * 3.4, {
      align: "center",
    });
  });

  // Encoded URL (the exact URL printed into this QR code)
  const urlY = titleY + titleLines.length * 3.4 + 2.2;
  doc.setTextColor(90, 100, 95);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.6);
  doc.text(
    `${BASE_URL}/go/${entry.encodedSlug ?? entry.slug}`,
    cellX + COL_W / 2,
    urlY,
    { align: "center" },
  );

  // Faint cell separator
  if (row < ROWS - 1) {
    doc.setDrawColor(225, 218, 205);
    doc.setLineWidth(0.15);
    doc.line(
      cellX + 3,
      cellY + ROW_H - 1.5,
      cellX + COL_W - 3,
      cellY + ROW_H - 1.5,
    );
  }
});

// Page numbers + footer on every page
const pageCount = doc.getNumberOfPages();
for (let p = 1; p <= pageCount; p += 1) {
  doc.setPage(p);
  doc.setTextColor(130, 120, 110);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text(
    `Page ${p} of ${pageCount}`,
    PAGE_W - MARGIN,
    PAGE_H - 5,
    { align: "right" },
  );
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
console.log(
  `\nReference sheets written to ahangama-guide-qr-codes-new/ (${TOTAL_PAGES} planned pages)\n`,
);
