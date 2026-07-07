import { listGuestPassInteractions } from "../../lib/hotel-passes-db.js";

function jsonHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };
}

function normalizeText(value) {
  return String(value || "").trim();
}

function parseLimit(value) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    return 500;
  }

  return Math.min(Math.max(parsed, 1), 1000);
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

  try {
    const params = event.queryStringParameters || {};
    const sourceHotelSlug = normalizeText(params.sourceHotelSlug) || null;
    const limit = parseLimit(params.limit);
    const data = await listGuestPassInteractions({ sourceHotelSlug, limit });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        sourceHotelSlug,
        limit,
        ...data,
      }),
    };
  } catch (error) {
    console.error("interactions error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || "Unable to load interactions",
      }),
    };
  }
};