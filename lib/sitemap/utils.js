import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const { Pool } = pg;

export const SITEMAP_URL_LIMIT = 50000;
export const SITEMAP_BYTE_LIMIT = 50 * 1024 * 1024;
export const DEFAULT_STATIC_LASTMOD = "2026-01-01T00:00:00.000Z";

const pools = new Map();

export function getCanonicalSiteUrl() {
  const configured =
    process.env.CANONICAL_SITE_URL ||
    process.env.PUBLIC_SITE_URL ||
    process.env.URL ||
    process.env.VITE_SITE_URL ||
    "https://ahangama.com";

  try {
    const url = new URL(configured);
    const isLocal = ["localhost", "127.0.0.1", "0.0.0.0"].includes(
      url.hostname,
    );

    if (isLocal) return "https://ahangama.com";

    url.protocol = "https:";
    url.pathname = url.pathname.replace(/\/$/, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "https://ahangama.com";
  }
}

export function xmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function toLastmod(value, fallback = DEFAULT_STATIC_LASTMOD) {
  const candidate = value || fallback;
  const date = candidate instanceof Date ? candidate : new Date(candidate);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toISOString();
}

export function fileLastmod(rootDir, relativeFilePath) {
  try {
    return fs.statSync(path.join(rootDir, relativeFilePath)).mtime.toISOString();
  } catch {
    return DEFAULT_STATIC_LASTMOD;
  }
}

export function newestLastmod(values) {
  const timestamps = values
    .map((value) => new Date(toLastmod(value)).getTime())
    .filter(Number.isFinite);

  if (!timestamps.length) return DEFAULT_STATIC_LASTMOD;

  return new Date(Math.max(...timestamps)).toISOString();
}

export function normalizePathname(pathname) {
  const raw = String(pathname || "/").trim();
  let parsedPath = raw;

  if (/^https?:\/\//i.test(raw)) {
    parsedPath = new URL(raw).pathname;
  }

  const withLeadingSlash = parsedPath.startsWith("/")
    ? parsedPath
    : `/${parsedPath}`;
  const withoutDuplicateSlashes = withLeadingSlash.replace(/\/+/g, "/");
  const withoutTrailingSlash =
    withoutDuplicateSlashes.length > 1
      ? withoutDuplicateSlashes.replace(/\/$/, "")
      : withoutDuplicateSlashes;

  return encodeURI(withoutTrailingSlash.toLowerCase());
}

export function buildCanonicalUrl(pathname, siteUrl) {
  const url = new URL(normalizePathname(pathname), `${siteUrl}/`);
  url.protocol = "https:";
  url.search = "";
  url.hash = "";
  return url.href;
}

export function buildAbsoluteAssetUrl(value, siteUrl) {
  if (!value) return null;

  try {
    const url = /^https?:\/\//i.test(value)
      ? new URL(value)
      : new URL(encodeURI(value), `${siteUrl}/`);

    url.protocol = "https:";
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}

export function createSitemapEntry({ pathname, loc, siteUrl, lastmod, images = [] }) {
  return {
    loc: loc || buildCanonicalUrl(pathname, siteUrl),
    lastmod: toLastmod(lastmod),
    images: [...new Set(images.filter(Boolean))],
  };
}

export function dedupeEntries(entries) {
  const seen = new Set();

  return entries.filter((entry) => {
    if (!entry?.loc || seen.has(entry.loc)) return false;
    seen.add(entry.loc);
    return true;
  });
}

function renderImageTags(images) {
  return images
    .map(
      (imageUrl) => `
    <image:image>
      <image:loc>${xmlEscape(imageUrl)}</image:loc>
    </image:image>`,
    )
    .join("");
}

export function renderUrlEntry(entry, { includeImages = false } = {}) {
  const images = includeImages ? renderImageTags(entry.images || []) : "";

  return `
  <url>
    <loc>${xmlEscape(entry.loc)}</loc>
    <lastmod>${xmlEscape(toLastmod(entry.lastmod))}</lastmod>${images}
  </url>`;
}

export function buildUrlset(entries, { includeImages = false } = {}) {
  const imageNamespace = includeImages
    ? ' xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"'
    : "";
  const items = entries
    .map((entry) => renderUrlEntry(entry, { includeImages }))
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"${imageNamespace}>${items}
</urlset>
`;
}

export function buildSitemapIndex(sitemaps) {
  const items = sitemaps
    .map(
      (sitemap) => `
  <sitemap>
    <loc>${xmlEscape(sitemap.loc)}</loc>
    <lastmod>${xmlEscape(toLastmod(sitemap.lastmod))}</lastmod>
  </sitemap>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">${items}
</sitemapindex>
`;
}

export function chunkSitemapEntries(entries, { includeImages = false } = {}) {
  const chunks = [];
  let currentChunk = [];
  let currentBytes = 0;
  const overheadBytes = 512;
  const maxBytes = SITEMAP_BYTE_LIMIT - overheadBytes;

  for (const entry of entries) {
    const entryBytes = Buffer.byteLength(
      renderUrlEntry(entry, { includeImages }),
      "utf8",
    );
    const wouldExceedCount = currentChunk.length >= SITEMAP_URL_LIMIT;
    const wouldExceedBytes =
      currentChunk.length > 0 && currentBytes + entryBytes > maxBytes;

    if (wouldExceedCount || wouldExceedBytes) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentBytes = 0;
    }

    currentChunk.push(entry);
    currentBytes += entryBytes;
  }

  chunks.push(currentChunk);
  return chunks;
}

export function writeSitemapSection({
  outDir,
  siteUrl,
  sectionName,
  entries,
  includeImages = false,
}) {
  const cleanEntries = dedupeEntries(entries);
  const chunks = chunkSitemapEntries(cleanEntries, { includeImages });
  const sitemapsDir = path.join(outDir, "sitemaps");

  if (!fs.existsSync(sitemapsDir)) {
    fs.mkdirSync(sitemapsDir, { recursive: true });
  }

  return chunks.map((chunk, index) => {
    const fileName =
      chunks.length === 1 ? `${sectionName}.xml` : `${sectionName}-${index + 1}.xml`;
    const filePath = path.join(sitemapsDir, fileName);
    const xml = buildUrlset(chunk, { includeImages });

    fs.writeFileSync(filePath, xml, "utf8");

    return {
      loc: `${siteUrl}/sitemaps/${fileName}`,
      lastmod: newestLastmod(chunk.map((entry) => entry.lastmod)),
      count: chunk.length,
      fileName,
    };
  });
}

export function extractImageUrls(record, siteUrl) {
  const urls = new Set();
  const imageKeyPattern = /(image|img|photo|poster|thumbnail|logo)/i;
  const imageUrlPattern = /\.(avif|gif|jpe?g|png|svg|webp)(\?|$)/i;

  function visit(value, key = "") {
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, key));
      return;
    }

    if (typeof value === "object") {
      Object.entries(value).forEach(([childKey, childValue]) => {
        visit(childValue, childKey);
      });
      return;
    }

    if (typeof value !== "string") return;

    const looksLikeImageKey = imageKeyPattern.test(key);
    const looksLikeImageUrl = imageUrlPattern.test(value);

    if (!looksLikeImageKey && !looksLikeImageUrl) return;

    const absoluteUrl = buildAbsoluteAssetUrl(value, siteUrl);
    if (absoluteUrl) urls.add(absoluteUrl);
  }

  visit(record);
  return [...urls];
}

export function getDatabaseUrls() {
  return [
    process.env.NETLIFY_DATABASE_URL,
    process.env.NETLIFY_DATABASE_URL_UNPOOLED,
    process.env.DATABASE_URL,
  ]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index);
}

export function hasDatabaseUrl() {
  return getDatabaseUrls().length > 0;
}

export function getPool(connectionString) {
  if (!connectionString) {
    throw new Error(
      "Missing database connection. Expected NETLIFY_DATABASE_URL or DATABASE_URL.",
    );
  }

  if (!pools.has(connectionString)) {
    pools.set(connectionString, new Pool({ connectionString }));
  }

  return pools.get(connectionString);
}

export async function queryRows(sql, params = [], connectionString) {
  const result = await getPool(connectionString).query(sql, params);
  return result.rows;
}

export async function tryQueryRows(sql, params = []) {
  const databaseUrls = getDatabaseUrls();
  if (!databaseUrls.length) return null;

  const errors = [];

  for (const databaseUrl of databaseUrls) {
    try {
      return await queryRows(sql, params, databaseUrl);
    } catch (error) {
      errors.push(error.message);
    }
  }

  console.warn(`Skipping sitemap database query: ${errors.join("; ")}`);
  return null;
}

export async function closeSitemapDatabase() {
  const activePools = [...pools.values()];
  pools.clear();

  await Promise.all(activePools.map((activePool) => activePool.end()));
}
