import { getPassVerificationByCode } from "../../lib/hotel-passes-db.js";

function jsonHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Cache-Control": "no-store",
  };
}

function normalizeText(value) {
  return String(value || "").trim();
}

function extractCode(event) {
  const params = event.queryStringParameters || {};
  const explicitCode = normalizeText(params.code || params.id || params.pass);

  if (explicitCode) {
    return explicitCode;
  }

  const rawQuery = normalizeText(event.rawQueryString || event.rawQuery || "");

  if (!rawQuery) {
    return "";
  }

  const firstPart = rawQuery.split("&")[0] || "";

  if (firstPart.includes("=")) {
    return normalizeText(firstPart.split("=")[1]);
  }

  return normalizeText(firstPart);
}

function formatDate(value) {
  const date = new Date(value || "");

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function calculateDaysRemaining(validUntil, now = new Date()) {
  const end = new Date(validUntil || "");

  if (Number.isNaN(end.getTime())) {
    return null;
  }

  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86400000));
}

function isValidPass(pass, now = new Date()) {
  const validFrom = new Date(pass?.validFrom || "");
  const validUntil = new Date(pass?.validUntil || "");

  if (pass?.status !== "active") {
    return false;
  }

  if (Number.isNaN(validFrom.getTime()) || Number.isNaN(validUntil.getTime())) {
    return false;
  }

  return validFrom.getTime() <= now.getTime() && validUntil.getTime() >= now.getTime();
}

function publicPass(pass, now = new Date()) {
  const valid = isValidPass(pass, now);

  return {
    code: pass.verificationCode,
    status: valid ? "valid" : "expired",
    isValid: valid,
    passholder: {
      name: pass.fullName || "Guest",
      email: pass.email || null,
      phone: pass.phone || null,
    },
    pass: {
      sourceHotelSlug: pass.sourceHotelSlug,
      destination: pass.destination,
      passType: pass.passType,
      validFrom: formatDate(pass.validFrom),
      validUntil: formatDate(pass.validUntil),
      daysRemaining: calculateDaysRemaining(pass.validUntil, now),
      issuedAt: formatDate(pass.issuedAt),
    },
  };
}

export const handler = async (event) => {
  const headers = jsonHeaders();

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const code = extractCode(event).toLowerCase();

  if (!code) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Pass verification code is required" }),
    };
  }

  try {
    const pass = await getPassVerificationByCode(code);

    if (!pass) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          code,
          status: "not_found",
          isValid: false,
          error: "Pass not found",
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(publicPass(pass)),
    };
  } catch (error) {
    console.error("validate-pass error:", {
      code,
      message: error?.message || "Unable to validate pass",
    });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Unable to validate pass" }),
    };
  }
};
