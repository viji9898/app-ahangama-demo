import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateArticlesSitemap } from "../lib/sitemap/articles.js";
import { generateBlogsSitemap } from "../lib/sitemap/blogs.js";
import { generateEatSitemap } from "../lib/sitemap/eat.js";
import { generateEventsSitemap } from "../lib/sitemap/events.js";
import { generateImagesSitemap } from "../lib/sitemap/images.js";
import { generatePagesSitemap } from "../lib/sitemap/pages.js";
import { generateRetailSitemap } from "../lib/sitemap/retail.js";
import { generateStaysSitemap } from "../lib/sitemap/stays.js";
import {
  buildSitemapIndex,
  closeSitemapDatabase,
  getCanonicalSiteUrl,
  newestLastmod,
  writeSitemapSection,
} from "../lib/sitemap/utils.js";
import { generateWellnessSitemap } from "../lib/sitemap/wellness.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");
const outDir = path.join(rootDir, "public");
const siteUrl = getCanonicalSiteUrl();

const sitemapSections = [
  ["pages", generatePagesSitemap],
  ["articles", generateArticlesSitemap],
  ["blogs", generateBlogsSitemap],
  ["eat", generateEatSitemap],
  ["stays", generateStaysSitemap],
  ["wellness", generateWellnessSitemap],
  ["retail", generateRetailSitemap],
  ["events", generateEventsSitemap],
];

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
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
  ensureDir(path.join(outDir, "sitemaps"));

  const context = { siteUrl, rootDir };
  const generatedSections = [];
  const entriesBySection = new Map();

  for (const [sectionName, generateSection] of sitemapSections) {
    const entries = await generateSection(context);
    entriesBySection.set(sectionName, entries);
    generatedSections.push(
      ...writeSitemapSection({ outDir, siteUrl, sectionName, entries }),
    );
  }

  const entriesForImages = [...entriesBySection.values()].flat();
  generatedSections.push(
    ...writeSitemapSection({
      outDir,
      siteUrl,
      sectionName: "images",
      entries: await generateImagesSitemap(context, entriesForImages),
      includeImages: true,
    }),
  );

  const sitemapIndex = buildSitemapIndex(generatedSections);
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemapIndex, "utf8");

  const robotsTxt = buildRobots({ siteUrl });
  fs.writeFileSync(path.join(outDir, "robots.txt"), robotsTxt, "utf8");

  console.log(
    `✅ Generated public/sitemap.xml (${generatedSections.length} child sitemap files)`,
  );
  for (const section of generatedSections) {
    console.log(`  - ${section.fileName}: ${section.count} URLs`);
  }
  console.log(
    `✅ Generated public/robots.txt (Sitemap: ${siteUrl}/sitemap.xml)`,
  );
})().catch((err) => {
  console.error("❌ SEO generation failed:", err);
  process.exit(1);
}).finally(async () => {
  await closeSitemapDatabase();
});
