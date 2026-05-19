import process from "node:process";
import pg from "pg";

const { Pool } = pg;

const VENUES_TABLE = "venues260414";

let pool;

function getConnectionString() {
  return process.env.DATABASE_URL || "";
}

function getPool() {
  if (!pool) {
    const connectionString = getConnectionString();

    if (!connectionString) {
      throw new Error("Missing env var: DATABASE_URL");
    }

    pool = new Pool({ connectionString });
  }

  return pool;
}

function normalizeOptionalText(value) {
  if (value === null || value === undefined) return null;

  const normalized = String(value).trim();
  return normalized ? normalized : null;
}

function normalizeStringArray(value) {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value.map((entry) => normalizeOptionalText(entry)).filter(Boolean),
      ),
    );
  }

  const normalized = normalizeOptionalText(value);
  return normalized ? [normalized] : [];
}

function normalizeStatus(value) {
  const normalized = normalizeOptionalText(value)?.toLowerCase();

  if (
    ["active", "inactive", "coming_soon", "draft", "archived"].includes(
      normalized,
    )
  ) {
    return normalized;
  }

  return "active";
}

function normalizeCategory(row) {
  const explicit = normalizeOptionalText(row.category)?.toLowerCase();
  if (explicit) return explicit;

  const firstBestFor = normalizeStringArray(row.best_for)[0];
  return firstBestFor ? firstBestFor.toLowerCase() : null;
}

function normalizeNumber(value) {
  if (value === null || value === undefined || value === "") return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeBoolean(value) {
  if (typeof value === "boolean") return value;
  if (value === null || value === undefined) return false;

  const normalized = String(value).trim().toLowerCase();
  return ["true", "1", "yes", "y"].includes(normalized);
}

function extractInstagramHandle(value) {
  const normalized = normalizeOptionalText(value);
  if (!normalized) return null;

  if (/^https?:\/\//i.test(normalized)) {
    const match = normalized.match(/instagram\.com\/([^/?#]+)/i);
    return match?.[1] ? match[1].replace(/^@/, "") : normalized;
  }

  return normalized.replace(/^@/, "");
}

function buildMapUrl(row) {
  const direct = normalizeOptionalText(row.map_url);
  if (direct) return direct;

  const googlePlaceId = normalizeOptionalText(row.google_place_id);
  if (googlePlaceId) {
    return `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(googlePlaceId)}`;
  }

  if (
    row.lat !== null &&
    row.lat !== undefined &&
    row.lng !== null &&
    row.lng !== undefined
  ) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${row.lat},${row.lng}`)}`;
  }

  return null;
}

function normalizeOffer(value) {
  const entries = normalizeStringArray(value);
  if (!entries.length) return null;

  return entries.join(" • ");
}

function toVenueDto(row) {
  const category = normalizeCategory(row);
  const offer = normalizeOffer(row.offer);
  const instagram = extractInstagramHandle(row.instagram);
  const price = normalizeOptionalText(row.price);
  const hours = normalizeOptionalText(row.hours);

  return {
    id: row.id,
    destinationSlug:
      normalizeOptionalText(row.destination_slug)?.toLowerCase() || "ahangama",
    category,
    categories: category ? [category] : [],
    name: normalizeOptionalText(row.name) || "Untitled venue",
    slug: normalizeOptionalText(row.slug) || String(row.id),
    status: normalizeStatus(row.status),
    live: normalizeBoolean(row.live),
    editorialTags: normalizeStringArray(row.editorial_tags),
    isPassVenue: normalizeBoolean(row.is_pass_venue),
    staffPick: normalizeBoolean(row.staff_pick),
    isFeatured: normalizeBoolean(row.is_featured),
    priorityScore: normalizeNumber(row.priority_score) || 0,
    passPriority: normalizeNumber(row.pass_priority) || 0,
    stars: normalizeNumber(row.stars),
    reviews: normalizeNumber(row.reviews) || 0,
    discount: normalizeNumber(row.discount),
    excerpt:
      normalizeOptionalText(row.excerpt) ||
      normalizeOptionalText(row.card_perk) ||
      normalizeOptionalText(row.description) ||
      "",
    description:
      normalizeOptionalText(row.description) ||
      normalizeOptionalText(row.excerpt) ||
      normalizeOptionalText(row.card_perk) ||
      "",
    bestFor: normalizeStringArray(row.best_for),
    tags: normalizeStringArray(row.tags),
    cardPerk: normalizeOptionalText(row.card_perk),
    offer,
    offers: normalizeStringArray(row.offer),
    howToClaim: normalizeOptionalText(row.how_to_claim),
    restrictions: normalizeOptionalText(row.restrictions),
    price,
    hours,
    area: normalizeOptionalText(row.area),
    lat: normalizeNumber(row.lat),
    lng: normalizeNumber(row.lng),
    logo: normalizeOptionalText(row.logo),
    image: normalizeOptionalText(row.image) || normalizeOptionalText(row.logo),
    ogImage:
      normalizeOptionalText(row.og_image) ||
      normalizeOptionalText(row.image) ||
      normalizeOptionalText(row.logo),
    mapUrl: buildMapUrl(row),
    googlePlaceId: normalizeOptionalText(row.google_place_id),
    email: normalizeOptionalText(row.email),
    instagram,
    instagramUrl: instagram
      ? `https://instagram.com/${instagram.replace(/^@/, "")}`
      : null,
    whatsapp: normalizeOptionalText(row.whatsapp),
    whatsApp: normalizeOptionalText(row.whatsapp),
    createdBy: normalizeOptionalText(row.created_by),
    updatedBy: normalizeOptionalText(row.updated_by),
    lastVerifiedAt: row.last_verified_at || null,
    deletedAt: row.deleted_at || null,
    source: normalizeOptionalText(row.source),
    notesInternal: normalizeOptionalText(row.notes_internal),
    updatedAt: row.updated_at || null,
    createdAt: row.created_at || null,
  };
}

export async function listVenues({
  destinationSlug = "ahangama",
  q = "",
  category = "",
} = {}) {
  const where = ["destination_slug = $1", "deleted_at IS NULL"];
  const params = [destinationSlug.trim().toLowerCase()];
  let idx = 2;

  const normalizedQuery = q.trim().toLowerCase();
  if (normalizedQuery) {
    where.push(
      `(lower(name) LIKE $${idx}
        OR lower(coalesce(excerpt, '')) LIKE $${idx}
        OR lower(coalesce(description, '')) LIKE $${idx}
        OR lower(coalesce(card_perk, '')) LIKE $${idx}
        OR EXISTS (SELECT 1 FROM unnest(coalesce(tags, ARRAY[]::text[])) tag WHERE lower(tag) LIKE $${idx})
      )`,
    );
    params.push(`%${normalizedQuery}%`);
    idx += 1;
  }

  const normalizedCategory = category.trim().toLowerCase();
  if (normalizedCategory) {
    where.push(`lower(coalesce(category, '')) = $${idx}`);
    params.push(normalizedCategory);
    idx += 1;
  }

  const sql = `
    SELECT
      id, destination_slug, category, name, slug, status,
      live,
      editorial_tags, is_pass_venue, staff_pick, is_featured, priority_score, pass_priority,
      stars, reviews, discount,
      excerpt, description,
      best_for, tags,
      card_perk, offer,
      how_to_claim, restrictions,
      price, hours, area, lat, lng,
      logo, image, og_image,
      map_url, google_place_id, email, instagram, whatsapp,
      created_by, updated_by, last_verified_at, deleted_at, source, notes_internal,
      updated_at, created_at
    FROM ${VENUES_TABLE}
    WHERE ${where.join(" AND ")}
    ORDER BY is_featured DESC, priority_score DESC, pass_priority DESC, staff_pick DESC, stars DESC NULLS LAST, name ASC
    LIMIT 500
  `;

  const result = await getPool().query(sql, params);
  return result.rows.map(toVenueDto);
}

export async function getVenueBySlug(slug) {
  const normalizedSlug = normalizeOptionalText(slug)?.toLowerCase();

  if (!normalizedSlug) {
    return null;
  }

  const result = await getPool().query(
    `
      SELECT
        id, destination_slug, category, name, slug, status,
        live,
        editorial_tags, is_pass_venue, staff_pick, is_featured, priority_score, pass_priority,
        stars, reviews, discount,
        excerpt, description,
        best_for, tags,
        card_perk, offer,
        how_to_claim, restrictions,
        price, hours, area, lat, lng,
        logo, image, og_image,
        map_url, google_place_id, email, instagram, whatsapp,
        created_by, updated_by, last_verified_at, deleted_at, source, notes_internal,
        updated_at, created_at
      FROM ${VENUES_TABLE}
      WHERE deleted_at IS NULL AND lower(slug) = $1
      LIMIT 1
    `,
    [normalizedSlug],
  );

  return toVenueDto(result.rows[0]);
}
