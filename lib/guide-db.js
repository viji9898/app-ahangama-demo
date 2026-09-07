import process from "node:process";
import pg from "pg";

const { Pool } = pg;

let pool;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || "";
    if (!connectionString) {
      throw new Error("Missing env var: DATABASE_URL");
    }
    pool = new Pool({ connectionString });
  }
  return pool;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toVenueDto(row) {
  return {
    id: row.id,
    section: row.section,
    name: row.name,
    slug: row.slug,
    description: row.description || "",
    image: row.image || "",
    lat: row.lat,
    lng: row.lng,
    instagram: row.instagram || "",
    googleMaps: row.google_maps || "",
    website: row.website || "",
    rating: row.rating,
    reviewCount: row.review_count || 0,
    googlePlaceId: row.google_place_id || "",
    ownership: row.ownership || "",
    tagline: row.tagline || "",
    priorityOrder: row.priority_order || 0,
    status: row.status || "active",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toContentDto(row) {
  return {
    sectionKey: row.section_key,
    title: row.title || "",
    body: row.body || "",
    image: row.image || "",
    updatedAt: row.updated_at,
  };
}

export async function listGuideVenues({ section = "", status = "" } = {}) {
  const where = ["deleted_at IS NULL"];
  const params = [];
  let idx = 1;

  if (section) {
    where.push(`section = $${idx}`);
    params.push(section);
    idx++;
  }
  if (status) {
    where.push(`status = $${idx}`);
    params.push(status);
    idx++;
  }

  const sql = `
    SELECT * FROM guide_venues
    WHERE ${where.join(" AND ")}
    ORDER BY section, priority_order ASC, name ASC
  `;
  const result = await getPool().query(sql, params);
  return result.rows.map(toVenueDto);
}

export async function getGuideVenue(id) {
  const result = await getPool().query(
    "SELECT * FROM guide_venues WHERE id = $1 AND deleted_at IS NULL",
    [id]
  );
  if (!result.rows[0]) return null;
  return toVenueDto(result.rows[0]);
}

export async function createGuideVenue(data) {
  const id = data.id || slugify(data.name);
  const slug = data.slug || slugify(data.name);
  const result = await getPool().query(
    `INSERT INTO guide_venues (id, section, name, slug, description, image, lat, lng, instagram, google_maps, website, rating, review_count, google_place_id, ownership, tagline, priority_order, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
     RETURNING *`,
    [
      id, data.section, data.name, slug, data.description || "", data.image || "",
      data.lat || null, data.lng || null, data.instagram || "", data.googleMaps || "",
      data.website || "", data.rating || null, data.reviewCount || 0, data.googlePlaceId || "",
      data.ownership || null, data.tagline || null, data.priorityOrder || 0, data.status || "active"
    ]
  );
  return toVenueDto(result.rows[0]);
}

export async function updateGuideVenue(id, data) {
  const fields = [];
  const params = [];
  let idx = 1;

  const updatable = [
    "section", "name", "description", "image", "lat", "lng",
    "instagram", "googleMaps", "website", "rating", "reviewCount",
    "googlePlaceId", "ownership", "tagline", "priorityOrder", "status"
  ];
  const dbColumns = {
    section: "section", name: "name", description: "description", image: "image",
    lat: "lat", lng: "lng", instagram: "instagram", googleMaps: "google_maps",
    website: "website", rating: "rating", reviewCount: "review_count",
    googlePlaceId: "google_place_id", ownership: "ownership", tagline: "tagline",
    priorityOrder: "priority_order", status: "status"
  };

  for (const key of updatable) {
    if (data[key] !== undefined) {
      fields.push(`${dbColumns[key]} = $${idx}`);
      params.push(data[key]);
      idx++;
    }
  }

  if (fields.length === 0) return getGuideVenue(id);

  fields.push(`updated_at = NOW()`);
  params.push(id);

  const result = await getPool().query(
    `UPDATE guide_venues SET ${fields.join(", ")} WHERE id = $${idx} AND deleted_at IS NULL RETURNING *`,
    params
  );
  if (!result.rows[0]) return null;
  return toVenueDto(result.rows[0]);
}

export async function deleteGuideVenue(id) {
  await getPool().query(
    "UPDATE guide_venues SET deleted_at = NOW() WHERE id = $1",
    [id]
  );
  return { ok: true };
}

export async function reorderGuideVenues(section, orderedIds) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    for (let i = 0; i < orderedIds.length; i++) {
      await client.query(
        "UPDATE guide_venues SET priority_order = $1, updated_at = NOW() WHERE id = $2 AND section = $3",
        [i + 1, orderedIds[i], section]
      );
    }
    await client.query("COMMIT");
    return { ok: true };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function listGuideContent() {
  const result = await getPool().query(
    "SELECT * FROM guide_content ORDER BY section_key ASC"
  );
  return result.rows.map(toContentDto);
}

export async function updateGuideContent(sectionKey, data) {
  const result = await getPool().query(
    `INSERT INTO guide_content (section_key, title, body, image, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (section_key) DO UPDATE SET title = $2, body = $3, image = $4, updated_at = NOW()
     RETURNING *`,
    [sectionKey, data.title || "", data.body || "", data.image || ""]
  );
  return toContentDto(result.rows[0]);
}

export async function getGuideContent(sectionKey) {
  const result = await getPool().query(
    "SELECT * FROM guide_content WHERE section_key = $1",
    [sectionKey]
  );
  if (!result.rows[0]) return null;
  return toContentDto(result.rows[0]);
}
