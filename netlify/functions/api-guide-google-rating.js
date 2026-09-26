import process from "node:process";

import {
  guideAdminUnauthorizedResponse,
  isGuideAdminAuthorized,
} from "../../lib/guide-admin-auth.js";

const headers = { "Content-Type": "application/json" };
const json = (statusCode, body) => ({ statusCode, headers, body: JSON.stringify(body) });

export const handler = async (event) => {
  if (!isGuideAdminAuthorized(event.headers)) {
    return guideAdminUnauthorizedResponse();
  }

  if (event.httpMethod !== "GET") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  try {
    const params = event.queryStringParameters || {};
    const placeId = params.placeId;

    if (!placeId) {
      return json(400, { ok: false, error: "placeId is required" });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return json(500, {
        ok: false,
        error: "Google Places API key not configured. Set GOOGLE_PLACES_API_KEY in environment variables.",
      });
    }

    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
    const response = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      return json(response.status >= 500 ? 502 : response.status, {
        ok: false,
        error: data.error?.message || `Google Places API returned HTTP ${response.status}`,
      });
    }

    return json(200, {
      ok: true,
      rating: data.rating ?? null,
      reviewCount: data.userRatingCount ?? 0,
      name: data.displayName?.text || "",
    });
  } catch (error) {
    return json(500, { ok: false, error: error.message || String(error) });
  }
};
