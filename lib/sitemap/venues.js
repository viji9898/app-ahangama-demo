import { PLACES } from "../../src/data/places.js";
import {
  buildAbsoluteAssetUrl,
  createSitemapEntry,
  extractImageUrls,
  tryQueryRows,
} from "./utils.js";

export const VENUE_SECTION_ROUTE_MAP = {
  eat: "eat",
  cafe: "eat",
  cafes: "eat",
  restaurant: "eat",
  restaurants: "eat",
  dining: "eat",
  food: "eat",
  stays: "stays",
  stay: "stays",
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
  shops: "retail",
  shop: "retail",
  shopping: "retail",
  "shops-essentials": "retail",
};

let venueRowsPromise;

function normalizeText(value) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function getVenueSection(category) {
  return VENUE_SECTION_ROUTE_MAP[normalizeText(category).toLowerCase()] || null;
}

function hasPublicVenueStatus(status) {
  const normalized = normalizeText(status).toLowerCase();
  return !["archived", "draft", "hidden", "inactive", "review"].includes(
    normalized,
  );
}

function mapStaticPlace(place) {
  return {
    slug: place.slug,
    category: place.category,
    status: place.status || "active",
    updated_at: place.updatedAt || place.updated_at || null,
    created_at: place.createdAt || place.created_at || null,
    image: place.image,
    og_image: place.ogImage,
    logo: place.logo,
    raw: place,
  };
}

async function loadVenueRows() {
  if (!venueRowsPromise) {
    venueRowsPromise = (async () => {
      const rows = await tryQueryRows(`
        SELECT
          slug,
          category,
          status,
          updated_at,
          created_at,
          image,
          og_image,
          logo,
          TO_JSONB(venues260414.*) AS raw
        FROM venues260414
        WHERE destination_slug = $1
          AND deleted_at IS NULL
          AND slug IS NOT NULL
        ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST, slug ASC
      `, ["ahangama"]);

      if (rows?.length) return rows;

      return PLACES.map(mapStaticPlace);
    })();
  }

  return venueRowsPromise;
}

export async function getVenueSectionEntries(sectionName, { siteUrl }) {
  const rows = await loadVenueRows();

  return rows
    .filter((row) => getVenueSection(row.category) === sectionName)
    .filter((row) => row.slug && hasPublicVenueStatus(row.status))
    .map((row) => {
      const images = extractImageUrls(row.raw || row, siteUrl);
      const ogImage = buildAbsoluteAssetUrl(row.og_image, siteUrl);
      const image = buildAbsoluteAssetUrl(row.image, siteUrl);
      const logo = buildAbsoluteAssetUrl(row.logo, siteUrl);

      return createSitemapEntry({
        pathname: `/${sectionName}/${row.slug}`,
        siteUrl,
        lastmod: row.updated_at || row.created_at,
        images: [...images, ogImage, image, logo],
      });
    });
}

export async function getAllVenueImageEntries({ siteUrl }) {
  const rows = await loadVenueRows();

  return rows
    .filter((row) => row.slug && hasPublicVenueStatus(row.status))
    .map((row) => {
      const sectionName = getVenueSection(row.category);
      if (!sectionName) return null;

      return createSitemapEntry({
        pathname: `/${sectionName}/${row.slug}`,
        siteUrl,
        lastmod: row.updated_at || row.created_at,
        images: extractImageUrls(row.raw || row, siteUrl),
      });
    })
    .filter((entry) => entry?.images?.length);
}
