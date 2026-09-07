import { listGuideVenues, createGuideVenue } from "../../lib/guide-db.js";

const headers = { "Content-Type": "application/json" };
const json = (statusCode, body) => ({ statusCode, headers, body: JSON.stringify(body) });

export const handler = async (event) => {
  try {
    if (event.httpMethod === "GET") {
      const params = event.queryStringParameters || {};
      const venues = await listGuideVenues({
        section: params.section || "",
        status: params.status || "",
      });
      return json(200, { ok: true, venues });
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      if (!body.name || !body.section) {
        return json(400, { ok: false, error: "name and section are required" });
      }
      const venue = await createGuideVenue(body);
      return json(201, { ok: true, venue });
    }

    return json(405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    return json(500, { ok: false, error: error.message || String(error) });
  }
};
