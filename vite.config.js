import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { listVenues } from "./lib/venues-db.js";
import {
  listGuideVenues,
  createGuideVenue,
  getGuideVenue,
  updateGuideVenue,
  deleteGuideVenue,
  listGuideContent,
  updateGuideContent,
} from "./lib/guide-db.js";
import {
  buildPartnersKnowledgeRecords,
  renderPartnersKnowledgeHtml,
} from "./lib/partners-knowledge.js";

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

function venuesApiPlugin() {
  return {
    name: "venues-api-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (
          req.url?.startsWith("/partners-knowledge") ||
          req.url?.startsWith("/api/partners-knowledge")
        ) {
          if (req.method !== "GET") {
            res.statusCode = 405;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
            return;
          }

          try {
            const url = new URL(req.url, "http://localhost:5173");
            const destinationSlug =
              url.searchParams.get("destinationSlug") || "ahangama";
            const q = url.searchParams.get("q") || "";
            const category = url.searchParams.get("category") || "";
            const venues = await listVenues({ destinationSlug, q, category });
            const baseUrl = (process.env.VITE_SITE_URL || "http://localhost:5173").replace(
              /\/$/,
              "",
            );
            const records = buildPartnersKnowledgeRecords(venues, { baseUrl });
            const generatedAt = new Date().toISOString();
            const jsonUrl = `${baseUrl}/api/partners-knowledge?destinationSlug=${encodeURIComponent(destinationSlug)}${category ? `&category=${encodeURIComponent(category)}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

            if (req.url.startsWith("/api/partners-knowledge")) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(
                JSON.stringify({
                  ok: true,
                  destinationSlug,
                  category: category || null,
                  q: q || null,
                  generatedAt,
                  count: records.length,
                  records,
                }),
              );
              return;
            }

            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(
              renderPartnersKnowledgeHtml({
                title: "Partner Knowledge Base — Ahangama",
                description:
                  "Curated, machine-readable partner records for Ahangama.com, rendered as plain HTML for AI systems, search crawlers, and research workflows.",
                canonicalUrl: `${baseUrl}/partners-knowledge`,
                jsonUrl,
                generatedAt,
                destinationSlug,
                query: q,
                category,
                records,
              }),
            );
            return;
          } catch (error) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(
              JSON.stringify({
                ok: false,
                error: error instanceof Error ? error.message : String(error),
              }),
            );
            return;
          }
        }

        if (
          !req.url?.startsWith("/api/venues") &&
          !req.url?.startsWith("/api/venue-logos")
        ) {
          next();
          return;
        }

        if (req.method !== "GET") {
          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
          return;
        }

        try {
          const url = new URL(req.url, "http://localhost:5173");
          const venues = await listVenues({
            destinationSlug:
              url.searchParams.get("destinationSlug") || "ahangama",
            q: url.searchParams.get("q") || "",
            category: url.searchParams.get("category") || "",
          });

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");

          if (req.url.startsWith("/api/venue-logos")) {
            const logos = venues
              .filter((venue) => venue && venue.logo)
              .map((venue) => ({
                id: venue.id,
                slug: venue.slug,
                name: venue.name,
                logo: venue.logo,
              }));

            res.end(JSON.stringify({ ok: true, logos }));
            return;
          }

          res.end(JSON.stringify({ ok: true, venues }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              ok: false,
              error: error instanceof Error ? error.message : String(error),
            }),
          );
        }
      });

      // Guide admin API routes
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/guide/")) {
          next();
          return;
        }

        const url = new URL(req.url, "http://localhost:5173");
        const json = (statusCode, body) => {
          res.statusCode = statusCode;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };

        try {
          // GET /api/guide/venues
          if (req.url.startsWith("/api/guide/venues") && req.method === "GET") {
            const venues = await listGuideVenues({
              section: url.searchParams.get("section") || "",
              status: url.searchParams.get("status") || "",
            });
            return json(200, { ok: true, venues });
          }

          // POST /api/guide/venues
          if (req.url.startsWith("/api/guide/venues") && req.method === "POST") {
            const body = await readBody(req);
            if (!body.name || !body.section) return json(400, { ok: false, error: "name and section required" });
            const venue = await createGuideVenue(body);
            return json(201, { ok: true, venue });
          }

          // /api/guide/venue?id=...
          if (req.url.startsWith("/api/guide/venue")) {
            const id = url.searchParams.get("id");
            if (!id) return json(400, { ok: false, error: "id required" });

            if (req.method === "GET") {
              const venue = await getGuideVenue(id);
              if (!venue) return json(404, { ok: false, error: "not found" });
              return json(200, { ok: true, venue });
            }
            if (req.method === "PUT") {
              const body = await readBody(req);
              const venue = await updateGuideVenue(id, body);
              if (!venue) return json(404, { ok: false, error: "not found" });
              return json(200, { ok: true, venue });
            }
            if (req.method === "DELETE") {
              await deleteGuideVenue(id);
              return json(200, { ok: true });
            }
            return json(405, { ok: false, error: "Method not allowed" });
          }

          // GET /api/guide/content
          if (req.url.startsWith("/api/guide/content") && req.method === "GET") {
            const content = await listGuideContent();
            return json(200, { ok: true, content });
          }

          // PUT /api/guide/content
          if (req.url.startsWith("/api/guide/content") && req.method === "PUT") {
            const body = await readBody(req);
            if (!body.sectionKey) return json(400, { ok: false, error: "sectionKey required" });
            const item = await updateGuideContent(body.sectionKey, body);
            return json(200, { ok: true, content: item });
          }

          // GET /api/guide/google-rating
          if (req.url.startsWith("/api/guide/google-rating") && req.method === "GET") {
            const placeId = url.searchParams.get("placeId");
            if (!placeId) return json(400, { ok: false, error: "placeId required" });
            const apiKey = process.env.GOOGLE_PLACES_API_KEY;
            if (!apiKey) return json(500, { ok: false, error: "GOOGLE_PLACES_API_KEY not set" });
            const gRes = await fetch(
              `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=rating,user_ratings_total,name&key=${apiKey}`
            );
            const data = await gRes.json();
            if (data.status !== "OK" || !data.result) return json(404, { ok: false, error: data.status });
            return json(200, { ok: true, rating: data.result.rating || null, reviewCount: data.result.user_ratings_total || 0, name: data.result.name || "" });
          }

          next();
        } catch (error) {
          json(500, { ok: false, error: error.message || String(error) });
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    host: true,
    server: {
      allowedHosts: [".ngrok-free.dev", ".ngrok-free.app"],
    },
    plugins: [react(), venuesApiPlugin()],
  };
});
