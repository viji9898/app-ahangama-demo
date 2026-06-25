import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogsPath = path.join(__dirname, "..", "src", "data", "blogs.js");
const placesPath = path.join(__dirname, "..", "src", "data", "places.js");
const outDir = path.join(__dirname, "..", "public");
const siteUrl = (process.env.VITE_SITE_URL || "https://ahangama.com").replace(
  /\/$/,
  "",
);

const publicRoutes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/article-guideline", changefreq: "monthly", priority: "0.5" },
  { path: "/blogs", changefreq: "weekly", priority: "0.8" },
  { path: "/card", changefreq: "weekly", priority: "0.9" },
  { path: "/dulasiri-uncle", changefreq: "monthly", priority: "0.7" },
  { path: "/eat", changefreq: "weekly", priority: "0.9" },
  { path: "/events", changefreq: "weekly", priority: "0.8" },
  { path: "/guide", changefreq: "weekly", priority: "0.9" },
  { path: "/editors-picks", changefreq: "weekly", priority: "0.8" },
  { path: "/lighthouse", changefreq: "monthly", priority: "0.8" },
  { path: "/local-intelligence", changefreq: "daily", priority: "0.8" },
  { path: "/map", changefreq: "weekly", priority: "0.7" },
  { path: "/mosvold", changefreq: "monthly", priority: "0.7" },
  { path: "/newsletter", changefreq: "weekly", priority: "0.7" },
  { path: "/offers", changefreq: "weekly", priority: "0.7" },
  { path: "/pabc", changefreq: "monthly", priority: "0.7" },
  { path: "/partners", changefreq: "monthly", priority: "0.7" },
  { path: "/products", changefreq: "weekly", priority: "0.8" },
  { path: "/retail", changefreq: "weekly", priority: "0.7" },
  { path: "/search", changefreq: "weekly", priority: "0.8" },
  { path: "/shops", changefreq: "weekly", priority: "0.8" },
  { path: "/stays", changefreq: "weekly", priority: "0.8" },
  {
    path: "/the-living-room-concept-store",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/community-market-in-ahangama",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/where-ahangama-gathers-for-sunset-stairway-rooftop-bar-at-lighthouse-hotel",
    changefreq: "monthly",
    priority: "0.7",
  },
  { path: "/what-is-ahangama-pass", changefreq: "monthly", priority: "0.8" },
  { path: "/wellness", changefreq: "weekly", priority: "0.8" },
  { path: "/12-things", changefreq: "monthly", priority: "0.8" },
  {
    path: "/3-days-in-ahangama",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/sri-lankas-most-interesting-coastal-town",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/where-to-stay-on-sri-lankas-southern-coast",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/why-surfing-changed-everything-in-ahangama",
    changefreq: "monthly",
    priority: "0.7",
  },
];

const placeCategoryRouteMap = {
  eat: "eat",
  stays: "stays",
  wellness: "wellness",
  retail: "retail",
  "shops-essentials": "retail",
};

// Simple, safe-ish import of your ES module data in Node
async function loadPlaces() {
  const mod = await import(pathToFileUrl(placesPath));
  return mod.PLACES || [];
}

async function loadBlogs() {
  const mod = await import(pathToFileUrl(blogsPath));
  return mod.BLOG_POSTS || [];
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

function buildUrl(pathname) {
  if (pathname === "/") return siteUrl;
  return `${siteUrl}${pathname}`;
}

function normalizePlaceRoute(place) {
  const rawCategory = String(place.category || "").trim();
  const normalizedKey = rawCategory.toLowerCase();
  const routeCategory = placeCategoryRouteMap[normalizedKey];

  if (!routeCategory || !place.slug) {
    return null;
  }

  return `/${routeCategory}/${place.slug}`;
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
  </url>`,
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

  const BLOG_POSTS = await loadBlogs();
  const PLACES = await loadPlaces();

  const staticRoutes = publicRoutes.map(({ path, ...rest }) => ({
    loc: buildUrl(path),
    ...rest,
  }));

  const dynamicRoutes = PLACES.map((place) => {
    const pathname = normalizePlaceRoute(place);

    if (!pathname) {
      return null;
    }

    return {
      loc: buildUrl(pathname),
      changefreq: "monthly",
      priority: "0.7",
    };
  }).filter(Boolean);

  const blogRoutes = BLOG_POSTS.map((post) => ({
    loc: buildUrl(`/blogs/${post.slug}`),
    changefreq: "monthly",
    priority: "0.7",
    lastmod: post.publishDate,
  }));

  // Deduplicate
  const seen = new Set();
  const urls = [...staticRoutes, ...dynamicRoutes, ...blogRoutes].filter(
    (u) => {
      if (seen.has(u.loc)) return false;
      seen.add(u.loc);
      return true;
    },
  );

  const sitemapXml = buildSitemap(urls);
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemapXml, "utf8");

  const robotsTxt = buildRobots({ siteUrl });
  fs.writeFileSync(path.join(outDir, "robots.txt"), robotsTxt, "utf8");

  console.log(`✅ Generated public/sitemap.xml (${urls.length} URLs)`);
  console.log(
    `✅ Generated public/robots.txt (Sitemap: ${siteUrl}/sitemap.xml)`,
  );
})().catch((err) => {
  console.error("❌ SEO generation failed:", err);
  process.exit(1);
});
