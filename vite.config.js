import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { listVenues } from "./lib/venues-db.js";
import {
  buildPartnersKnowledgeRecords,
  renderPartnersKnowledgeHtml,
} from "./lib/partners-knowledge.js";

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
