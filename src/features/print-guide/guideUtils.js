import {
  COMMERCIAL_EQUIVALENTS,
  COMMERCIAL_LABELS,
  GUIDE_SECTIONS,
} from "./guideData";

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function getCommercialInventory(pages) {
  return pages
    .filter((page) => page.commercial.enabled)
    .map((page) => ({
      pageNumber: page.pageNumber,
      section: GUIDE_SECTIONS[page.section]?.label || page.section,
      position:
        COMMERCIAL_LABELS[page.commercial.type] || page.commercial.type,
      ...page.commercial,
    }));
}

export function calculateGuideMetrics(pages) {
  const inventory = getCommercialInventory(pages);
  const sumByStatus = (status) =>
    inventory
      .filter((position) => position.status === status)
      .reduce((total, position) => total + Number(position.rate || 0), 0);
  const commercialPageEquivalent = inventory.reduce(
    (total, position) =>
      total + (COMMERCIAL_EQUIVALENTS[position.type] || 0),
    0,
  );
  const utilityTypes = new Set([
    "contents",
    "map",
    "essential-info",
    "directory",
    "welcome",
    "introduction",
    "overview",
  ]);
  const commercialPages = new Set(
    inventory.map((position) => position.pageNumber),
  );
  const otherPages = pages.filter(
    (page) =>
      !commercialPages.has(page.pageNumber) && utilityTypes.has(page.pageType),
  ).length;

  return {
    pageCount: pages.length,
    inventoryCount: inventory.length,
    editorialPages: pages.length - commercialPages.size - otherPages,
    commercialPages: commercialPages.size,
    otherPages,
    potentialRevenue: inventory.reduce(
      (total, position) => total + Number(position.rate || 0),
      0,
    ),
    soldRevenue: sumByStatus("sold"),
    reservedRevenue: sumByStatus("reserved"),
    availableRevenue: sumByStatus("available"),
    soldCount: inventory.filter((position) => position.status === "sold").length,
    reservedCount: inventory.filter(
      (position) => position.status === "reserved",
    ).length,
    availableCount: inventory.filter(
      (position) => position.status === "available",
    ).length,
    commercialPageEquivalent,
    commercialPercentage: pages.length
      ? (commercialPageEquivalent / pages.length) * 100
      : 0,
  };
}

export function clampPageNumber(value, pageCount) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 1;
  return Math.min(Math.max(parsed, 1), pageCount);
}

export function getSpreadStart(pageNumber, pageCount) {
  const clamped = clampPageNumber(pageNumber, pageCount);
  if (clamped === 1) return 1;
  if (clamped === pageCount) return pageCount - 1;
  return clamped % 2 === 0 ? clamped : clamped - 1;
}