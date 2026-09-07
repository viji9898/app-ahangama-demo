import { listGuideContent, updateGuideContent } from "../../lib/guide-db.js";

const headers = { "Content-Type": "application/json" };
const json = (statusCode, body) => ({ statusCode, headers, body: JSON.stringify(body) });

export const handler = async (event) => {
  try {
    if (event.httpMethod === "GET") {
      const content = await listGuideContent();
      return json(200, { ok: true, content });
    }

    if (event.httpMethod === "PUT") {
      const body = JSON.parse(event.body || "{}");
      if (!body.sectionKey) {
        return json(400, { ok: false, error: "sectionKey is required" });
      }
      const item = await updateGuideContent(body.sectionKey, body);
      return json(200, { ok: true, content: item });
    }

    return json(405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    return json(500, { ok: false, error: error.message || String(error) });
  }
};
