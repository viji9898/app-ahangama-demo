import {
  createHotelGuestPass,
  updatePasskitFields,
} from "../../lib/hotel-passes-db.js";
import { createPasskitMemberForHotelGuest } from "../../lib/passkit-client.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_SOURCE_HOTEL_SLUG = "lighthouse-hotel";
const DEFAULT_PASS_TYPE = "complimentary_hotel_guest";
const DEFAULT_STATUS = "active";
const DEFAULT_VALIDITY_DAYS = 15;

function jsonHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function startOfUtcDay(value = new Date()) {
  return new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()),
  );
}

function parseRequestedStartDate(value) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return null;
  }

  const parsed = new Date(`${normalized}T00:00:00.000Z`);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return startOfUtcDay(parsed);
}

function addUtcDays(value, days) {
  const next = new Date(value);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export const handler = async (event) => {
  const headers = jsonHeaders();

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const fullName = normalizeText(body.fullName);
    const email = normalizeEmail(body.email);
    const phone = normalizeText(body.phone);
    const sourceHotelSlug =
      normalizeText(body.sourceHotelSlug) || DEFAULT_SOURCE_HOTEL_SLUG;
    const requestedStartDate = parseRequestedStartDate(body.startDate);

    if (!fullName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Full name is required" }),
      };
    }

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Email is required" }),
      };
    }

    if (!EMAIL_PATTERN.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Please enter a valid email address" }),
      };
    }

    if (!phone) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Phone is required" }),
      };
    }

    if (body.startDate && !requestedStartDate) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Please choose a valid pass start date",
        }),
      };
    }

    const validFrom = requestedStartDate || startOfUtcDay();
    const validUntil = addUtcDays(validFrom, DEFAULT_VALIDITY_DAYS);

    console.log("create-hotel-guest-pass request", {
      sourceHotelSlug,
      emailDomain: email.split("@")[1] || "",
    });

    const result = await createHotelGuestPass({
      fullName,
      email,
      phone,
      sourceHotelSlug,
      passType: DEFAULT_PASS_TYPE,
      status: DEFAULT_STATUS,
      validFrom: validFrom.toISOString(),
      validUntil: validUntil.toISOString(),
    });

    let pass = result.pass;
    let passkitPending = false;
    let passkitError = null;

    try {
      const passkitData = await createPasskitMemberForHotelGuest({
        guest: result.guest,
        pass: result.pass,
        preferences: result.preferences,
        sourceHotelSlug,
      });

      pass = await updatePasskitFields(result.pass.id, {
        passkitProgramId: passkitData.passkitProgramId,
        passkitMemberId: passkitData.passkitMemberId,
        passkitExternalId: passkitData.passkitExternalId,
        passkitPassUrl: passkitData.passkitPassUrl,
        passkitInstallUrl: passkitData.passkitInstallUrl,
        passkitStatus: passkitData.passkitStatus,
        lastPasskitSyncAt: new Date().toISOString(),
      });
    } catch (error) {
      passkitPending = true;
      passkitError =
        "Pass creation is pending. Please try wallet installation shortly.";
      console.error("create-hotel-guest-pass passkit error:", {
        passId: result.pass.id,
        sourceHotelSlug,
        message: error?.message || "Unknown PassKit error",
        statusCode: error?.statusCode || null,
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        guest: result.guest,
        pass,
        preferences: result.preferences,
        passkitPending,
        passkitError,
        nextStep: "preferences",
      }),
    };
  } catch (error) {
    console.error("create-hotel-guest-pass error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || "Unable to create hotel guest pass",
      }),
    };
  }
};
