import process from "node:process";
import pg from "pg";

const { Pool } = pg;

let pool;

function getPool() {
  if (!pool) {
    const connectionString =
      process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL || "";

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
  const normalized = String(value ?? "").trim();
  return normalized || null;
}

function mapEnquiry(row) {
  return {
    id: row.id,
    preferredVenue: row.preferred_venue,
    retreatStyle: row.retreat_style,
    startDate: row.start_date,
    endDate: row.end_date,
    expectedGuests: row.expected_guests,
    name: row.organiser_name,
    email: row.email,
    whatsapp: row.whatsapp,
    notes: row.notes,
    source: row.source,
    status: row.status,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

export async function createRetreatEnquiry(input) {
  const result = await getPool().query(
    `
      INSERT INTO retreat_enquiries (
        preferred_venue,
        retreat_style,
        start_date,
        end_date,
        expected_guests,
        organiser_name,
        email,
        whatsapp,
        notes,
        source
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `,
    [
      normalizeText(input.preferredVenue) || "help-me-choose",
      normalizeText(input.retreatStyle),
      input.startDate,
      input.endDate,
      input.expectedGuests,
      normalizeText(input.name),
      normalizeText(input.email)?.toLowerCase(),
      normalizeText(input.whatsapp),
      normalizeText(input.notes),
      normalizeText(input.source) || "host-a-retreat",
    ],
  );

  return mapEnquiry(result.rows[0]);
}

export async function markRetreatEnquiryNotificationSent(id) {
  await getPool().query(
    `
      UPDATE retreat_enquiries
      SET notification_sent_at = NOW(), updated_at = NOW()
      WHERE id = $1
    `,
    [id],
  );
}