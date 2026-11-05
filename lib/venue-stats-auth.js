import process from "node:process";
import {
  guideAdminUnauthorizedResponse,
  isGuideAdminAuthorized,
} from "./guide-admin-auth.js";

/*
 * Temporary preview switch for the venue statistics pages.
 *
 * Set `VENUE_STATS_AUTH_DISABLED=1` in `.env` to browse the reports without
 * entering the admin password. The bypass is deliberately ignored outside
 * local development (production, deploy previews and branch deploys), so a
 * deployed site can never be opened by accident. Remove the variable (or set
 * it to anything else) to restore the normal password gate.
 */

export function isVenueStatsAuthDisabled() {
  if (process.env.VENUE_STATS_AUTH_DISABLED !== "1") return false;

  // Only local development may bypass the gate. Netlify sets CONTEXT to
  // "production", "deploy-preview", "branch-deploy" or "dev"; anything
  // other than a local/dev context keeps the password requirement.
  const context = String(process.env.CONTEXT || "").trim();
  if (context && context !== "dev" && context !== "development") return false;

  return true;
}

export function isVenueStatsAuthorized(headers = {}) {
  return isVenueStatsAuthDisabled() || isGuideAdminAuthorized(headers);
}

export function venueStatsUnauthorizedResponse() {
  return guideAdminUnauthorizedResponse();
}
