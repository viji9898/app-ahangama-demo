const headers = { "Content-Type": "application/json" };
const json = (statusCode, body) => ({ statusCode, headers, body: JSON.stringify(body) });

export const handler = async (event) => {
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

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=rating,user_ratings_total,name&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" || !data.result) {
      return json(404, {
        ok: false,
        error: `Google Places API returned: ${data.status || "UNKNOWN"}`,
      });
    }

    return json(200, {
      ok: true,
      rating: data.result.rating || null,
      reviewCount: data.result.user_ratings_total || 0,
      name: data.result.name || "",
    });
  } catch (error) {
    return json(500, { ok: false, error: error.message || String(error) });
  }
};
