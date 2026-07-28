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
    serviceType: row.service_type,
    journeyDate: row.journey_date,
    pickupLocation: row.pickup_location,
    destination: row.destination,
    passengers: row.passengers,
    rentalDays: row.rental_days,
    name: row.guest_name,
    email: row.email,
    whatsapp: row.whatsapp,
    notes: row.notes,
    source: row.source,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function createTransportEnquiry(input) {
  const result = await getPool().query(
    `
      INSERT INTO transport_enquiries (
        service_type,
        journey_date,
        pickup_location,
        destination,
        passengers,
        rental_days,
        guest_name,
        email,
        whatsapp,
        notes,
        source
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `,
    [
      normalizeText(input.serviceType),
      input.journeyDate,
      normalizeText(input.pickupLocation),
      normalizeText(input.destination),
      input.passengers,
      input.rentalDays,
      normalizeText(input.name),
      normalizeText(input.email)?.toLowerCase(),
      normalizeText(input.whatsapp),
      normalizeText(input.notes),
      normalizeText(input.source) || "transport-page",
    ],
  );

  return mapEnquiry(result.rows[0]);
}

export async function markTransportEnquiryNotificationSent(id) {
  await getPool().query(
    `
      UPDATE transport_enquiries
      SET notification_sent_at = NOW(), updated_at = NOW()
      WHERE id = $1
    `,
    [id],
  );
}