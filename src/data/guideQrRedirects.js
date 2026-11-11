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
 * NEW QR CODES (37)
 * -----------------
 * The 37 newer Physical Guide QR codes live in `guideQrRedirectsNew.js` and
 * are looked up by `getQrRedirect()` below. They are kept in a separate file
 * so the original seven entries above stay untouched.
 */

import { getNewQrRedirect } from "./guideQrRedirectsNew.js";

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
 * Checks the original seven codes first, then the 37 newer codes.
 * @param {string} slug
 */
export function getQrRedirect(slug) {
  return GUIDE_QR_REDIRECTS.find((r) => r.slug === slug) ?? getNewQrRedirect(slug);
}

