import { getVenueStats } from "../../lib/venue-stats-config.js";
import {
  isVenueStatsAuthorized,
  venueStatsUnauthorizedResponse,
} from "../../lib/venue-stats-auth.js";
import {
  deleteInstagramPost,
  deleteVenueArticle,
  listInstagramPosts,
  listVenueArticles,
  saveInstagramPost,
  saveVenueArticle,
} from "../../lib/venue-stats-db.js";

const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "private, no-store",
};

const json = (statusCode, body) => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

function resolveVenue(params) {
  return getVenueStats(params.venue);
}

function parseBody(event) {
  try {
    return JSON.parse(event.body || "{}");
  } catch {
    return null;
  }
}

export const handler = async (event) => {
  if (!isVenueStatsAuthorized(event.headers)) {
    return venueStatsUnauthorizedResponse();
  }

  const params = event.queryStringParameters || {};
  const venue = resolveVenue(params);

  if (!venue) {
    return json(404, { ok: false, error: "Unknown venue" });
  }

  const type = String(params.type || "instagram").toLowerCase();

  try {
    if (event.httpMethod === "GET") {
      const [posts, articles] = await Promise.all([
        listInstagramPosts(venue.key),
        listVenueArticles(venue.key),
      ]);
      return json(200, {
        ok: true,
        venue: { key: venue.key, name: venue.name },
        instagram: { posts },
        articles: { items: articles },
      });
    }

    if (event.httpMethod === "POST" || event.httpMethod === "PUT") {
      const body = parseBody(event);
      if (!body) {
        return json(400, { ok: false, error: "Invalid JSON body" });
      }

      if (type === "article") {
        const article = await saveVenueArticle(venue.key, body);
        return json(200, { ok: true, article });
      }

      const post = await saveInstagramPost(venue.key, body);
      return json(200, { ok: true, post });
    }

    if (event.httpMethod === "DELETE") {
      const id = Number(params.id);
      if (!Number.isFinite(id) || id <= 0) {
        return json(400, { ok: false, error: "id is required" });
      }

      const deleted =
        type === "article"
          ? await deleteVenueArticle(venue.key, id)
          : await deleteInstagramPost(venue.key, id);

      if (!deleted) {
        return json(404, { ok: false, error: "Entry not found" });
      }

      return json(200, { ok: true });
    }

    return json(405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    console.error("Venue content API failed:", error);
    return json(400, {
      ok: false,
      error: error.message || String(error),
    });
  }
};
