import { listVenues } from "../../lib/venues-db.js";

const headers = {
  "Content-Type": "application/json; charset=utf-8",
};

function json(statusCode, body) {
  return {
    statusCode,
    headers,
    body: JSON.stringify(body),
  };
}

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  try {
    const params = event.queryStringParameters || {};
    const destinationSlug = params.destinationSlug || "ahangama";
    const q = params.q || "";
    const category = params.category || "";

    const venues = await listVenues({ destinationSlug, q, category });

    const logos = venues
      .filter((venue) => venue && venue.logo)
      .map((venue) => ({
        id: venue.id,
        slug: venue.slug,
        name: venue.name,
        logo: venue.logo,
      }));

    return json(200, { ok: true, logos });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
