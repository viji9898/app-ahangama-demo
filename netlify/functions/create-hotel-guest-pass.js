import { createHotelGuestPass } from "../../lib/hotel-passes-db.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_SOURCE_HOTEL_SLUG = "lighthouse-hotel";
const DEFAULT_PASS_TYPE = "complimentary_hotel_guest";
const DEFAULT_STATUS = "active";
const DEFAULT_VALIDITY_DAYS = 7;

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

    const validFrom = startOfUtcDay();
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        guest: result.guest,
        pass: result.pass,
        preferences: result.preferences,
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