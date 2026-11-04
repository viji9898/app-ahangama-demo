import process from "node:process";
import { google } from "googleapis";

/*
 * Google Analytics 4 Data API access.
 *
 * Credentials stay server-side. Supported configuration:
 *
 *   GA4_PROPERTY_ID                 numeric property id (required)
 *   GA4_SERVICE_ACCOUNT_JSON        service-account JSON (single line)
 *   GA4_SERVICE_ACCOUNT_EMAIL       service-account client_email
 *   GA4_SERVICE_ACCOUNT_PRIVATE_KEY service-account private_key
 *   GOOGLE_APPLICATION_CREDENTIALS  path to a service-account file (ADC)
 *
 * When GA4 is not configured, callers must treat the report as
 * unavailable rather than as zero traffic. `isGa4Configured()` lets them
 * tell the difference.
 */

const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

let cachedClient = null;
let cachedCredentials = undefined;

function readCredentials() {
  if (cachedCredentials !== undefined) return cachedCredentials;

  const raw =
    process.env.GA4_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    "";

  if (raw) {
    try {
      cachedCredentials = JSON.parse(raw);
      return cachedCredentials;
    } catch {
      throw new Error("GA4_SERVICE_ACCOUNT_JSON is not valid JSON");
    }
  }

  const email =
    process.env.GA4_SERVICE_ACCOUNT_EMAIL ||
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    "";
  const privateKey = (
    process.env.GA4_SERVICE_ACCOUNT_PRIVATE_KEY ||
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ||
    ""
  ).replace(/\\n/g, "\n");

  if (email && privateKey) {
    cachedCredentials = { client_email: email, private_key: privateKey };
    return cachedCredentials;
  }

  cachedCredentials = null;
  return cachedCredentials;
}

export function getGa4PropertyId() {
  return String(process.env.GA4_PROPERTY_ID || "").trim();
}

export function isGa4Configured() {
  return Boolean(getGa4PropertyId());
}

export function hasExplicitCredentials() {
  try {
    return Boolean(readCredentials());
  } catch {
    return false;
  }
}

function getClient() {
  if (!isGa4Configured()) return null;

  if (!cachedClient) {
    const credentials = readCredentials();
    const auth = new google.auth.GoogleAuth({
      scopes: [SCOPE],
      ...(credentials ? { credentials } : {}),
    });
    cachedClient = google.analyticsdata({ version: "v1beta", auth });
  }

  return cachedClient;
}

function describeError(error) {
  const message = String(error?.message || error || "Unknown GA4 error");
  const lower = message.toLowerCase();

  let code = "GA4_REQUEST_FAILED";
  if (
    lower.includes("unknown dimension") ||
    lower.includes("not a valid dimension") ||
    lower.includes("custom dimension") ||
    lower.includes("invalid dimension")
  ) {
    code = "GA4_DIMENSION_UNAVAILABLE";
  } else if (
    lower.includes("permission") ||
    lower.includes("forbidden") ||
    lower.includes("403")
  ) {
    code = "GA4_PERMISSION_DENIED";
  } else if (lower.includes("invalid property") || lower.includes("property id")) {
    code = "GA4_PROPERTY_INVALID";
  }

  return { code, message };
}

/**
 * Run a single Data API report.
 *
 * Returns `{ ok: true, rows, totals }` or `{ ok: false, error }` so a
 * single unsupported dimension never breaks the whole statistics page.
 */
export async function runGa4Report(requestBody) {
  let client;

  try {
    client = getClient();
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "GA4_CREDENTIALS_INVALID",
        message: error.message || "GA4 credentials could not be loaded",
      },
    };
  }

  if (!client) {
    return {
      ok: false,
      error: {
        code: "GA4_NOT_CONFIGURED",
        message:
          "GA4_PROPERTY_ID is not set. Add the GA4 property id and a service-account credential in Netlify environment variables.",
      },
    };
  }

  try {
    const response = await client.properties.runReport({
      property: `properties/${getGa4PropertyId()}`,
      requestBody,
    });
    const result = response?.data || {};
    return {
      ok: true,
      rows: Array.isArray(result.rows) ? result.rows : [],
      totals: Array.isArray(result.totals) ? result.totals : [],
      rowCount: result.rowCount || 0,
    };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}

export function metricValue(row, index = 0) {
  const raw = row?.metricValues?.[index]?.value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function dimensionValue(row, index = 0) {
  return String(row?.dimensionValues?.[index]?.value || "");
}
