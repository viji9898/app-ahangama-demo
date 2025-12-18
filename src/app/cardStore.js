import { CARD_PRODUCT } from "../data/cardConfig";

const KEY_CARDS = "ahangama_cards_v1"; // array of issued cards
const KEY_REDEEMS = "ahangama_card_redeems_v1"; // map: `${cardId}|${venueId}|${yyyy-mm-dd}` => true

function readJson(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function makeCardId() {
  // human-ish ID, good enough for MVP
  return `AHG-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}-${Date.now().toString().slice(-6)}`;
}

export function issueCard({ purchaserName = "Guest" } = {}) {
  const now = new Date();
  const validFrom = now.toISOString();
  const validTo = new Date(
    now.getTime() + CARD_PRODUCT.validityDays * 24 * 60 * 60 * 1000
  ).toISOString();

  const card = {
    cardId: makeCardId(),
    purchaserName,
    validFrom,
    validTo,
    status: "active",
  };

  const cards = readJson(KEY_CARDS, []);
  cards.unshift(card);
  writeJson(KEY_CARDS, cards);

  return card;
}

export function listCards() {
  return readJson(KEY_CARDS, []);
}

export function getCard(cardId) {
  return listCards().find((c) => c.cardId === cardId) || null;
}

export function getLatestCard() {
  return listCards()[0] || null;
}

export function isCardValidNow(card) {
  if (!card) return { ok: false, reason: "Card not found" };
  if (card.status !== "active")
    return { ok: false, reason: `Card is ${card.status}` };

  const now = Date.now();
  const from = Date.parse(card.validFrom);
  const to = Date.parse(card.validTo);

  if (Number.isNaN(from) || Number.isNaN(to))
    return { ok: false, reason: "Invalid date on card" };
  if (now < from) return { ok: false, reason: "Card not active yet" };
  if (now > to) return { ok: false, reason: "Card expired" };

  return { ok: true };
}

function yyyyMmDd(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function canRedeem({ cardId, venueId }) {
  const dateKey = yyyyMmDd();
  const key = `${cardId}|${venueId}|${dateKey}`;
  const redeems = readJson(KEY_REDEEMS, {});
  return { ok: !redeems[key], key, dateKey };
}

export function redeem({ cardId, venueId }) {
  const dateKey = yyyyMmDd();
  const key = `${cardId}|${venueId}|${dateKey}`;

  const redeems = readJson(KEY_REDEEMS, {});
  redeems[key] = true;
  writeJson(KEY_REDEEMS, redeems);

  return { ok: true, key, dateKey };
}
