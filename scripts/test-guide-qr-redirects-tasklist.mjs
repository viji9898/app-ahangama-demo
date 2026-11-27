#!/usr/bin/env node
/**
 * test-guide-qr-redirects-tasklist.mjs
 *
 * Browser-level verification for the task-list batch.
 *
 * For every entry it:
 *   1. opens /go/<slug> on a running preview server,
 *   2. captures the gtag `qr_scan` call,
 *   3. waits for the client-side redirect,
 *   4. asserts exactly one event and the correct five GA4 parameters,
 *   5. asserts the redirect destination.
 *
 * Usage:
 *   npm run preview -- --port 4173 --strictPort
 *   node scripts/test-guide-qr-redirects-tasklist.mjs
 */

import { chromium } from "playwright";
import { GUIDE_QR_REDIRECTS_TASKLIST as ALL_ENTRIES } from "../src/data/guideQrRedirectsTasklist.js";

const BASE = process.env.QR_TEST_BASE ?? "http://localhost:4173";
const ONLY = (process.env.QR_TEST_SLUGS ?? "")
  .split(",")
  .map((slug) => slug.trim())
  .filter(Boolean);
const ENTRIES = ONLY.length
  ? ALL_ENTRIES.filter((entry) => ONLY.includes(entry.slug))
  : ALL_ENTRIES;
const EXPECTED = {
  qr_source: "physical_guide",
  qr_medium: "qr",
  qr_campaign: "ahangama_guide_2026_27",
};

const browser = await chromium.launch();
const context = await browser.newContext();

const events = [];
await context.exposeBinding("__gtagReport", (_source, payload) => {
  events.push(payload);
});

await context.addInitScript(() => {
  const queue = [];
  const originalPush = queue.push.bind(queue);
  queue.push = (...args) => {
    try {
      window.__gtagReport(JSON.parse(JSON.stringify(args)));
    } catch {
      // Ignore non-serialisable GTM internals.
    }
    return originalPush(...args);
  };
  Object.defineProperty(window, "dataLayer", {
    configurable: true,
    get() {
      return queue;
    },
    set() {
      // Keep the patched queue when index.html assigns window.dataLayer.
    },
  });
});

await context.route("**/*", (route) => {
  const url = new URL(route.request().url());
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
    return route.continue();
  }
  return route.abort();
});

const failures = [];
let passed = 0;

for (const entry of ENTRIES) {
  events.length = 0;
  const page = await context.newPage();
  const externalNavigations = [];
  page.on("request", (request) => {
    if (request.isNavigationRequest() && !request.url().startsWith(BASE)) {
      externalNavigations.push(request.url());
    }
  });

  const slug = entry.encodedSlug ?? entry.slug;
  const url = `${BASE}/go/${slug}`;
  const isExternal = entry.destination.startsWith("http");

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });

    if (isExternal) {
      await page
        .waitForRequest(
          (request) =>
            request.isNavigationRequest() &&
            !request.url().startsWith(BASE),
          { timeout: 8000 },
        )
        .catch(() => {
          throw new Error(
            `no external redirect (saw: ${externalNavigations.join(", ") || "none"})`,
          );
        });
    } else {
      await page.waitForURL(
        (next) => !new URL(next).pathname.startsWith("/go/"),
        { timeout: 8000 },
      );
      const finalUrl = new URL(page.url());
      const finalPath = `${finalUrl.pathname}${finalUrl.search}${finalUrl.hash}`;
      if (finalPath !== entry.destination) {
        throw new Error(`redirected to ${finalPath}, expected ${entry.destination}`);
      }
    }

    await page.waitForTimeout(150);

    const scans = events
      .map((payload) => payload?.[0])
      .filter((args) => args && args[0] === "event" && args[1] === "qr_scan");
    if (scans.length !== 1) {
      throw new Error(`expected exactly 1 qr_scan, saw ${scans.length}`);
    }
    const params = scans[0][2] ?? {};
    if (params.qr_section !== entry.section) {
      throw new Error(`qr_section ${params.qr_section} ≠ ${entry.section}`);
    }
    if (params.qr_code_id !== entry.codeId) {
      throw new Error(`qr_code_id ${params.qr_code_id} ≠ ${entry.codeId}`);
    }
    for (const [key, value] of Object.entries(EXPECTED)) {
      if (params[key] !== value) {
        throw new Error(`${key} ${params[key]} ≠ ${value}`);
      }
    }
    passed += 1;
  } catch (error) {
    failures.push(`${entry.slug}: ${error.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();

console.log(`Browser redirects + tracking OK: ${passed}/${ENTRIES.length}`);
if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log("Every task-list QR redirects once and fires exactly one correct qr_scan.");
