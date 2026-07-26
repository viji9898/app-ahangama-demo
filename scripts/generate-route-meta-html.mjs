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
const defaultAuthor = "viji.com";
const defaultPublishDate = "2026-06-12T00:00:00.000Z";

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

function serializeJsonLd(data) {
  return JSON.stringify(data).replaceAll("</script>", "<\\/script>");
}

function buildAuthorSchema(author) {
  const hasUrl = /^https?:\/\//i.test(author);

  if (hasUrl) {
    return {
      "@type": "Organization",
      name: author,
      url: author,
    };
  }

  if (author.includes(".")) {
    return {
      "@type": "Organization",
      name: author,
      url: `https://${author}`,
    };
  }

  return {
    "@type": "Person",
    name: author,
  };
}

function buildAbsoluteUrl(routePath) {
  const normalizedPath = routePath.startsWith("/")
    ? routePath
    : `/${routePath}`;
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
  const author = meta.author || defaultAuthor;
  const publishDate = meta.publishDate || defaultPublishDate;
  const pageType = meta.type || (meta.publishDate ? "article" : "website");
  const ogImage = meta.image
    ? typeof meta.image === "function"
      ? meta.image()
      : meta.image
    : null;

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
    /<meta\s+name=["']author["'][^>]*>/i,
    `<meta name="author" content="${escapeHtml(author)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+property=["']author["'][^>]*>/i,
    `<meta property="author" content="${escapeHtml(author)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+name=["']publish_date["'][^>]*>/i,
    `<meta name="publish_date" content="${escapeHtml(publishDate)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+property=["']og:type["'][^>]*>/i,
    `<meta property="og:type" content="${escapeHtml(pageType)}" />`,
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
    /<meta\s+property=["']article:author["'][^>]*>/i,
    `<meta property="article:author" content="${escapeHtml(author)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+name=["']article:author["'][^>]*>/i,
    `<meta name="article:author" content="${escapeHtml(author)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+property=["']article:published_time["'][^>]*>/i,
    `<meta property="article:published_time" content="${escapeHtml(publishDate)}" />`,
  );
  if (ogImage) {
    nextHtml = replaceOrInsert(
      nextHtml,
      /<meta\s+property=["']og:image["'][^>]*>/i,
      `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
    );
    nextHtml = replaceOrInsert(
      nextHtml,
      /<meta\s+property=["']og:image:secure_url["'][^>]*>/i,
      `<meta property="og:image:secure_url" content="${escapeHtml(ogImage)}" />`,
    );
    nextHtml = replaceOrInsert(
      nextHtml,
      /<meta\s+name=["']twitter:card["'][^>]*>/i,
      '<meta name="twitter:card" content="summary_large_image" />',
    );
  }
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
  if (ogImage) {
    nextHtml = replaceOrInsert(
      nextHtml,
      /<meta\s+(?:name|property)=["']twitter:image["'][^>]*>/i,
      `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`,
    );
  }

  if (pageType === "article") {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: meta.title,
      description: meta.description,
      author: buildAuthorSchema(author),
      datePublished: publishDate,
      dateModified: publishDate,
      mainEntityOfPage: canonical,
      url: canonical,
      ...(ogImage ? { image: [ogImage] } : {}),
    };

    nextHtml = replaceOrInsert(
      nextHtml,
      /<script\s+type=["']application\/ld\+json["']\s+data-route-article-schema=["']true["']>[\s\S]*?<\/script>/i,
      `<script type="application/ld+json" data-route-article-schema="true">${serializeJsonLd(articleSchema)}</script>`,
    );
  }

  return nextHtml;
}

const routeMeta = [
  {
    route: "/tip",
    title: "Tourism Intelligence Platform | Ahangama.com",
    description:
      "Ahangama.com helps local businesses reach visitors through personalised recommendations, curated guides, and monthly visitor intelligence.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/ogImage-tip.jpg",
  },
  {
    route: "/hospo",
    title: "Exclusive for Hospo Community | Hospo",
    description:
      "Claim the free Ahangama Hospo Community pass for members and share a few details so the team can understand who is joining.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hospo_complimentry_pass.jpg",
  },
  {
    route: "/comp-pass",
    title: "Complimentary Ahangama Pass Signup",
    description:
      "Sign up for a complimentary Ahangama Pass and unlock local perks, picks, and benefits around Ahangama.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/ogImgw-comp-pass.jpg",
  },
  {
    route: "/the-living-room-concept-store",
    title: "The Living Room Concept Store",
    description:
      "A design-led retail and coffee space in Ahangama, shaped around the feeling of home, slow discovery and a more thoughtful way to spend time in town.",
    publishDate: "2026-05-18T09:15:00.000Z",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/hero-the-living-room-concept-store.jpeg",
  },
  {
    route:
      "/staff-pick-experience-a-day-that-slowly-erases-your-plan-in-ahangama",
    title:
      "Staff Pick Experience: A Day That Slowly Erases Your Plan in Ahangama",
    description:
      "A staff-picked Ahangama day that moves through coffee, surf, cooking, tuk tuks, sunset, live music and the slow pleasure of letting the plan dissolve.",
    publishDate: "2026-06-30T09:00:00.000Z",
    author: "Ahangama Guide Editorial Team",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/staff-pick-experience-a-day-that-slowly-erases-your-plan-in-ahangama/Hero+image+_+ahangama-morning-coffee-hands-cups-close-up.webp",
  },
  {
    route: "/best-sunsets-in-ahangama",
    title: "Best Sunsets in Ahangama",
    description:
      "The best sunset spot in Ahangama this week, when to arrive, where to stand, and the nearby beaches worth considering for golden hour.",
    publishDate: "2026-06-30T09:00:00.000Z",
    author: "Ahangama Guide Editorial Team",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/best-sunsets/Hero+Image+-+2400+x+1600+px.webp",
  },
  {
    route: "/community-market-in-ahangama",
    title: "Community Markets in Ahangama",
    description:
      "Where local creativity, makers, and travellers come together through Ahangama's pop-up markets, workshops, music, and community gatherings.",
    publishDate: "2026-06-25T09:00:00.000Z",
    author: "Ahangama Guide Editorial Team",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/community-markets-in-ahangama/Hero+image+_+community-markets-ahangama-crowd-stalls.webp",
  },
  {
    route:
      "/where-ahangama-gathers-for-sunset-stairway-rooftop-bar-at-lighthouse-hotel",
    title: "Where Ahangama Gathers for Sunset - Stairway Rooftop Bar",
    description:
      "A sunset story from Stairway Rooftop Bar at Lighthouse Hotel, where cocktails, ocean views and Ahangama's evening rhythm meet.",
    publishDate: "2026-06-21T09:00:00.000Z",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/where-ahangama-gathers-for-sunset+/hero-view-from-the-bar.jpg",
  },
  {
    route: "/inside-the-launch-of-ahangama-circle",
    title: "Inside the Launch of Ahangama Circle",
    description:
      "Inside the first Ahangama Circle gathering, where the south's business owners, creatives and hospitality community came together at Surf Club Midigama.",
    publishDate: "2026-07-26T09:00:00.000Z",
    author: "Ahangama Guide Editorial Team",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/inside-the-launch-of-ahangama-circle/hero+-+Guests+networking+at+Surf+Club+Midigama+during+sunset+-+Option+01+.jpeg",
  },
  {
    route: "/dulasiri-uncle",
    title: "Dulasiri Uncle",
    description:
      "Words by Federica Lazza. A quiet personal story about friendship, family warmth, and gratitude in Ahangama.",
    publishDate: "2026-06-13T09:00:00.000Z",
    author: "Federica Lazza",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/dulasiri-uncle/Dulasiri-on-the-beach-holding-a-turtle.jpg",
  },
  {
    route: "/article-guideline",
    title: "Article Guideline",
    description:
      "Editorial guidelines for writing, laying out, naming images, sizing media, and preparing SEO for Ahangama article pages.",
    publishDate: "2026-06-14T09:00:00.000Z",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/admin/wireframing-elements-web-design.webp",
  },
  {
    route: "/lighthouse",
    title: "Lighthouse Guest Pass",
    description:
      "A Lighthouse Hotel guest benefit offering a complimentary Ahangama Pass, with local perks, wallet access, and curated recommendations included with the stay.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/comp_pass/light-house-beach-view-wide.webp",
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
    route: "/kaffi",
    title: "Kaffi Guest Pass",
    description:
      "A Kaffi guest benefit offering a complimentary Ahangama Pass, with local perks, wallet access, and curated recommendations included with the visit.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/comp_pass/kaffi-ahangama-outdoors-wide.webp",
  },
  {
    route: "/gusta",
    title: "Gusta Guest Pass",
    description:
      "A Gusta guest benefit offering a complimentary Ahangama Pass, with local perks, wallet access, and curated recommendations included with the visit.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/comp_pass/gusta-evening-wide.webp",
  },
  {
    route: "/surf-club",
    title: "Surf Club Guest Pass",
    description:
      "A Surf Club guest benefit offering a complimentary Ahangama Pass, with local perks, wallet access, and curated recommendations included with the visit.",
    image:
      "https://ahangama-pass.s3.eu-west-2.amazonaws.com/venues/surf-club/image.jpg",
  },
  {
    route: "/tahini",
    title: "Tahini & Friends Guest Pass",
    description:
      "A Tahini & Friends guest benefit offering a complimentary Ahangama Pass, with local perks, wallet access, and curated recommendations included with the visit.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/comp_pass/tahini-and-friends-yoga-area-wide.webp",
  },
  {
    route: "/living-Room",
    title: "Living Room Guest Pass",
    description:
      "A Living Room guest benefit offering a complimentary Ahangama Pass, with local perks, wallet access, and curated recommendations included with the visit.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/comp_pass/living-room-wide.webp",
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
    publishDate: "2026-05-27T08:40:00.000Z",
    image:
      "https://sunshinestories.com/wp-content/uploads/2016/08/Sunshinestories-surf-travel-blog-IMG_8420.jpg",
  },
  {
    route: "/guide",
    title: "Ahangama 2026/2027 Season Guide",
    description: "Ahangama 2026/2027 Season Guide.",
    publishDate: "2026-06-03T07:30:00.000Z",
    image:
      "https://content.r9cdn.net/rimg/dimg/09/d4/c553223f-city-304822-172c638b4d6.jpg?crop=true&width=1366&height=768&xhint=1254&yhint=1207",
  },
  {
    route: "/editors-picks",
    title: "Editor's Picks",
    description:
      "A design-led retail and coffee space in Ahangama, shaped around the feeling of home, slow discovery and a more thoughtful way to spend time in town.",
    publishDate: "2026-06-08T10:20:00.000Z",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/hero-the-living-room-concept-store.jpeg",
  },
  {
    route: "/why-surfing-changed-everything-in-ahangama",
    title: "Why Surfing Changed Everything in Ahangama",
    description:
      "A short editorial on how surf culture reshaped modern Ahangama, from Kabalana mornings to the cafes, camps, and creative businesses that followed.",
    publishDate: "2026-05-11T06:55:00.000Z",
    image:
      "https://images.pexels.com/photos/19065606/pexels-photo-19065606.jpeg",
  },
  {
    route: "/sri-lankas-most-interesting-coastal-town",
    title: "Sri Lanka's Most Interesting Coastal Town",
    description:
      "An editorial on why Ahangama has become one of Sri Lanka's most distinctive coastal destinations, shaped by surf, hospitality, food, wellness, and community.",
    publishDate: "2026-06-12T11:05:00.000Z",
    image:
      "https://content.r9cdn.net/rimg/dimg/09/d4/c553223f-city-304822-172c638b4d6.jpg?crop=true&width=1366&height=768&xhint=1254&yhint=1207",
  },
  {
    route: "/where-to-stay-on-sri-lankas-southern-coast",
    title: "Where to Stay on Sri Lanka's Southern Coast",
    description:
      "A guide to the hotels, villas and retreats shaping a new chapter on Sri Lanka's south coast.",
    publishDate: "2026-05-22T14:10:00.000Z",
    image:
      "https://images.suitcasemag.com/wp-content/uploads/2025/03/05163113/HERO2-TheFind-SouthCoastSriLanka.jpeg",
  },
  {
    route: "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers",
    title: "Getting Around Ahangama",
    description:
      "A practical guide to scooters, tuk-tuks, airport transfers and exploring Sri Lanka's southern coast.",
    publishDate: "2026-06-01T12:25:00.000Z",
    image:
      "https://images.suitcasemag.com/wp-content/uploads/2025/03/21082617/SurfTrip_2042-copy-2.jpeg",
  },
  {
    route: "/3-days-in-ahangama",
    title: "3 Days in Ahangama: A Personal Wellness Stay at Samba",
    description:
      "A personal 3-day Ahangama itinerary built around a stay at Samba, with coworking blocks, wellness sessions, and a practical Ahangama Pass cost breakdown.",
    publishDate: "2026-05-30T15:45:00.000Z",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/stays/Asset+33samba.webp",
  },
  {
    route: "/eat",
    title: "Eats | Ahangama",
    description:
      "An editorial guide to where to eat in Ahangama, from coffee and long lunches to local favourites, sunset drinks and date-night tables.",
    publishDate: "2026-06-05T13:35:00.000Z",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+27maria-bonita.webp",
  },
  {
    route: "/shops",
    title: "Shops | Ahangama",
    description:
      "An editorial guide to shops and everyday essentials in Ahangama, from design-led retail and local finds to practical stores worth knowing.",
    publishDate: "2026-05-14T16:05:00.000Z",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/mukti.jpg",
  },
  {
    route: "/products",
    title: "Ahangama Pass Ecosystem",
    description:
      "A curated access layer for experiencing Ahangama through perks, experiences, local discovery, and premium travel support.",
  },
  {
    route: "/card",
    title: "Ahangama Card",
    description:
      "Choose from multiple pass options designed for different travel styles in Ahangama.",
  },
  {
    route: "/about",
    title: "About - Ahangama",
    description:
      "Learn about our curated guide to Ahangama - a thoughtful approach to travel that prioritizes quality over quantity, built for independent travelers and long-stay visitors.",
  },
  {
    route: "/blogs",
    title: "Ahangama Blogs — Real Visitor Stories, Guides, and Experiences",
    description:
      "A collection of Ahangama blog posts shaped by real visitor experiences, return trips, slow stays, surf mornings, food notes, and local discoveries.",
    publishDate: "2026-06-09T09:50:00.000Z",
  },
  {
    route: "/events",
    title: "Events | Ahangama Events Agenda",
    description:
      "A daily guide to what's happening around town in Ahangama, with this week's editorial calendar and event highlights.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/july_events_ahangama.jpg",
  },
  {
    route: "/newsletter",
    title: "The Ahangama Dispatch",
    description:
      "A monthly editorial letter covering local recommendations, openings, events, guides and stories from Ahangama.",
    publishDate: "2026-05-25T07:05:00.000Z",
  },
  {
    route: "/newsletter-data",
    title: "Newsletter Data | Ahangama",
    description:
      "Newsletter vendor data for Ahangama recommendations, including taglines, categories, Instagram handles, coordinates and Google Maps links.",
  },
  {
    route: "/local-intelligence",
    title:
      "Ahangama Intelligence | Live Snapshot of What Is Happening Right Now",
    description:
      "Local updates, openings, events and observations from around town. A live editorial snapshot of what is happening in Ahangama right now.",
    publishDate: "2026-06-06T18:15:00.000Z",
  },
  {
    route: "/partners",
    title: "Ahangama.com Platform",
    description:
      "Ahangama.com is positioned as the customer acquisition and distribution platform for tourism businesses in Ahangama.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero_ahangama.jpg",
  },
  {
    route: "/search",
    title: "Search Ahangama",
    description:
      "Browse everything in Ahangama — search across food, stays, and experiences.",
  },
  {
    route: "/map",
    title: "Map — Ahangama",
    description:
      "A calm, curated map of places in Ahangama — designed to guide, not overwhelm.",
  },
  {
    route: "/offers",
    title: "Ahangama Pass Full List",
    description:
      "Browse the full list of Ahangama Pass partners, organized by the top best-for categories from the live venue data.",
  },
  {
    route: "/full-list",
    title: "Ahangama Pass Full List",
    description:
      "Browse the full list of Ahangama Pass partners, organized by the top best-for categories from the live venue data.",
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

console.log(
  `✅ Generated route-specific meta HTML for ${routeMeta.length} routes`,
);
