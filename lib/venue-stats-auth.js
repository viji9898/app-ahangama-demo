import process from "node:process";
import {
  guideAdminUnauthorizedResponse,
  isGuideAdminAuthorized,
} from "./guide-admin-auth.js";

/*
 * Temporary preview switch for the venue statistics pages.
 *
 * Set `VENUE_STATS_AUTH_DISABLED=1` in `.env` to browse the reports without
 * entering the admin password. The bypass is deliberately ignored when
 * Netlify reports `CONTEXT=production`, so a production deploy can never be
 * opened by accident. Remove the variable (or set it to anything else) to
 * restore the normal password gate.
 */

export function isVenueStatsAuthDisabled() {
  if (process.env.VENUE_STATS_AUTH_DISABLED !== "1") return false;
  if (process.env.CONTEXT === "production") return false;
  return true;
}

export function isVenueStatsAuthorized(headers = {}) {
  return isVenueStatsAuthDisabled() || isGuideAdminAuthorized(headers);
}

export function venueStatsUnauthorizedResponse() {
  return guideAdminUnauthorizedResponse();
}
