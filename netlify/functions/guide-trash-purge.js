import { purgeExpiredTrashedGuideVenues } from "../../lib/guide-db.js";

export const handler = async () => {
  try {
    const result = await purgeExpiredTrashedGuideVenues(30);
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, purged: result.purged }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        purged: 0,
        error: error.message || String(error),
      }),
    };
  }
};

export const config = { schedule: "@daily" };