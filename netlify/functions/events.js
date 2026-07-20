import { getEventsCalendarPayload } from "../../lib/events-db.js";

function jsonHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
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

  try {
    const payload = await getEventsCalendarPayload();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, ...payload }),
    };
  } catch (error) {
    console.error("events calendar error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || "Unable to load events calendar",
      }),
    };
  }
};