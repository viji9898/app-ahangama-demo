#!/usr/bin/env node

import dotenv from "dotenv";
import path from "node:path";
import process from "node:process";
import { PLACES } from "../src/data/places.js";
import {
  sendPromoCustomerEmail,
  sendPromoRedemptionVenueEmail,
  sendPromoTeamEmail,
} from "../lib/promo-purchase-emails.js";
import { getLatestPromoPurchaseByCustomerEmail } from "../lib/promo-purchases-db.js";

const TEST_RECIPIENT = "viji@viji.com";
const SOURCE_CUSTOMER_EMAIL = "test@viji.com";
const ENV_FILES = [".env", ".env.local", ".env.development", ".env.development.local"];
const HELP_TEXT = `
Usage:
  node scripts/test-promo-emails.js --customer
  node scripts/test-promo-emails.js --team
  node scripts/test-promo-emails.js --venue
  node scripts/test-promo-emails.js --all

All test emails are safely overridden to ${TEST_RECIPIENT}.
Source purchase: latest promo purchase for ${SOURCE_CUSTOMER_EMAIL} from the database.
`;

loadEnvFiles();

function loadEnvFiles() {
  for (const fileName of ENV_FILES) {
    dotenv.config({
      path: path.resolve(process.cwd(), fileName),
      override: false,
      quiet: true,
    });
  }
}

function parseFlags(argv = []) {
  const args = new Set(argv);
  const sendAll = args.has("--all");

  return {
    customer: sendAll || args.has("--customer"),
    team: sendAll || args.has("--team"),
    venue: sendAll || args.has("--venue"),
    help: args.has("--help") || args.has("-h"),
  };
}

function ensureSelection(flags) {
  return flags.customer || flags.team || flags.venue;
}

function titleCaseSlug(slug = "") {
  return String(slug)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function findPlaceBySlug(venueSlug) {
  return PLACES.find((place) => place.slug === venueSlug) || null;
}

async function getSourcePurchase() {
  const purchase = await getLatestPromoPurchaseByCustomerEmail(
    SOURCE_CUSTOMER_EMAIL,
  );

  if (!purchase) {
    throw new Error(
      `No promo purchase found for ${SOURCE_CUSTOMER_EMAIL}. Add a test purchase to the promo_purchases table and rerun the script.`,
    );
  }

  return purchase;
}

function buildTestVenue(purchase) {
  const place = findPlaceBySlug(purchase.venueSlug);

  return {
    name: place?.name || titleCaseSlug(purchase.venueSlug) || "Unknown venue",
  };
}

function buildTestRedemption(purchase, venue) {
  return {
    passId: purchase.passId,
    venueName: venue.name,
    venueSlug: purchase.venueSlug,
    redemptionType: "staff_scan",
    offerUsed: purchase.productDescription || purchase.productName || "Promo offer",
    redeemedAt: new Date().toISOString(),
    redeemedBy: "email-test-script",
  };
}

function buildTestPromotion() {
  return {
    venueEmail: TEST_RECIPIENT,
  };
}

function printSummary(flags, purchase) {
  const selected = [];

  if (flags.customer) selected.push("customer purchase email");
  if (flags.team) selected.push("team purchase email");
  if (flags.venue) selected.push("venue redemption email");

  console.log("Preparing promo email layout test");
  console.log(`Recipient override: ${TEST_RECIPIENT}`);
  console.log(`Source purchase email: ${SOURCE_CUSTOMER_EMAIL}`);
  console.log(`Customer on purchase: ${purchase.customerEmail || "Unknown"}`);
  console.log(`Venue slug: ${purchase.venueSlug || "Unknown"}`);
  console.log(`Pass ID: ${purchase.passId}`);
  console.log(`Selected templates: ${selected.join(", ")}`);
  console.log("");
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));

  if (flags.help) {
    console.log(HELP_TEXT.trim());
    process.exit(0);
  }

  if (!process.env.SENDGRID_API_KEY) {
    throw new Error(
      `SENDGRID_API_KEY is required to send promo test emails. Add it to one of: ${ENV_FILES.join(", ")} or run SENDGRID_API_KEY=your_key node test-promo-emails.js --all`,
    );
  }

  if (!ensureSelection(flags)) {
    console.error("Select at least one email type to send.\n");
    console.error(HELP_TEXT.trim());
    process.exit(1);
  }

  const purchase = await getSourcePurchase();
  const venue = buildTestVenue(purchase);
  const redemption = buildTestRedemption(purchase, venue);
  const promotion = buildTestPromotion();
  const overrideOptions = { recipientOverride: TEST_RECIPIENT };

  printSummary(flags, purchase);

  if (flags.customer) {
    await sendPromoCustomerEmail(purchase, overrideOptions);
    console.log(`Sent customer purchase email to ${TEST_RECIPIENT}`);
  }

  if (flags.team) {
    await sendPromoTeamEmail(purchase, venue, overrideOptions);
    console.log(`Sent team purchase email to ${TEST_RECIPIENT}`);
  }

  if (flags.venue) {
    await sendPromoRedemptionVenueEmail(
      purchase,
      redemption,
      promotion,
      overrideOptions,
    );
    console.log(`Sent venue redemption email to ${TEST_RECIPIENT}`);
  }
}

main().catch((error) => {
  console.error("Promo email test failed:", error.message || error);
  process.exit(1);
});