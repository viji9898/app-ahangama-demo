import { CARD_PRODUCT, CARD_PRODUCTS } from "../data/cardConfig";

const KEY_CARDS = "ahangama_cards_v1";
const KEY_REDEMPTIONS = "ahangama_card_redemptions_v1";

function hasStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson(key, fallback) {
  if (!hasStorage()) return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (!hasStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function sortNewestFirst(items, key) {
  return [...items].sort(
    (left, right) => Date.parse(right[key] || 0) - Date.parse(left[key] || 0)
  );
}

function yyyyMmDd(date = new Date()) {
  return new Date(date).toISOString().slice(0, 10);
}

function deriveProduct(productId, validityDays) {
  if (productId && CARD_PRODUCTS[productId]) {
    return CARD_PRODUCTS[productId];
  }

  return (
    Object.values(CARD_PRODUCTS).find(
      (product) => Number(product.validityDays) === Number(validityDays)
    ) || CARD_PRODUCT
  );
}

export function normalizeQrCode(input) {
  if (!input) return "";

  const value = String(input).trim();
  if (!value) return "";

  if (value.includes("?qr=")) {
    try {
      const params = new URLSearchParams(value.split("?")[1]);
      return decodeURIComponent(params.get("qr") || value).trim();
    } catch {
      return value;
    }
  }

  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value;
  }
}

export function makeCardId() {
  return `AHG-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now()
    .toString()
    .slice(-6)}`;
}

function upsertCard(card) {
  const cards = listCards().filter((existing) => existing.cardId !== card.cardId);
  cards.unshift(card);
  writeJson(KEY_CARDS, cards);
  return card;
}

export function issuePurchasedCard(data = {}) {
  const product = deriveProduct(data.productId, data.validityDays);
  const purchaseDate = data.purchaseDate || new Date().toISOString();
  const startDate = data.startDate || purchaseDate;
  const validityDays = Number(data.validityDays || product.validityDays || 0);
  const expiryDate =
    data.expiryDate ||
    new Date(
      Date.parse(startDate) + validityDays * 24 * 60 * 60 * 1000
    ).toISOString();
  const qrCode = normalizeQrCode(data.qrCode) || makeCardId();

  const card = {
    id: qrCode,
    cardId: qrCode,
    qrCode,
    sessionId: data.sessionId || null,
    productId: data.productId || product.id,
    productName: data.productName || product.name,
    priceUsd:
      data.priceUsd !== undefined && data.priceUsd !== null
        ? String(data.priceUsd)
        : String(product.priceUsd || "0"),
    validityDays,
    maxPeople: Number(data.maxPeople || product.maxPeople || 1),
    customerName: data.customerName || data.purchaserName || "Guest",
    customerEmail: data.customerEmail || "",
    customerPhone: data.customerPhone || "",
    purchaseDate,
    startDate,
    expiryDate,
    validFrom: startDate,
    validTo: expiryDate,
    isActive: data.isActive ?? true,
    status: data.status || "active",
    createdAt: data.createdAt || purchaseDate,
    updatedAt: new Date().toISOString(),
  };

  return upsertCard(card);
}

export function issueCard({ purchaserName = "Guest" } = {}) {
  return issuePurchasedCard({
    customerName: purchaserName,
    productId: CARD_PRODUCT.id,
    productName: CARD_PRODUCT.name,
    validityDays: CARD_PRODUCT.validityDays,
    maxPeople: CARD_PRODUCT.maxPeople,
    priceUsd: CARD_PRODUCT.priceUsd,
  });
}

export function listCards() {
  return sortNewestFirst(readJson(KEY_CARDS, []), "purchaseDate");
}

export function getCard(cardId) {
  const normalized = normalizeQrCode(cardId);
  return (
    listCards().find(
      (card) => card.cardId === normalized || card.qrCode === normalized
    ) || null
  );
}

export function getLatestCard() {
  return listCards()[0] || null;
}

export function listRedemptions() {
  return sortNewestFirst(readJson(KEY_REDEMPTIONS, []), "redeemedAt");
}

export function getRedemptionsForCard(cardId) {
  const normalized = normalizeQrCode(cardId);
  return listRedemptions().filter(
    (redemption) =>
      redemption.cardId === normalized || redemption.qrCode === normalized
  );
}

export function isCardValidNow(card) {
  if (!card) return { ok: false, reason: "Card not found" };
  if (card.status !== "active" || card.isActive === false) {
    return { ok: false, reason: `Card is ${card.status || "inactive"}` };
  }

  const now = Date.now();
  const from = Date.parse(card.startDate || card.validFrom);
  const to = Date.parse(card.expiryDate || card.validTo);

  if (Number.isNaN(from) || Number.isNaN(to)) {
    return { ok: false, reason: "Invalid date on card" };
  }
  if (now < from) return { ok: false, reason: "Card not active yet" };
  if (now > to) return { ok: false, reason: "Card expired" };

  return { ok: true };
}

export function canRedeem({ cardId, venueId, date = new Date() }) {
  const normalized = normalizeQrCode(cardId);
  const dateKey = yyyyMmDd(date);
  const alreadyRedeemed = listRedemptions().some(
    (redemption) =>
      redemption.cardId === normalized &&
      redemption.venueId === venueId &&
      yyyyMmDd(redemption.redeemedAt) === dateKey
  );

  return { ok: !alreadyRedeemed, dateKey };
}

export function verifyCardByCode(qrCode) {
  const actualQrCode = normalizeQrCode(qrCode);

  if (!actualQrCode) {
    return { valid: false, expired: false, error: "QR code required" };
  }

  const card = getCard(actualQrCode);
  if (!card) {
    return { valid: false, expired: false, error: "Pass not found" };
  }

  const validity = isCardValidNow(card);
  const redemptions = getRedemptionsForCard(card.cardId);

  return {
    valid: validity.ok,
    expired: !validity.ok && validity.reason === "Card expired",
    error: validity.ok ? null : validity.reason,
    purchase: {
      ...card,
      redemptionCount: redemptions.length,
    },
  };
}

export function redeemCard({
  qrCode,
  venueId,
  venueName,
  venueCategory,
  redemptionType,
  customOffer,
  offerUsed,
  vendorPin,
}) {
  const verification = verifyCardByCode(qrCode);
  if (!verification.valid) {
    return {
      success: false,
      error: verification.error || "Pass is not valid for redemption.",
    };
  }

  if (vendorPin !== "1234") {
    return { success: false, error: "Invalid venue PIN." };
  }

  const redemptionCheck = canRedeem({
    cardId: verification.purchase.cardId,
    venueId,
  });

  if (!redemptionCheck.ok) {
    return {
      success: false,
      error: "Pass already redeemed today at this venue.",
    };
  }

  const redemption = {
    id: `${verification.purchase.cardId}-${venueId}-${Date.now()}`,
    purchaseId: verification.purchase.id,
    cardId: verification.purchase.cardId,
    qrCode: verification.purchase.qrCode,
    venueId,
    venueName,
    venueCategory,
    redeemedAt: new Date().toISOString(),
    redemptionType,
    offerUsed: customOffer || offerUsed || "Offer redeemed",
    verifiedByStaff: "local-vendor",
    customerName: verification.purchase.customerName,
    customerEmail: verification.purchase.customerEmail,
    customerPhone: verification.purchase.customerPhone,
    productName: verification.purchase.productName,
    createdAt: new Date().toISOString(),
  };

  const redemptions = listRedemptions();
  redemptions.unshift(redemption);
  writeJson(KEY_REDEMPTIONS, redemptions);

  return {
    success: true,
    purchase: verification.purchase,
    redemption,
    message: `${verification.purchase.productName} redeemed at ${venueName}!`,
  };
}

export function seedDemoData() {
  const seeded = [
    issuePurchasedCard({
      qrCode: "AHG-P15-DEMO001",
      sessionId: "demo_session_001",
      productId: "week",
      productName: CARD_PRODUCTS.week.name,
      priceUsd: CARD_PRODUCTS.week.priceUsd,
      validityDays: CARD_PRODUCTS.week.validityDays,
      maxPeople: 1,
      customerName: "Demo Guest",
      customerEmail: "demo1@example.com",
      customerPhone: "+94770000001",
      purchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(),
    }),
    issuePurchasedCard({
      qrCode: "AHG-P30-DEMO002",
      sessionId: "demo_session_002",
      productId: "standard",
      productName: CARD_PRODUCTS.standard.name,
      priceUsd: CARD_PRODUCTS.standard.priceUsd,
      validityDays: CARD_PRODUCTS.standard.validityDays,
      maxPeople: 1,
      customerName: "Ahangama Visitor",
      customerEmail: "demo2@example.com",
      customerPhone: "+94770000002",
      purchaseDate: new Date().toISOString(),
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }),
  ];

  const redemption = redeemCard({
    qrCode: seeded[0].qrCode,
    venueId: "demo-venue",
    venueName: "Demo Venue",
    venueCategory: "eat",
    redemptionType: "discount",
    offerUsed: "10% Off",
    vendorPin: "1234",
  });

  return {
    purchasesCreated: seeded.length,
    redemptionsCreated: redemption.success ? 1 : 0,
    customers: seeded.length,
    summary: {
      totalRevenue: seeded
        .reduce((sum, card) => sum + Number(card.priceUsd || 0), 0)
        .toFixed(2),
    },
  };
}
