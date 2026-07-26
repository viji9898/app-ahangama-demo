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
    property: row.property_slug,
    checkIn: row.check_in,
    checkOut: row.check_out,
    adults: row.adults,
    children: row.children,
    budget: row.budget,
    name: row.guest_name,
    email: row.email,
    whatsapp: row.whatsapp,
    notes: row.notes,
    source: row.source,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function createStayEnquiry(input) {
  const result = await getPool().query(
    `
      INSERT INTO stay_enquiries (
        property_slug,
        check_in,
        check_out,
        adults,
        children,
        budget,
        guest_name,
        email,
        whatsapp,
        notes,
        source
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `,
    [
      normalizeText(input.property),
      input.checkIn,
      input.checkOut,
      input.adults,
      input.children,
      normalizeText(input.budget),
      normalizeText(input.name),
      normalizeText(input.email)?.toLowerCase(),
      normalizeText(input.whatsapp),
      normalizeText(input.notes),
      normalizeText(input.source) || "stays-editorial",
    ],
  );

  return mapEnquiry(result.rows[0]);
}

export async function markStayEnquiryNotificationSent(id) {
  await getPool().query(
    `
      UPDATE stay_enquiries
      SET notification_sent_at = NOW(), updated_at = NOW()
      WHERE id = $1
    `,
    [id],
  );
}