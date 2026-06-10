import process from "node:process";
import pg from "pg";

const { Pool } = pg;

const PASS_GUESTS_TABLE = "pass_guests";
const PASSES_TABLE = "passes";
const GUEST_PREFERENCES_TABLE = "guest_preferences";

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

function normalizeBoolean(value, fallback = null) {
  if (value === null || value === undefined) {
    return fallback;
  }

  return Boolean(value);
}

function normalizeInteger(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeTextArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => normalizeText(item))
    .filter(Boolean);
}

function normalizeHotelSlug(value) {
  return normalizeText(value);
}

function mapPassGuestRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    whatsappOptIn: row.whatsapp_opt_in,
    marketingConsent: row.marketing_consent,
    sourceHotelSlug: row.source_hotel_slug,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPassRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    guestId: row.guest_id,
    sourceHotelSlug: row.source_hotel_slug,
    passType: row.pass_type,
    status: row.status,
    validFrom: row.valid_from,
    validUntil: row.valid_until,
    passkitProgramId: row.passkit_program_id,
    passkitMemberId: row.passkit_member_id,
    passkitExternalId: row.passkit_external_id,
    passkitPassUrl: row.passkit_pass_url,
    passkitInstallUrl: row.passkit_install_url,
    passkitStatus: row.passkit_status,
    appleWalletInstalled: row.apple_wallet_installed,
    googleWalletInstalled: row.google_wallet_installed,
    lastPasskitSyncAt: row.last_passkit_sync_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapGuestPreferencesRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    guestId: row.guest_id,
    passId: row.pass_id,
    stayLength: row.stay_length,
    interests: row.interests || [],
    servicesInterested: row.services_interested || [],
    wantsWhatsappRecommendations: row.wants_whatsapp_recommendations,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createPassGuest(input = {}) {
  const result = await getPool().query(
    `
      INSERT INTO ${PASS_GUESTS_TABLE} (
        full_name,
        email,
        phone,
        country,
        whatsapp_opt_in,
        marketing_consent,
        source_hotel_slug,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, COALESCE($5, FALSE), COALESCE($6, FALSE), $7, NOW()
      )
      RETURNING *
    `,
    [
      normalizeText(input.fullName),
      normalizeEmail(input.email),
      normalizeText(input.phone),
      normalizeText(input.country),
      normalizeBoolean(input.whatsappOptIn, false),
      normalizeBoolean(input.marketingConsent, false),
      normalizeHotelSlug(input.sourceHotelSlug || input.sourceHotel),
    ],
  );

  return mapPassGuestRow(result.rows[0]);
}

export async function createPassRecord(input = {}) {
  const result = await getPool().query(
    `
      INSERT INTO ${PASSES_TABLE} (
        guest_id,
        source_hotel_slug,
        pass_type,
        status,
        valid_from,
        valid_until,
        passkit_program_id,
        passkit_member_id,
        passkit_external_id,
        passkit_pass_url,
        passkit_install_url,
        passkit_status,
        apple_wallet_installed,
        google_wallet_installed,
        last_passkit_sync_at,
        updated_at
      ) VALUES (
        $1, $2, COALESCE($3, 'complimentary_hotel_guest'), COALESCE($4, 'active'),
        $5, $6, $7, $8, $9, $10, $11, $12,
        COALESCE($13, FALSE), COALESCE($14, FALSE), $15, NOW()
      )
      RETURNING *
    `,
    [
      normalizeText(input.guestId),
      normalizeHotelSlug(
        input.sourceHotelSlug || input.sourceHotel || input.venueId,
      ),
      normalizeText(input.passType),
      normalizeText(input.status),
      input.validFrom || null,
      input.validUntil || null,
      normalizeText(input.passkitProgramId),
      normalizeText(input.passkitMemberId),
      normalizeText(input.passkitExternalId),
      normalizeText(input.passkitPassUrl),
      normalizeText(input.passkitInstallUrl),
      normalizeText(input.passkitStatus),
      normalizeBoolean(input.appleWalletInstalled, false),
      normalizeBoolean(input.googleWalletInstalled, false),
      input.lastPasskitSyncAt || null,
    ],
  );

  return mapPassRow(result.rows[0]);
}

export async function createGuestPreferences(input = {}) {
  const result = await getPool().query(
    `
      INSERT INTO ${GUEST_PREFERENCES_TABLE} (
        guest_id,
        pass_id,
        stay_length,
        interests,
        services_interested,
        wants_whatsapp_recommendations,
        completed_at,
        updated_at
      ) VALUES (
        $1, $2, $3, $4::text[], $5::text[], COALESCE($6, FALSE), $7, NOW()
      )
      RETURNING *
    `,
    [
      normalizeText(input.guestId),
      normalizeText(input.passId),
      normalizeInteger(input.stayLength),
      normalizeTextArray(input.interests),
      normalizeTextArray(input.servicesInterested),
      normalizeBoolean(input.wantsWhatsappRecommendations, false),
      input.completedAt || null,
    ],
  );

  return mapGuestPreferencesRow(result.rows[0]);
}

export async function getPassGuestById(id) {
  const result = await getPool().query(
    `SELECT * FROM ${PASS_GUESTS_TABLE} WHERE id = $1 LIMIT 1`,
    [normalizeText(id)],
  );

  return mapPassGuestRow(result.rows[0]);
}

export async function getPassesByGuestId(guestId) {
  const result = await getPool().query(
    `
      SELECT *
      FROM ${PASSES_TABLE}
      WHERE guest_id = $1
      ORDER BY created_at DESC
    `,
    [normalizeText(guestId)],
  );

  return result.rows.map(mapPassRow);
}

export async function getPassById(passId) {
  const result = await getPool().query(
    `SELECT * FROM ${PASSES_TABLE} WHERE id = $1 LIMIT 1`,
    [normalizeText(passId)],
  );

  return mapPassRow(result.rows[0]);
}

export async function getGuestPreferencesByGuestId(guestId) {
  const result = await getPool().query(
    `
      SELECT *
      FROM ${GUEST_PREFERENCES_TABLE}
      WHERE guest_id = $1
      ORDER BY created_at DESC
    `,
    [normalizeText(guestId)],
  );

  return result.rows.map(mapGuestPreferencesRow);
}

export async function getGuestPreferencesByPassId(passId) {
  const result = await getPool().query(
    `SELECT * FROM ${GUEST_PREFERENCES_TABLE} WHERE pass_id = $1 LIMIT 1`,
    [normalizeText(passId)],
  );

  return mapGuestPreferencesRow(result.rows[0]);
}

export async function updateGuestPreferences(passId, updates = {}) {
  const assignments = [];
  const values = [normalizeText(passId)];

  if (Object.prototype.hasOwnProperty.call(updates, "stayLength")) {
    values.push(normalizeInteger(updates.stayLength));
    assignments.push(`stay_length = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(updates, "interests")) {
    values.push(normalizeTextArray(updates.interests));
    assignments.push(`interests = $${values.length}::text[]`);
  }

  if (Object.prototype.hasOwnProperty.call(updates, "servicesInterested")) {
    values.push(normalizeTextArray(updates.servicesInterested));
    assignments.push(`services_interested = $${values.length}::text[]`);
  }

  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "wantsWhatsappRecommendations",
    )
  ) {
    values.push(normalizeBoolean(updates.wantsWhatsappRecommendations, false));
    assignments.push(`wants_whatsapp_recommendations = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(updates, "completedAt")) {
    values.push(updates.completedAt || null);
    assignments.push(`completed_at = $${values.length}`);
  }

  if (assignments.length === 0) {
    return getGuestPreferencesByPassId(passId);
  }

  const result = await getPool().query(
    `
      UPDATE ${GUEST_PREFERENCES_TABLE}
      SET
        ${assignments.join(",\n        ")},
        updated_at = NOW()
      WHERE pass_id = $1
      RETURNING *
    `,
    values,
  );

  return mapGuestPreferencesRow(result.rows[0]);
}

export async function updatePasskitFields(passId, passkitData = {}) {
  const assignments = [];
  const values = [normalizeText(passId)];

  if (Object.prototype.hasOwnProperty.call(passkitData, "passkitProgramId")) {
    values.push(normalizeText(passkitData.passkitProgramId));
    assignments.push(`passkit_program_id = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(passkitData, "passkitMemberId")) {
    values.push(normalizeText(passkitData.passkitMemberId));
    assignments.push(`passkit_member_id = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(passkitData, "passkitExternalId")) {
    values.push(normalizeText(passkitData.passkitExternalId));
    assignments.push(`passkit_external_id = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(passkitData, "passkitPassUrl")) {
    values.push(normalizeText(passkitData.passkitPassUrl));
    assignments.push(`passkit_pass_url = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(passkitData, "passkitInstallUrl")) {
    values.push(normalizeText(passkitData.passkitInstallUrl));
    assignments.push(`passkit_install_url = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(passkitData, "passkitStatus")) {
    values.push(normalizeText(passkitData.passkitStatus));
    assignments.push(`passkit_status = $${values.length}`);
  }

  if (
    Object.prototype.hasOwnProperty.call(passkitData, "appleWalletInstalled")
  ) {
    values.push(normalizeBoolean(passkitData.appleWalletInstalled, false));
    assignments.push(`apple_wallet_installed = $${values.length}`);
  }

  if (
    Object.prototype.hasOwnProperty.call(passkitData, "googleWalletInstalled")
  ) {
    values.push(normalizeBoolean(passkitData.googleWalletInstalled, false));
    assignments.push(`google_wallet_installed = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(passkitData, "lastPasskitSyncAt")) {
    values.push(passkitData.lastPasskitSyncAt || null);
    assignments.push(`last_passkit_sync_at = $${values.length}`);
  }

  if (assignments.length === 0) {
    return getPassById(passId);
  }

  const result = await getPool().query(
    `
      UPDATE ${PASSES_TABLE}
      SET
        ${assignments.join(",\n        ")},
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    values,
  );

  return mapPassRow(result.rows[0]);
}