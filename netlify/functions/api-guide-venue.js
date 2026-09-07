import { getGuideVenue, updateGuideVenue, deleteGuideVenue } from "../../lib/guide-db.js";

const headers = { "Content-Type": "application/json" };
const json = (statusCode, body) => ({ statusCode, headers, body: JSON.stringify(body) });

export const handler = async (event) => {
  try {
    const id = event.queryStringParameters?.id || event.path?.split("/").pop();

    if (!id) {
      return json(400, { ok: false, error: "Venue id is required" });
    }

    if (event.httpMethod === "GET") {
      const venue = await getGuideVenue(id);
      if (!venue) return json(404, { ok: false, error: "Venue not found" });
      return json(200, { ok: true, venue });
    }

    if (event.httpMethod === "PUT") {
      const body = JSON.parse(event.body || "{}");
      const venue = await updateGuideVenue(id, body);
      if (!venue) return json(404, { ok: false, error: "Venue not found" });
      return json(200, { ok: true, venue });
    }

    if (event.httpMethod === "DELETE") {
      await deleteGuideVenue(id);
      return json(200, { ok: true });
    }

    return json(405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    return json(500, { ok: false, error: error.message || String(error) });
  }
};
