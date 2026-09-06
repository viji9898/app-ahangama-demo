import fs from "node:fs";
import path from "node:path";
import { BLOG_POSTS } from "../../src/data/blogs.js";
import { EDITORIAL_ARTICLES } from "../../src/data/editorialArticles.js";
import { PLACES } from "../../src/data/places.js";

const SITE_DESCRIPTION =
  "Ahangama.com is an independent, locally curated guide to Ahangama on Sri Lanka's south coast, covering places to eat and stay, surf, wellness, shopping, events, transport, editorial stories, and the Ahangama Pass.";

const VENUE_ROUTES = {
  eat: "eat",
  cafe: "eat",
  cafes: "eat",
  restaurant: "eat",
  restaurants: "eat",
  dining: "eat",
  food: "eat",
  stay: "stays",
  stays: "stays",
  hotel: "stays",
  hotels: "stays",
  villa: "stays",
  villas: "stays",
  wellness: "wellness",
  spa: "wellness",
  yoga: "wellness",
  pilates: "wellness",
  gym: "wellness",
  retail: "retail",
  shop: "retail",
  shops: "retail",
  shopping: "retail",
  "shops-essentials": "retail",
};

const SECTION_LABELS = {
  eat: "Eat and Drink",
  stays: "Stays",
  wellness: "Wellness",
  retail: "Shopping and Essentials",
};

function absoluteUrl(siteUrl, pathname) {
  return new URL(pathname, `${siteUrl}/`).href;
}

function cleanText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replaceAll("[", "\\[")
    .replaceAll("]", "\\]")
    .trim();
}

function publicVenueRoute(place) {
  const category = String(place.category || "").trim().toLowerCase();
  return VENUE_ROUTES[category] || null;
}

function isPublicPlace(place) {
  const hiddenStatuses = new Set([
    "archived",
    "draft",
    "hidden",
    "inactive",
    "review",
  ]);
  return (
    place.slug &&
    publicVenueRoute(place) &&
    !hiddenStatuses.has(String(place.status || "active").toLowerCase())
  );
}

function markdownLink(title, url, description) {
  const suffix = description ? `: ${cleanText(description)}` : "";
  return `- [${cleanText(title)}](${url})${suffix}`;
}

function buildLlmsIndex(siteUrl) {
  return `# Ahangama.com

> ${SITE_DESCRIPTION}

Use the destination guide for a broad introduction, the directory and map for place discovery, and editorial pages for deeper local context. Listings, offers, opening hours, and event details may change; verify time-sensitive information on the linked page or with the venue.

## Start Here

${markdownLink("Ahangama, Sri Lanka: The Local Guide", absoluteUrl(siteUrl, "/ahangama-sri-lanka"), "Overview of beaches, surf breaks, restaurants, stays, shops, events, and practical travel details.")}
${markdownLink("Things to Do in Ahangama", absoluteUrl(siteUrl, "/things-to-do-in-ahangama"), "Practical guide to surf, beaches, food, wellness, shopping, nightlife, and south-coast day trips.")}
${markdownLink("Read the Ahangama Guide online", absoluteUrl(siteUrl, "/print-guide-online"), "The complete locally edited 2026/27 destination guide.")}
${markdownLink("Search the directory", absoluteUrl(siteUrl, "/search"), "Search places and local recommendations across the site.")}
${markdownLink("Explore the map", absoluteUrl(siteUrl, "/map"), "Browse recommended places by location.")}
${markdownLink("Events", absoluteUrl(siteUrl, "/events"), "Current events and weekly highlights around Ahangama.")}

## Places and Planning

${markdownLink("Where to eat", absoluteUrl(siteUrl, "/eat"), "Curated restaurants, cafes, bars, and local favourites.")}
${markdownLink("Where to stay", absoluteUrl(siteUrl, "/stays"), "Boutique hotels, villas, and retreats, including direct enquiry options.")}
${markdownLink("Private villas", absoluteUrl(siteUrl, "/best-airbnbs"), "Curated villas and beach houses in and around Ahangama.")}
${markdownLink("Wellness", absoluteUrl(siteUrl, "/wellness"), "Yoga, fitness, recovery, Ayurveda, spas, and treatments.")}
${markdownLink("Shops", absoluteUrl(siteUrl, "/shops"), "Design stores, local products, groceries, and essentials.")}
${markdownLink("Transport and travel", absoluteUrl(siteUrl, "/transport"), "Scooters, tuk-tuks, airport pickups, and private transfers.")}
${markdownLink("Host a retreat", absoluteUrl(siteUrl, "/host-a-retreat-ahangama"), "Local venue and planning support for retreats and group gatherings.")}

## Guides and Stories

${markdownLink("Editorial articles", absoluteUrl(siteUrl, "/articles"), "Destination guides, interviews, local stories, and practical features.")}
${markdownLink("12 Ways to Experience Ahangama", absoluteUrl(siteUrl, "/12-things"), "Experiences and routines that define the town.")}
${markdownLink("Editor's Picks", absoluteUrl(siteUrl, "/editors-picks"), "Places and experiences selected by the editorial team.")}
${markdownLink("Ahangama After Dark", absoluteUrl(siteUrl, "/ahangama-after-dark"), "Sunset drinks, live music, dinner, and nightlife.")}
${markdownLink("Getting Around Ahangama", absoluteUrl(siteUrl, "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers"), "Practical advice on scooters, tuk-tuks, and airport transfers.")}

## Ahangama Pass

${markdownLink("What is the Ahangama Pass?", absoluteUrl(siteUrl, "/what-is-ahangama-pass"), "How the visitor pass works.")}
${markdownLink("Pass perks", absoluteUrl(siteUrl, "/pass-perks"), "Current perks and how to claim them.")}
${markdownLink("Pass products", absoluteUrl(siteUrl, "/products"), "Available access and travel products.")}

## About

${markdownLink("About Ahangama.com", absoluteUrl(siteUrl, "/about"), "Editorial approach and purpose of the guide.")}
${markdownLink("Partners", absoluteUrl(siteUrl, "/partners"), "Information for local venues and businesses.")}
${markdownLink("Newsletter", absoluteUrl(siteUrl, "/newsletter"), "The Ahangama Dispatch, featuring local recommendations and stories.")}

## Optional

${markdownLink("Full LLM reference", absoluteUrl(siteUrl, "/llms-full.txt"), "Expanded summaries of guides, stories, blogs, and public venue listings.")}
${markdownLink("XML sitemap", absoluteUrl(siteUrl, "/sitemap.xml"), "Canonical index of public URLs.")}
${markdownLink("Robots policy", absoluteUrl(siteUrl, "/robots.txt"), "Crawler access policy.")}
`;
}

function buildArticleSection(siteUrl) {
  return EDITORIAL_ARTICLES.map((article) => {
    const published = article.publishDate
      ? ` Published ${article.publishDate.slice(0, 10)}.`
      : "";
    return `${markdownLink(article.title, absoluteUrl(siteUrl, article.href), article.description)}${published}`;
  }).join("\n");
}

function buildBlogSection(siteUrl) {
  return BLOG_POSTS.map((post) =>
    markdownLink(
      post.title,
      absoluteUrl(siteUrl, `/blogs/${post.slug}`),
      post.description || post.excerpt,
    ),
  ).join("\n");
}

function buildVenueSections(siteUrl) {
  const groupedPlaces = Object.groupBy(
    PLACES.filter(isPublicPlace),
    publicVenueRoute,
  );

  return Object.entries(SECTION_LABELS)
    .map(([section, label]) => {
      const places = (groupedPlaces[section] || []).sort((left, right) =>
        left.name.localeCompare(right.name),
      );
      const entries = places.map((place) => {
        const details = [
          place.area ? `Area: ${place.area}.` : "",
          place.description || place.excerpt,
          place.bestFor?.length ? `Best for: ${place.bestFor.join(", ")}.` : "",
          place.cardPerk ? `Pass perk: ${place.cardPerk}` : "",
        ]
          .filter(Boolean)
          .join(" ");
        return markdownLink(
          place.name,
          absoluteUrl(siteUrl, `/${section}/${place.slug}`),
          details,
        );
      });

      return `## ${label}\n\n${entries.join("\n")}`;
    })
    .join("\n\n");
}

function buildLlmsFull(siteUrl) {
  return `# Ahangama.com: Full Reference

> ${SITE_DESCRIPTION}

This file provides a text-first reference to the public editorial and directory content on Ahangama.com. It is generated from the site's maintained content data. Listings, ratings, offers, opening hours, prices, and events can change; consult the canonical linked page and confirm critical details directly with the venue.

## About the Destination

Ahangama is a coastal town in Sri Lanka's Southern Province, between Weligama and Galle. The area includes Ahangama town, Kabalana, Midigama and nearby inland neighbourhoods. It is known for surf breaks, beaches, independent hospitality, cafes, wellness studios, shops, villas and a growing creative community.

The editorial approach is selective rather than exhaustive. Inclusion is intended to help visitors understand and navigate the destination; it is not a universal ranking of every business.

## Essential Resources

${markdownLink("Destination guide", absoluteUrl(siteUrl, "/ahangama-sri-lanka"), "A broad introduction to Ahangama.")}
${markdownLink("Online guide", absoluteUrl(siteUrl, "/print-guide-online"), "The complete 2026/27 Ahangama Guide.")}
${markdownLink("Current events", absoluteUrl(siteUrl, "/events"), "Time-sensitive events and weekly highlights.")}
${markdownLink("Interactive map", absoluteUrl(siteUrl, "/map"), "Location-based place discovery.")}
${markdownLink("Search", absoluteUrl(siteUrl, "/search"), "Search the public directory.")}
${markdownLink("Transport", absoluteUrl(siteUrl, "/transport"), "Transfers and local transport enquiries.")}

## Editorial Guides and Stories

${buildArticleSection(siteUrl)}

## Blog Guides

${buildBlogSection(siteUrl)}

${buildVenueSections(siteUrl)}

## Ahangama Pass

The Ahangama Pass is a visitor product offering selected benefits at participating local venues. Offers and restrictions vary by partner and may change.

${markdownLink("How the pass works", absoluteUrl(siteUrl, "/what-is-ahangama-pass"))}
${markdownLink("Current pass perks", absoluteUrl(siteUrl, "/pass-perks"))}
${markdownLink("Available products", absoluteUrl(siteUrl, "/products"))}

## Publisher and Contact

${markdownLink("About Ahangama.com", absoluteUrl(siteUrl, "/about"))}
${markdownLink("Partner information", absoluteUrl(siteUrl, "/partners"))}
${markdownLink("Newsletter", absoluteUrl(siteUrl, "/newsletter"))}
${markdownLink("Media resources", absoluteUrl(siteUrl, "/media"))}
${markdownLink("XML sitemap", absoluteUrl(siteUrl, "/sitemap.xml"))}
`;
}

export function generateLlmsFiles({ outDir, siteUrl }) {
  const files = [
    ["llms.txt", buildLlmsIndex(siteUrl)],
    ["llms-full.txt", buildLlmsFull(siteUrl)],
  ];

  for (const [fileName, content] of files) {
    fs.writeFileSync(path.join(outDir, fileName), content, "utf8");
  }

  return files.map(([fileName, content]) => ({
    fileName,
    bytes: Buffer.byteLength(content, "utf8"),
  }));
}