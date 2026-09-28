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
    return json(200, { ok: true });
  } catch (error) {
    return json(500, { ok: false, error: error.message || String(error) });
  }
};