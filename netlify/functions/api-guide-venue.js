import {
  getGuideVenue,
  updateGuideVenue,
  deleteGuideVenue,
  restoreGuideVenue,
  deleteGuideVenuePermanently,
} from "../../lib/guide-db.js";
import {
  guideAdminUnauthorizedResponse,
  isGuideAdminAuthorized,
} from "../../lib/guide-admin-auth.js";

const headers = { "Content-Type": "application/json" };
const json = (statusCode, body) => ({ statusCode, headers, body: JSON.stringify(body) });

export const handler = async (event) => {
  try {
    if (!isGuideAdminAuthorized(event.headers)) {
      return guideAdminUnauthorizedResponse();
    }

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
      const permanent = event.queryStringParameters?.permanent === "1";
      if (permanent) {
        await deleteGuideVenuePermanently(id);
      } else {
        await deleteGuideVenue(id);
      }
      return json(200, { ok: true });
    }

    if (event.httpMethod === "POST") {
      const venue = await restoreGuideVenue(id);
      if (!venue) return json(404, { ok: false, error: "Venue not found in trash" });
      return json(200, { ok: true, venue });
    }

    return json(405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    return json(500, { ok: false, error: error.message || String(error) });
  }
};
