import {
  createBookingRequestsForInterests,
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

function normalizeIsoTimestamp(value) {
  const normalized = normalizeOptionalText(value);

  if (!normalized) {
    return null;
  }

  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    throw new Error("signupDate must be a valid timestamp");
  }

  return date.toISOString();
}

const MAX_INTEREST_SELECTIONS = 3;

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
    let bookingInterests;
    let signupDate;

    try {
      interests = normalizeStringArray(body.interests, "interests");
      bookingInterests = normalizeStringArray(
        body.bookingInterests ??
          body.servicesInterestedIn ??
          body.servicesInterested,
        "bookingInterests",
      );
      signupDate = normalizeIsoTimestamp(body.signupDate);
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: error.message }),
      };
    }

    if (interests && interests.length > MAX_INTEREST_SELECTIONS) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Please select up to 3 interests" }),
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

    const whatsappOptIn = normalizeBoolean(
      body.whatsappOptIn ?? body.wantsWhatsappRecommendations,
      true,
    );
    const sourceHotel = normalizeOptionalText(
      body.sourceHotel ?? body.sourceHotelSlug ?? pass.sourceHotelSlug,
    );
    const source = normalizeOptionalText(body.source) || "complimentary-pass";
    const destination = normalizeOptionalText(body.destination) || "ahangama";
    const completedAt = signupDate || new Date().toISOString();

    console.log("update-hotel-guest-preferences request", {
      passId,
      guestId: pass.guestId,
      sourceHotel,
      source,
      destination,
    });

    const preferences = await updateGuestPreferences(passId, {
      ...(body.stayLength !== undefined ? { stayLength: body.stayLength } : {}),
      ...(interests !== undefined ? { interests } : {}),
      ...(body.travelGroup !== undefined
        ? { travelGroup: normalizeOptionalText(body.travelGroup) }
        : {}),
      ...(bookingInterests !== undefined ? { bookingInterests } : {}),
      whatsappOptIn,
      completedAt,
    });

    const bookingRequests = await createBookingRequestsForInterests({
      guestId: pass.guestId,
      passId,
      bookingInterests,
      notes: "Created from complimentary pass preferences",
    });

    await updatePassGuestById(pass.guestId, {
      ...(body.country !== undefined
        ? { country: normalizeOptionalText(body.country) }
        : {}),
      ...(destination ? { destination } : {}),
      whatsappOptIn,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        preferences,
        bookingRequestsCreated: bookingRequests.length,
        metadata: {
          sourceHotel,
          signupDate: completedAt,
          source,
          destination,
        },
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
