import {
  getPassById,
  updateGuestPreferences,
  updatePassGuestById,
} from "../../lib/hotel-passes-db.js";

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

function normalizeOptionalText(value) {
  const normalized = normalizeText(value);
  return normalized || null;
}

function normalizeBoolean(value, fallback = false) {
  if (value === null || value === undefined) {
    return fallback;
  }

  return Boolean(value);
}

function normalizeStringArray(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }

  return value.map((item) => normalizeText(item)).filter(Boolean);
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
    const passId = normalizeText(body.passId);

    if (!passId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "passId is required" }),
      };
    }

    let interests;
    let servicesInterested;

    try {
      interests = normalizeStringArray(body.interests, "interests");
      servicesInterested = normalizeStringArray(
        body.servicesInterested,
        "servicesInterested",
      );
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: error.message }),
      };
    }

    const pass = await getPassById(passId);

    if (!pass) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "Pass not found" }),
      };
    }

    const wantsWhatsappRecommendations = normalizeBoolean(
      body.wantsWhatsappRecommendations,
      false,
    );

    console.log("update-hotel-guest-preferences request", {
      passId,
      guestId: pass.guestId,
    });

    const preferences = await updateGuestPreferences(passId, {
      ...(body.stayLength !== undefined ? { stayLength: body.stayLength } : {}),
      ...(interests !== undefined ? { interests } : {}),
      ...(servicesInterested !== undefined ? { servicesInterested } : {}),
      wantsWhatsappRecommendations,
      completedAt: new Date().toISOString(),
    });

    await updatePassGuestById(pass.guestId, {
      ...(body.country !== undefined
        ? { country: normalizeOptionalText(body.country) }
        : {}),
      whatsappOptIn: wantsWhatsappRecommendations,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        preferences,
        nextStep: "success",
      }),
    };
  } catch (error) {
    console.error("update-hotel-guest-preferences error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || "Unable to update hotel guest preferences",
      }),
    };
  }
};