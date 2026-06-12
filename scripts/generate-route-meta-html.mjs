import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, "..", "dist");
const indexPath = path.join(distDir, "index.html");
const assetsDir = path.join(distDir, "assets");
const siteUrl = (process.env.VITE_SITE_URL || "https://ahangama.com").replace(
  /\/$/,
  "",
);

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function replaceOrInsert(html, pattern, replacement) {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }

  return html.replace("</head>", `  ${replacement}\n</head>`);
}

function buildAbsoluteUrl(routePath) {
  const normalizedPath = routePath.startsWith("/") ? routePath : `/${routePath}`;
  return `${siteUrl}${normalizedPath}`;
}

function findBuiltAssetUrl(prefix) {
  if (!fs.existsSync(assetsDir)) {
    throw new Error(`Assets directory not found: ${assetsDir}`);
  }

  const assetName = fs
    .readdirSync(assetsDir)
    .find((fileName) => fileName.startsWith(`${prefix}-`));

  if (!assetName) {
    throw new Error(`Could not find built asset for prefix: ${prefix}`);
  }

  return `${siteUrl}/assets/${assetName}`;
}

function applyMeta(html, meta) {
  const canonical = buildAbsoluteUrl(meta.route);
  const ogImage = typeof meta.image === "function" ? meta.image() : meta.image;

  let nextHtml = html;

  nextHtml = replaceOrInsert(
    nextHtml,
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(meta.title)}</title>`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+name=["']title["'][^>]*>/i,
    `<meta name="title" content="${escapeHtml(meta.title)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+property=["']og:image["'][^>]*>/i,
    `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+name=["']twitter:card["'][^>]*>/i,
    '<meta name="twitter:card" content="summary_large_image" />',
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+(?:name|property)=["']twitter:url["'][^>]*>/i,
    `<meta name="twitter:url" content="${escapeHtml(canonical)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+(?:name|property)=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+(?:name|property)=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+(?:name|property)=["']twitter:image["'][^>]*>/i,
    `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`,
  );

  return nextHtml;
}

const routeMeta = [
  {
    route: "/the-living-room-concept-store",
    title: "The Living Room Concept Store",
    description:
      "An editorial page about The Living Room Concept Store in Ahangama.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/hero-the-living-room-concept-store.jpeg",
  },
  {
    route: "/lighthouse",
    title: "Lighthouse Guest Pass",
    description:
      "A Lighthouse Hotel guest benefit offering a complimentary Ahangama Pass, with local perks, wallet access, and curated recommendations included with the stay.",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/399746482.jpg?k=dcf8dd932aa01c5c00a96346f8facccd7e423e187db501a3939e4c971d097c18&o=",
  },
  {
    route: "/mosvold",
    title: "Mosvold Guest Pass",
    description:
      "A premium Mosvold guest benefit offering a complimentary Ahangama Pass, with local perks, wallet access, and curated recommendations included with the stay.",
    image:
      "https://www.mosvoldhotels.com/wp-content/uploads/2025/05/About-Mosvold-1920x600-1.jpg",
  },
  {
    route: "/pabc",
    title: "PABC Cardholder Pass Offer",
    description:
      "An exclusive Pan Asia Bank cardholder offer with 25% off the USD 30 Ahangama Pass when purchased using an eligible PABC debit or credit card.",
    image:
      "https://sunshinestories.com/wp-content/uploads/2016/08/Sunshinestories-surf-travel-blog-IMG_8420.jpg",
  },
  {
    route: "/what-is-ahangama-pass",
    title: "What Is The Ahangama Pass?",
    description:
      "Learn what the Ahangama Pass is, how to use it, where Apple Wallet and Google Wallet fit in, and how the savings and extra perks add up.",
    image: () => findBuiltAssetUrl("hero_pass_apple_wallet"),
  },
  {
    route: "/12-things",
    title: "12 Ways to Experience Ahangama",
    description:
      "An editorial guide to Ahangama through surf, cafes, wellness, creative community, inland rituals and the routines that define daily life.",
    image:
      "https://sunshinestories.com/wp-content/uploads/2016/08/Sunshinestories-surf-travel-blog-IMG_8420.jpg",
  },
  {
    route: "/guide",
    title: "Ahangama 2026/2027 Season Guide",
    description: "Ahangama 2026/2027 Season Guide.",
    image:
      "https://content.r9cdn.net/rimg/dimg/09/d4/c553223f-city-304822-172c638b4d6.jpg?crop=true&width=1366&height=768&xhint=1254&yhint=1207",
  },
  {
    route: "/editors-picks",
    title: "Editor's Picks",
    description:
      "Ahangama editorial stories, guides and long-form articles collected in one place.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/hero-the-living-room-concept-store.jpeg",
  },
];

if (!fs.existsSync(indexPath)) {
  console.error(`Route meta generation skipped: missing ${indexPath}`);
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexPath, "utf8");

routeMeta.forEach((meta) => {
  const routeHtml = applyMeta(baseHtml, meta);
  const routeDir = path.join(distDir, meta.route.replace(/^\//, ""));

  ensureDir(routeDir);
  fs.writeFileSync(path.join(routeDir, "index.html"), routeHtml, "utf8");
});

console.log(`✅ Generated route-specific meta HTML for ${routeMeta.length} routes`);