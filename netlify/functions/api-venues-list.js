import { listVenues } from "../../lib/venues-db.js";

const headers = {
  "Content-Type": "application/json",
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
    const venues = await listVenues({
      destinationSlug: params.destinationSlug || "ahangama",
      q: params.q || "",
      category: params.category || "",
    });

    return json(200, { ok: true, venues });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
