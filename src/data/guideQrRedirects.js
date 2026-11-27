/**
 * guideQrRedirects.js
 *
 * Central redirect mapping for the Physical Ahangama Guide QR codes.
 *
 * HOW TO CHANGE A DESTINATION
 * ----------------------------
 * Find the section entry below and update `destination` to the new path or URL.
 * The printed QR codes never change — only this file needs editing.
 *
 * FIELD REFERENCE
 * ---------------
 * slug          – the URL segment after /go/  (do not change after printing)
 * section       – short section key sent as `qr_section` in GA4
 * codeId        – unique QR code ID sent as `qr_code_id` in GA4
 * destination   – where to redirect (absolute URL or root-relative path)
 * label         – human-readable section name for reference sheets
 *
 * NEW QR CODES (39)
 * -----------------
 * The 39 newer Physical Guide QR codes live in `guideQrRedirectsNew.js` and
 * are looked up by `getQrRedirect()` below. They are kept in a separate file
 * so the original seven entries above stay untouched.
 *
 * TASK-LIST QR CODES (180)
 * ------------------------
 * The 20 November 2026 task-list batch lives in
 * `guideQrRedirectsTasklist.js`. It covers the five advertiser QR codes, five
 * provisional "Five Ways to Continue Your Sri Lankan Story" routes, and one QR
 * code for every live guide place. It is also kept separate so neither earlier
 * batch is modified.
 */

import { getNewQrRedirect } from "./guideQrRedirectsNew.js";
import { getTasklistQrRedirect } from "./guideQrRedirectsTasklist.js";

export const QR_CAMPAIGN = "ahangama_guide_2026_27";
export const QR_SOURCE   = "physical_guide";
export const QR_MEDIUM   = "qr";

/** @type {Array<{slug: string, section: string, codeId: string, destination: string, label: string}>} */
export const GUIDE_QR_REDIRECTS = [
  {
    slug:        "eats",
    section:     "eats",
    codeId:      "qr_best_eats",
    destination: "/guide#best-eats",
    label:       "Best Eats",
  },
  {
    slug:        "stays",
    section:     "stays",
    codeId:      "qr_best_stays",
    destination: "/stays",
    label:       "Best Stays",
  },
  {
    slug:        "wellness",
    section:     "wellness",
    codeId:      "qr_best_wellness",
    destination: "/guide#wellness",
    label:       "Best Wellness",
  },
  {
    slug:        "beaches-surf",
    section:     "beaches_surf",
    codeId:      "qr_beaches_surf",
    destination: "/guide#surf-schools",
    label:       "Best Beaches & Surf",
  },
  {
    slug:        "experiences",
    section:     "experiences",
    codeId:      "qr_experiences",
    destination: "/guide#best-experiences",
    label:       "Best Experiences",
  },
  {
    slug:        "events",
    section:     "events",
    codeId:      "qr_whats_on",
    destination: "https://ahangama.com/events/",
    label:       "What's On in Ahangama",
  },
  {
    slug:        "transport",
    section:     "transport",
    codeId:      "qr_transport",
    destination: "/transport-rates",
    label:       "Transport",
  },
];

/**
 * Returns the redirect config for a given /go/ slug, or null if not found.
 * Checks the original seven codes first, then the 39 newer codes, then the
 * 180 task-list codes.
 * @param {string} slug
 */
export function getQrRedirect(slug) {
  return (
    GUIDE_QR_REDIRECTS.find((r) => r.slug === slug) ??
    getNewQrRedirect(slug) ??
    getTasklistQrRedirect(slug)
  );
}

