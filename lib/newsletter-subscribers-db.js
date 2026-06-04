import process from "node:process";
import pg from "pg";

const { Pool } = pg;

const NEWSLETTER_SUBSCRIBERS_TABLE = "newsletter_subscribers";

let pool;

function getConnectionString() {
  return process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL || "";
}

function getPool() {
  if (!pool) {
    const connectionString = getConnectionString();

    if (!connectionString) {
      throw new Error(
        "Missing database connection. Expected NETLIFY_DATABASE_URL or DATABASE_URL.",
      );
    }

    pool = new Pool({ connectionString });
  }

  return pool;
}

function normalizeText(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized || null;
}

function normalizeEmail(value) {
  const normalized = normalizeText(value);
  return normalized ? normalized.toLowerCase() : null;
}

function normalizeTextArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => normalizeText(item))
    .filter(Boolean);
}

function normalizeBoolean(value, fallback = null) {
  if (value === null || value === undefined) {
    return fallback;
  }

  return Boolean(value);
}

function mapSubscriberRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subscriptionStatus: row.subscription_status,
    audienceType: row.audience_type,
    interests: row.interests || [],
    source: row.source,
    subscribedAt: row.subscribed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createNewsletterSubscriber(input = {}) {
  const result = await getPool().query(
    `
      INSERT INTO ${NEWSLETTER_SUBSCRIBERS_TABLE} (
        email,
        subscription_status,
        source,
        subscribed_at,
        updated_at
      ) VALUES (
        $1,
        COALESCE($2, TRUE),
        $3,
        COALESCE($4, NOW()),
        NOW()
      )
      ON CONFLICT (email) DO UPDATE SET
        subscription_status = TRUE,
        source = COALESCE(EXCLUDED.source, ${NEWSLETTER_SUBSCRIBERS_TABLE}.source),
        updated_at = NOW()
      RETURNING *, (xmax = 0) AS inserted
    `,
    [
      normalizeEmail(input.email),
      normalizeBoolean(input.subscriptionStatus, true),
      normalizeText(input.source),
      input.subscribedAt || null,
    ],
  );

  return {
    subscriber: mapSubscriberRow(result.rows[0]),
    created: Boolean(result.rows[0]?.inserted),
  };
}

export async function updateNewsletterSubscriberPreferences(email, updates = {}) {
  const result = await getPool().query(
    `
      UPDATE ${NEWSLETTER_SUBSCRIBERS_TABLE}
      SET
        name = COALESCE($2, name),
        audience_type = COALESCE($3, audience_type),
        interests = CASE
          WHEN COALESCE(array_length($4::text[], 1), 0) = 0 THEN interests
          ELSE $4::text[]
        END,
        updated_at = NOW()
      WHERE email = $1
      RETURNING *
    `,
    [
      normalizeEmail(email),
      normalizeText(updates.name),
      normalizeText(updates.audienceType),
      normalizeTextArray(updates.interests),
    ],
  );

  return mapSubscriberRow(result.rows[0]);
}

export async function getNewsletterSubscriberByEmail(email) {
  const result = await getPool().query(
    `SELECT * FROM ${NEWSLETTER_SUBSCRIBERS_TABLE} WHERE email = $1 LIMIT 1`,
    [normalizeEmail(email)],
  );

  return mapSubscriberRow(result.rows[0]);
}