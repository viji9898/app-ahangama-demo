import process from "node:process";
import pg from "pg";

const { Pool } = pg;
const GUIDE_KEY = "ahangama-guide";

let pool;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || "";
    if (!connectionString) throw new Error("Missing env var: DATABASE_URL");
    pool = new Pool({ connectionString });
    pool.on("error", (error) => {
      console.error("Unexpected guide database pool error:", error);
    });
  }
  return pool;
}

function optionalText(value) {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim();
  return normalized || null;
}

function optionalNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : null;
}

function instagramUrl(value) {
  const normalized = optionalText(value);
  if (!normalized) return "";
  if (/^https?:\/\//i.test(normalized)) return normalized;
  return `https://instagram.com/${normalized.replace(/^@/, "")}`;
}

function mapUrl(row) {
  if (row.map_url) return row.map_url;
  if (row.google_place_id) {
    return `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(row.google_place_id)}`;
  }
  if (row.lat !== null && row.lng !== null) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${row.lat},${row.lng}`)}`;
  }
  return "";
}

function toVenueDto(row) {
  return {
    id: String(row.placement_id),
    venueId: row.venue_id,
    section: row.section,
    name: row.display_name,
    canonicalName: row.canonical_name,
    nameOverride: row.name_override || "",
    slug: row.slug,
    venueSlug: row.slug,
    description: row.display_description || "",
    image: row.display_image || "",
    lat: optionalNumber(row.lat),
    lng: optionalNumber(row.lng),
    instagram: instagramUrl(row.instagram),
    googleMaps: mapUrl(row),
    website: row.website || "",
    rating: optionalNumber(row.stars),
    reviewCount: optionalNumber(row.reviews) || 0,
    googlePlaceId: row.google_place_id || "",
    ownership: row.ownership || "",
    tagline: row.tagline || "",
    priorityOrder: optionalNumber(row.priority_order) || 0,
    status: row.placement_status,
  };
}

const GUIDE_VENUE_SELECT = `
  SELECT
    placement.id AS placement_id,
    placement.venue_id,
    placement.section,
    placement.priority_order,
    placement.status AS placement_status,
    placement.name_override,
    placement.tagline,
    COALESCE(placement.name_override, venue.name) AS display_name,
    venue.name AS canonical_name,
    venue.slug,
    COALESCE(placement.description_override, venue.description, venue.excerpt, '') AS display_description,
    COALESCE(placement.image_override, venue.image, venue.logo, '') AS display_image,
    venue.lat,
    venue.lng,
    venue.instagram,
    venue.map_url,
    venue.website,
    venue.stars,
    venue.reviews,
    venue.google_place_id,
    venue.ownership
  FROM guide_venue_placements AS placement
  JOIN venues260414 AS venue ON venue.id = placement.venue_id
`;

export async function listGuideVenues({ section = "", status = "" } = {}) {
  const where = ["placement.guide_key = $1", "venue.deleted_at IS NULL"];
  const params = [GUIDE_KEY];

  if (section) {
    params.push(section);
    where.push(`placement.section = $${params.length}`);
  }
  if (status) {
    params.push(status);
    where.push(`placement.status = $${params.length}`);
  }

  const result = await getPool().query(
    `${GUIDE_VENUE_SELECT}
     WHERE ${where.join(" AND ")}
     ORDER BY placement.section, placement.priority_order, venue.name`,
    params,
  );
  return result.rows.map(toVenueDto);
}

export async function getGuideVenue(id) {
  const result = await getPool().query(
    `${GUIDE_VENUE_SELECT}
     WHERE placement.id = $1
       AND placement.guide_key = $2
       AND venue.deleted_at IS NULL`,
    [id, GUIDE_KEY],
  );
  return result.rows[0] ? toVenueDto(result.rows[0]) : null;
}

export async function createGuideVenue(data) {
  const venueId = optionalText(data.venueId);

  if (!venueId) {
    throw new Error("Venue id is required");
  }

  const client = await getPool().connect();

  try {
    await client.query("BEGIN");
    const existing = await client.query(
      "SELECT id FROM venues260414 WHERE id = $1 AND deleted_at IS NULL",
      [venueId],
    );

    if (!existing.rows[0]) {
      const error = new Error(`Venue not found in venues table: ${venueId}`);
      error.code = "GUIDE_VENUE_NOT_FOUND";
      throw error;
    }

    const placement = await client.query(
      `INSERT INTO guide_venue_placements (
        guide_key, venue_id, section, priority_order, status, name_override,
        tagline, description_override, image_override
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (guide_key, venue_id, section) DO UPDATE SET
        priority_order = EXCLUDED.priority_order,
        status = EXCLUDED.status,
        name_override = EXCLUDED.name_override,
        tagline = EXCLUDED.tagline,
        description_override = EXCLUDED.description_override,
        image_override = EXCLUDED.image_override,
        updated_at = NOW()
      RETURNING id`,
      [
        GUIDE_KEY,
        venueId,
        data.section,
        optionalNumber(data.priorityOrder) || 0,
        optionalText(data.status) || "active",
        optionalText(data.nameOverride),
        optionalText(data.tagline),
        optionalText(data.description),
        optionalText(data.image),
      ],
    );

    await client.query("COMMIT");
    return getGuideVenue(placement.rows[0].id);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateGuideVenue(id, data) {
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");
    const placementResult = await client.query(
      `SELECT venue_id FROM guide_venue_placements
       WHERE id = $1 AND guide_key = $2`,
      [id, GUIDE_KEY],
    );
    const venueId = placementResult.rows[0]?.venue_id;
    if (!venueId) {
      await client.query("ROLLBACK");
      return null;
    }

    const venueFields = [];
    const venueValues = [];
    const venueColumns = {
      canonicalName: "name",
      lat: "lat",
      lng: "lng",
      instagram: "instagram",
      googleMaps: "map_url",
      website: "website",
      rating: "stars",
      reviewCount: "reviews",
      googlePlaceId: "google_place_id",
      ownership: "ownership",
    };

    for (const [key, column] of Object.entries(venueColumns)) {
      if (data[key] !== undefined) {
        venueValues.push(data[key] === "" ? null : data[key]);
        venueFields.push(`${column} = $${venueValues.length}`);
      }
    }

    if (venueFields.length) {
      venueValues.push(venueId);
      await client.query(
        `UPDATE venues260414
         SET ${venueFields.join(", ")}, updated_at = NOW(), updated_by = 'admin-guide'
         WHERE id = $${venueValues.length}`,
        venueValues,
      );
    }

    const placementFields = [];
    const placementValues = [];
    const placementColumns = {
      section: "section",
      priorityOrder: "priority_order",
      status: "status",
      tagline: "tagline",
      nameOverride: "name_override",
      description: "description_override",
      image: "image_override",
    };

    for (const [key, column] of Object.entries(placementColumns)) {
      if (data[key] !== undefined) {
        placementValues.push(data[key] === "" ? null : data[key]);
        placementFields.push(`${column} = $${placementValues.length}`);
      }
    }

    if (placementFields.length) {
      placementValues.push(id, GUIDE_KEY);
      await client.query(
        `UPDATE guide_venue_placements
         SET ${placementFields.join(", ")}, updated_at = NOW()
         WHERE id = $${placementValues.length - 1}
           AND guide_key = $${placementValues.length}`,
        placementValues,
      );
    }

    await client.query("COMMIT");
    return getGuideVenue(id);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteGuideVenue(id) {
  await getPool().query(
    `UPDATE guide_venue_placements
     SET status = 'archived', updated_at = NOW()
     WHERE id = $1 AND guide_key = $2`,
    [id, GUIDE_KEY],
  );
  return { ok: true };
}

export async function reorderGuideVenues(section, orderedIds) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    for (let index = 0; index < orderedIds.length; index += 1) {
      await client.query(
        `UPDATE guide_venue_placements
         SET priority_order = $1, updated_at = NOW()
         WHERE id = $2 AND section = $3 AND guide_key = $4`,
        [index + 1, orderedIds[index], section, GUIDE_KEY],
      );
    }
    await client.query("COMMIT");
    return { ok: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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

export async function listGuideContent() {
  const result = await getPool().query(
    "SELECT * FROM guide_content ORDER BY section_key",
  );
  return result.rows.map(toContentDto);
}

export async function updateGuideContent(sectionKey, data) {
  const result = await getPool().query(
    `INSERT INTO guide_content (section_key, title, body, image, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (section_key) DO UPDATE SET
       title = EXCLUDED.title,
       body = EXCLUDED.body,
       image = EXCLUDED.image,
       updated_at = NOW()
     RETURNING *`,
    [
      sectionKey,
      optionalText(data.title),
      optionalText(data.body),
      optionalText(data.image),
    ],
  );
  return toContentDto(result.rows[0]);
}

export async function getGuideContent(sectionKey) {
  const result = await getPool().query(
    "SELECT * FROM guide_content WHERE section_key = $1",
    [sectionKey],
  );
  return result.rows[0] ? toContentDto(result.rows[0]) : null;
}