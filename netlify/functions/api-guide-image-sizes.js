import { getGuideImageAudit } from "../../lib/guide-image-audit.js";

const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=60, stale-while-revalidate=840",
};

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: "Method not allowed" }),
    };
  }

  try {
    const refresh = event.queryStringParameters?.refresh === "1";
    const audit = await getGuideImageAudit({ refresh });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, ...audit }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: error.message || String(error) }),
    };
  }
};