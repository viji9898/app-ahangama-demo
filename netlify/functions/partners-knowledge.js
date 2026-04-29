import { listVenues } from "../../lib/venues-db.js";
import {
  buildPartnersKnowledgeRecords,
  renderPartnersKnowledgeHtml,
} from "../../lib/partners-knowledge.js";

function getBaseUrl(event) {
  const configured = process.env.VITE_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const proto = event.headers["x-forwarded-proto"] || "https";
  const host = event.headers.host || "localhost:8889";
  return `${proto}://${host}`;
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
    body: JSON.stringify(body),
  };
}

function html(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
    body,
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
    const format = String(params.format || "").trim().toLowerCase();
    const baseUrl = getBaseUrl(event);
    const canonicalUrl = `${baseUrl}/partners-knowledge`;
    const jsonUrl = `${baseUrl}/api/partners-knowledge?destinationSlug=${encodeURIComponent(destinationSlug)}${category ? `&category=${encodeURIComponent(category)}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

    const venues = await listVenues({ destinationSlug, q, category });
    const records = buildPartnersKnowledgeRecords(venues, { baseUrl });
    const generatedAt = new Date().toISOString();

    if (
      format === "json" ||
      event.path?.startsWith("/api/") ||
      (event.headers.accept || "").includes("application/json")
    ) {
      return json(200, {
        ok: true,
        destinationSlug,
        category: category || null,
        q: q || null,
        generatedAt,
        count: records.length,
        records,
      });
    }

    return html(
      200,
      renderPartnersKnowledgeHtml({
        title: "Partner Knowledge Base — Ahangama",
        description:
          "Curated, machine-readable partner records for Ahangama.com, rendered as plain HTML for AI systems, search crawlers, and research workflows.",
        canonicalUrl,
        jsonUrl,
        generatedAt,
        destinationSlug,
        query: q,
        category,
        records,
      }),
    );
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};