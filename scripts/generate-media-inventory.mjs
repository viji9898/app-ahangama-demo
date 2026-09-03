import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");
const outputPath = path.join(rootDir, "public", "media-inventory.json");
const sourceRoots = ["src", "lib", "netlify"];
const sourceExtensions = new Set([".js", ".jsx", ".mjs", ".css", ".html"]);
const imageExtensions = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);
const extensionlessImageHosts = new Set([
  "images.openai.com",
  "images.unsplash.com",
]);
const ownedBaseUrl =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/";

function walk(directory) {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolutePath) : [absolutePath];
  });
}

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function decodeFileName(url) {
  try {
    const pathname = new URL(url, "https://ahangama.com").pathname;
    return decodeURIComponent(pathname.split("/").filter(Boolean).pop() || "image");
  } catch {
    return url.split("/").pop() || "image";
  }
}

function getFormat(url) {
  try {
    const extension = path.extname(
      new URL(url, "https://ahangama.com").pathname,
    );
    return extension.replace(".", "").toUpperCase() || "IMAGE";
  } catch {
    return "IMAGE";
  }
}

function isImageLink(value) {
  try {
    const url = new URL(value, "https://ahangama.com");
    const extension = path.extname(url.pathname).toLowerCase();
    return (
      imageExtensions.has(extension) || extensionlessImageHosts.has(url.hostname)
    );
  } catch {
    return false;
  }
}

function normalizeLink(value) {
  const trimmed = String(value || "")
    .trim()
    .replaceAll("&amp;", "&")
    .replace(/[),.;]+$/, "");

  if (!trimmed || trimmed.startsWith("data:")) return null;
  if (trimmed.startsWith("/")) return encodeURI(trimmed);
  if (!/^https?:\/\//i.test(trimmed)) return null;

  try {
    return new URL(trimmed).href;
  } catch {
    return null;
  }
}

function classify(url) {
  if (url.startsWith("/")) return "local";
  if (url.startsWith(ownedBaseUrl)) return "owned";
  return "external";
}

function addRecord(records, rawUrl, source) {
  const url = normalizeLink(rawUrl);
  if (!url || !isImageLink(url)) return;

  const current = records.get(url) || {
    url,
    fileName: decodeFileName(url),
    format: getFormat(url),
    origin: classify(url),
    host: url.startsWith("/") ? "ahangama.com" : new URL(url).hostname,
    sources: [],
  };

  if (!current.sources.includes(source)) current.sources.push(source);
  records.set(url, current);
}

function extractSourceLinks(filePath, records) {
  const source = toPosix(path.relative(rootDir, filePath));
  const content = fs.readFileSync(filePath, "utf8");
  const constants = new Map();
  const constantPattern =
    /(?:const|let|var)\s+([A-Z][A-Z0-9_]*)\s*=\s*["'](https?:\/\/[^"']+|\/[^"']+)["']/g;
  const directPattern = /["'](https?:\/\/[^"'\s]+|\/[^"'\n]+\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?[^"']*)?)["']/gi;
  const templatePattern = /`([^`]+)`/g;

  for (const match of content.matchAll(constantPattern)) {
    constants.set(match[1], match[2]);
  }

  for (const match of content.matchAll(directPattern)) {
    addRecord(records, match[1], source);
  }

  for (const match of content.matchAll(templatePattern)) {
    const resolved = match[1].replace(
      /\$\{([A-Z][A-Z0-9_]*)\}/g,
      (placeholder, name) => constants.get(name) || placeholder,
    );

    if (!resolved.includes("${")) addRecord(records, resolved, source);
  }
}

function buildSourceRouteMap() {
  const routesPath = path.join(rootDir, "src", "app", "routes.jsx");
  const routesContent = fs.readFileSync(routesPath, "utf8");
  const componentSources = new Map();
  const routeConstants = new Map();
  const sourceRoutes = new Map();
  const importPattern =
    /import\s+([A-Z][A-Za-z0-9]*)(?:\s*,\s*\{[\s\S]*?\})?\s+from\s+["']\.\.\/pages\/([^"']+)["'];/g;
  const routePattern =
    /\{\s*path:\s*(?:["']([^"']+)["']|([A-Z][A-Z0-9_]*)),\s*element:\s*<([A-Z][A-Za-z0-9]*)/g;

  for (const match of routesContent.matchAll(importPattern)) {
    componentSources.set(match[1], `src/pages/${match[2]}.jsx`);
  }

  for (const filePath of walk(path.join(rootDir, "src", "pages"))) {
    if (!filePath.endsWith(".jsx")) continue;
    const content = fs.readFileSync(filePath, "utf8");
    const constantPattern =
      /(?:export\s+)?const\s+([A-Z][A-Z0-9_]*)\s*=\s*["']([^"']+)["']/g;

    for (const match of content.matchAll(constantPattern)) {
      routeConstants.set(match[1], match[2]);
    }
  }

  for (const match of routesContent.matchAll(routePattern)) {
    const route = match[1] || routeConstants.get(match[2]);
    const source = componentSources.get(match[3]);
    if (!route || !source || route.includes(":")) continue;

    const routes = sourceRoutes.get(source) || [];
    if (!routes.includes(route)) routes.push(route);
    sourceRoutes.set(source, routes);
  }

  return sourceRoutes;
}

function buildInventory() {
  const records = new Map();
  const sourceRoutes = buildSourceRouteMap();
  const publicDir = path.join(rootDir, "public");

  for (const filePath of walk(publicDir)) {
    const extension = path.extname(filePath).toLowerCase();
    if (!imageExtensions.has(extension)) continue;

    const publicPath = `/${toPosix(path.relative(publicDir, filePath))}`;
    addRecord(records, publicPath, `public/${toPosix(path.relative(publicDir, filePath))}`);
  }

  for (const sourceRoot of sourceRoots) {
    for (const filePath of walk(path.join(rootDir, sourceRoot))) {
      if (!sourceExtensions.has(path.extname(filePath).toLowerCase())) continue;
      extractSourceLinks(filePath, records);
    }
  }

  return [...records.values()]
    .map((record) => {
      const sources = record.sources.sort();
      const pageRoutes = Object.fromEntries(
        sources
          .filter((source) => sourceRoutes.has(source))
          .map((source) => [source, sourceRoutes.get(source)]),
      );

      return { ...record, sources, pageRoutes };
    })
    .sort((left, right) => {
      const originOrder = { owned: 0, local: 1, external: 2 };
      return (
        originOrder[left.origin] - originOrder[right.origin] ||
        left.fileName.localeCompare(right.fileName)
      );
    });
}

const media = buildInventory();
const payload = {
  generatedAt: new Date().toISOString(),
  ownedBaseUrl,
  count: media.length,
  media,
};

fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Generated public/media-inventory.json (${media.length} images)`);