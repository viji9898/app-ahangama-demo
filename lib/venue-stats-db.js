import process from "node:process";
import pg from "pg";

/*
 * Persistent manual content for venue statistics.
 *
 * Instagram Insights are not available through GA4, so post metrics are
 * entered by an administrator. Article rows only associate an Ahangama.com
 * article with a venue — page views are always read live from GA4.
 *
 * Tables live in the `guide_app` schema because the application database
 * role owns that schema but cannot alter the guide placement tables.
 */

const { Pool } = pg;

let pool;

function getPool() {
  if (!pool) {
    // `VENUE_STATS_DATABASE_URL` is an optional local-preview override.
    // Production uses the normal `DATABASE_URL`.
    const connectionString =
      process.env.VENUE_STATS_DATABASE_URL ||
      process.env.DATABASE_URL ||
      "";
    if (!connectionString) throw new Error("Missing env var: DATABASE_URL");
    pool = new Pool({ connectionString, connectionTimeoutMillis: 8000 });
    pool.on("error", (error) => {
      console.error("Unexpected venue stats database pool error:", error);
    });
  }
  return pool;
}

function text(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function optionalText(value) {
  const normalized = text(value);
  return normalized || null;
}

function count(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.round(parsed);
}

function optionalDate(value) {
  const normalized = text(value);
  if (!normalized) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : null;
}

function toPost(row) {
  return {
    id: Number(row.id),
    venueKey: row.venue_key,
    postUrl: row.post_url,
    postDate: row.post_date ? String(row.post_date).slice(0, 10) : "",
    postType: row.post_type,
    reach: Number(row.reach) || 0,
    impressions: Number(row.impressions) || 0,
    likes: Number(row.likes) || 0,
    comments: Number(row.comments) || 0,
    shares: Number(row.shares) || 0,
    saves: Number(row.saves) || 0,
    notes: row.notes || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toArticle(row) {
  return {
    id: Number(row.id),
    venueKey: row.venue_key,
    title: row.title,
    url: row.url,
    publishedAt: row.published_at ? String(row.published_at).slice(0, 10) : "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listInstagramPosts(venueKey) {
  const result = await getPool().query(
    `SELECT * FROM guide_app.venue_instagram_posts
     WHERE venue_key = $1
     ORDER BY post_date DESC NULLS LAST, id DESC`,
    [venueKey],
  );
  return result.rows.map(toPost);
}

export async function saveInstagramPost(venueKey, data = {}) {
  const postUrl = text(data.postUrl);
  if (!postUrl) throw new Error("postUrl is required");

  const postType = ["post", "reel", "story"].includes(text(data.postType))
    ? text(data.postType)
    : "post";

  const result = await getPool().query(
    `INSERT INTO guide_app.venue_instagram_posts
       (venue_key, post_url, post_date, post_type, reach, impressions,
        likes, comments, shares, saves, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     ON CONFLICT (venue_key, post_url) DO UPDATE SET
       post_date = EXCLUDED.post_date,
       post_type = EXCLUDED.post_type,
       reach = EXCLUDED.reach,
       impressions = EXCLUDED.impressions,
       likes = EXCLUDED.likes,
       comments = EXCLUDED.comments,
       shares = EXCLUDED.shares,
       saves = EXCLUDED.saves,
       notes = EXCLUDED.notes,
       updated_at = NOW()
     RETURNING *`,
    [
      venueKey,
      postUrl,
      optionalDate(data.postDate),
      postType,
      count(data.reach),
      count(data.impressions),
      count(data.likes),
      count(data.comments),
      count(data.shares),
      count(data.saves),
      optionalText(data.notes),
    ],
  );

  return toPost(result.rows[0]);
}

export async function deleteInstagramPost(venueKey, id) {
  const result = await getPool().query(
    `DELETE FROM guide_app.venue_instagram_posts
     WHERE venue_key = $1 AND id = $2
     RETURNING id`,
    [venueKey, Number(id)],
  );
  return Boolean(result.rows[0]);
}

export async function listVenueArticles(venueKey) {
  const result = await getPool().query(
    `SELECT * FROM guide_app.venue_articles
     WHERE venue_key = $1
     ORDER BY published_at DESC NULLS LAST, id DESC`,
    [venueKey],
  );
  return result.rows.map(toArticle);
}

export async function saveVenueArticle(venueKey, data = {}) {
  const url = text(data.url);
  const title = text(data.title);
  if (!url) throw new Error("url is required");
  if (!title) throw new Error("title is required");

  const result = await getPool().query(
    `INSERT INTO guide_app.venue_articles
       (venue_key, title, url, published_at)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (venue_key, url) DO UPDATE SET
       title = EXCLUDED.title,
       published_at = EXCLUDED.published_at,
       updated_at = NOW()
     RETURNING *`,
    [venueKey, title, url, optionalDate(data.publishedAt)],
  );

  return toArticle(result.rows[0]);
}

export async function deleteVenueArticle(venueKey, id) {
  const result = await getPool().query(
    `DELETE FROM guide_app.venue_articles
     WHERE venue_key = $1 AND id = $2
     RETURNING id`,
    [venueKey, Number(id)],
  );
  return Boolean(result.rows[0]);
}
