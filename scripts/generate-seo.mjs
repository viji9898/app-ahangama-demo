import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- EDIT THIS if your repo structure differs ----
const placesPath = path.join(__dirname, "..", "src", "data", "places.js");
const outDir = path.join(__dirname, "..", "public");
const siteUrl = (process.env.VITE_SITE_URL || "http://localhost:5173").replace(
  /\/$/,
  ""
);

// Simple, safe-ish import of your ES module data in Node
async function loadPlaces() {
  const mod = await import(pathToFileUrl(placesPath));
  return mod.PLACES || [];
}

function pathToFileUrl(p) {
  const u = new URL("file://");
  // Windows-safe
  u.pathname = path.resolve(p).replace(/\\/g, "/");
  return u.href;
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function isoDate(d = new Date()) {
  return d.toISOString().split("T")[0];
}

function xmlEscape(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildSitemap(urls) {
  const today = isoDate();
  const items = urls
    .map(
      ({ loc, changefreq = "weekly", priority = "0.6", lastmod = today }) => `
  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${xmlEscape(lastmod)}</lastmod>
    <changefreq>${xmlEscape(changefreq)}</changefreq>
    <priority>${xmlEscape(priority)}</priority>
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">${items}
</urlset>
`;
}

function buildRobots({ siteUrl }) {
  const sitemap = `${siteUrl}/sitemap.xml`;
  return `User-agent: *
Allow: /

Sitemap: ${sitemap}
`;
}

(async () => {
  ensureDir(outDir);

  const PLACES = await loadPlaces();

  // Core routes (add more as you build)
  const staticRoutes = [
    { loc: `${siteUrl}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${siteUrl}/search`, changefreq: "weekly", priority: "0.8" },
    { loc: `${siteUrl}/eat`, changefreq: "weekly", priority: "0.9" },
    { loc: `${siteUrl}/stays`, changefreq: "weekly", priority: "0.9" },
    { loc: `${siteUrl}/experiences`, changefreq: "weekly", priority: "0.9" },
    { loc: `${siteUrl}/card`, changefreq: "weekly", priority: "0.9" },
    { loc: `${siteUrl}/card/buy`, changefreq: "monthly", priority: "0.5" },
    { loc: `${siteUrl}/card/my`, changefreq: "monthly", priority: "0.2" },
    { loc: `${siteUrl}/card/verify`, changefreq: "monthly", priority: "0.2" },
  ];

  // Dynamic place routes from arrays
  const dynamicRoutes = PLACES.map((p) => ({
    loc: `${siteUrl}/${p.category}/${p.slug}`,
    changefreq: "monthly",
    priority: "0.7",
  }));

  // Deduplicate
  const seen = new Set();
  const urls = [...staticRoutes, ...dynamicRoutes].filter((u) => {
    if (seen.has(u.loc)) return false;
    seen.add(u.loc);
    return true;
  });

  const sitemapXml = buildSitemap(urls);
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemapXml, "utf8");

  const robotsTxt = buildRobots({ siteUrl });
  fs.writeFileSync(path.join(outDir, "robots.txt"), robotsTxt, "utf8");

  console.log(`✅ Generated public/sitemap.xml (${urls.length} URLs)`);
  console.log(
    `✅ Generated public/robots.txt (Sitemap: ${siteUrl}/sitemap.xml)`
  );
})().catch((err) => {
  console.error("❌ SEO generation failed:", err);
  process.exit(1);
});
