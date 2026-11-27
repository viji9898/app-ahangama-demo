#!/usr/bin/env node
/**
 * check-guide-qr-destinations-tasklist.mjs
 *
 * Checks every confirmed destination in the task-list batch. Relative paths are
 * resolved against https://ahangama.com. The script follows redirects and
 * reports any non-2xx response.
 *
 * Run with:  node scripts/check-guide-qr-destinations-tasklist.mjs
 */

import { GUIDE_QR_REDIRECTS_TASKLIST as ENTRIES } from "../src/data/guideQrRedirectsTasklist.js";

const BASE_URL = "https://ahangama.com";

const urls = [];
for (const entry of ENTRIES) {
  if (entry.status !== "confirmed") continue;
  const url = entry.destination.startsWith("http")
    ? entry.destination
    : `${BASE_URL}${entry.destination}`;
  if (!urls.includes(url)) urls.push(url);
}

const results = [];
let cursor = 0;

async function worker() {
  while (cursor < urls.length) {
    const url = urls[cursor];
    cursor += 1;
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; AhangamaQRCheck/1.0)",
        },
        signal: AbortSignal.timeout(30000),
      });
      results.push({ url, status: response.status, final: response.url });
    } catch (error) {
      results.push({
        url,
        status: "ERR",
        error: String(error?.message || error),
      });
    }
  }
}

await Promise.all(Array.from({ length: 8 }, worker));

const counts = {};
for (const result of results) {
  counts[result.status] = (counts[result.status] || 0) + 1;
}
console.log("HTTP status counts:", counts);
console.log(`Checked ${results.length} unique confirmed destinations.`);

const failures = results.filter(
  (result) => result.status === "ERR" || result.status >= 400,
);
if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  failures.forEach((failure) =>
    console.error(`  - ${failure.status} ${failure.url} ${failure.error ?? ""}`),
  );
  process.exit(1);
}
console.log("All confirmed destinations responded with a 2xx status.");
