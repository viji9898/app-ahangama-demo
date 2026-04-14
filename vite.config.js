import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { listVenues } from "./lib/venues-db.js";

function venuesApiPlugin() {
  return {
    name: "venues-api-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/venues")) {
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
    plugins: [react(), venuesApiPlugin()],
  };
});
