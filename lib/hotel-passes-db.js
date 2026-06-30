import process from "node:process";
import pg from "pg";

const { Pool } = pg;

const PASS_GUESTS_TABLE = "pass_guests";
const PASSES_TABLE = "passes";
const GUEST_PREFERENCES_TABLE = "guest_preferences";
const BOOKING_REQUESTS_TABLE = "booking_requests";
const GUEST_CONTENT_HISTORY_TABLE = "guest_content_history";
const VENUE_INTERACTIONS_TABLE = "venue_interactions";
const ARTICLE_INTERACTIONS_TABLE = "article_interactions";
const EXPERIENCE_INTERACTIONS_TABLE = "experience_interactions";
const GUEST_EMAIL_HISTORY_TABLE = "guest_email_history";

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

  return value.map((item) => normalizeText(item)).filter(Boolean);
}

function normalizeHotelSlug(value) {
  return normalizeText(value);
}

function normalizeDestination(value) {
  return normalizeText(value);
}

function normalizeSlug(value) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  return normalized
    .toLowerCase()
    .replaceAll("&", "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeSourceEmailType(value) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  return normalized.endsWith("-email") ? normalized.slice(0, -6) : normalized;
}

function normalizeStayLength(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return normalizeInteger(value);
  }

  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replaceAll("–", "-")
    .replaceAll("—", "-");

  const mapped = {
    "1-3 nights": 3,
    "4-7 nights": 7,
    "8-14 nights": 14,
    "15-30 nights": 30,
    "1 month+": 31,
  }[normalized];

  if (mapped) {
    return mapped;
  }

  return normalizeInteger(normalized);
}

function mapPassGuestRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    normalizedEmail: row.normalized_email,
    phone: row.phone,
    country: row.country,
    whatsappOptIn: row.whatsapp_opt_in,
    marketingConsent: row.marketing_consent,
    sourceHotelSlug: row.source_hotel_slug,
    destination: row.destination,
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

  const bookingInterests = row.services_interested || [];
  const whatsappOptIn = row.wants_whatsapp_recommendations;

  return {
    id: row.id,
    guestId: row.guest_id,
    passId: row.pass_id,
    stayLength: row.stay_length,
    interests: row.interests || [],
    travelGroup: row.travel_group,
    bookingInterests,
    servicesInterestedIn: bookingInterests,
    servicesInterested: bookingInterests,
    whatsappOptIn,
    wantsWhatsappRecommendations: whatsappOptIn,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapIssuedFreePassRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.pass_id,
    guestId: row.guest_id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    sourceHotelSlug: row.source_hotel_slug,
    destination: row.destination,
    passType: row.pass_type,
    status: row.status,
    validFrom: row.valid_from,
    validUntil: row.valid_until,
    passkitInstallUrl: row.passkit_install_url,
    passkitStatus: row.passkit_status,
    appleWalletInstalled: row.apple_wallet_installed,
    googleWalletInstalled: row.google_wallet_installed,
    stayLength: row.stay_length,
    interests: row.interests || [],
    travelGroup: row.travel_group,
    servicesInterested: row.services_interested || [],
    wantsWhatsappRecommendations: row.wants_whatsapp_recommendations,
    issuedAt: row.issued_at,
    updatedAt: row.updated_at,
  };
}

export async function createPassGuest(input = {}) {
  const normalizedEmail = normalizeEmail(input.email);
  const sourceHotelSlug = normalizeHotelSlug(
    input.sourceHotelSlug || input.sourceHotel,
  );
  const destination = normalizeDestination(input.destination);

  if (normalizedEmail && sourceHotelSlug && destination) {
    const existingResult = await getPool().query(
      `
        UPDATE ${PASS_GUESTS_TABLE}
        SET
          full_name = $1,
          email = $2,
          normalized_email = $2,
          phone = $3,
          country = $4,
          whatsapp_opt_in = COALESCE($5, FALSE),
          marketing_consent = COALESCE($6, FALSE),
          updated_at = NOW()
        WHERE id = (
          SELECT id
          FROM ${PASS_GUESTS_TABLE}
          WHERE normalized_email = $2
            AND source_hotel_slug = $7
            AND destination = $8
          ORDER BY created_at ASC
          LIMIT 1
        )
        RETURNING *
      `,
      [
        normalizeText(input.fullName),
        normalizedEmail,
        normalizeText(input.phone),
        normalizeText(input.country),
        normalizeBoolean(input.whatsappOptIn, false),
        normalizeBoolean(input.marketingConsent, false),
        sourceHotelSlug,
        destination,
      ],
    );

    if (existingResult.rows[0]) {
      return mapPassGuestRow(existingResult.rows[0]);
    }
  }

  const result = await getPool().query(
    `
      INSERT INTO ${PASS_GUESTS_TABLE} (
        full_name,
        email,
        normalized_email,
        phone,
        country,
        whatsapp_opt_in,
        marketing_consent,
        source_hotel_slug,
        destination,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, COALESCE($6, FALSE), COALESCE($7, FALSE), $8, $9, NOW()
      )
      RETURNING *
    `,
    [
      normalizeText(input.fullName),
      normalizedEmail,
      normalizedEmail,
      normalizeText(input.phone),
      normalizeText(input.country),
      normalizeBoolean(input.whatsappOptIn, false),
      normalizeBoolean(input.marketingConsent, false),
      sourceHotelSlug,
      destination,
    ],
  );

  return mapPassGuestRow(result.rows[0]);
}

export async function createPassRecord(input = {}) {
  const normalizedGuestId = normalizeText(input.guestId);
  const sourceHotelSlug = normalizeHotelSlug(
    input.sourceHotelSlug || input.sourceHotel || input.venueId,
  );
  const passType = normalizeText(input.passType) || "complimentary_hotel_guest";
  const status = normalizeText(input.status) || "active";

  if (
    normalizedGuestId &&
    sourceHotelSlug &&
    passType === "complimentary_hotel_guest" &&
    status === "active"
  ) {
    const existingResult = await getPool().query(
      `
        UPDATE ${PASSES_TABLE}
        SET
          valid_from = CASE
            WHEN $3::timestamptz IS NOT NULL
              AND (valid_from IS NULL OR $3::timestamptz > valid_from)
            THEN $3::timestamptz
            ELSE valid_from
          END,
          valid_until = CASE
            WHEN $4::timestamptz IS NOT NULL
              AND (valid_until IS NULL OR $4::timestamptz > valid_until)
            THEN $4::timestamptz
            ELSE valid_until
          END,
          updated_at = NOW()
        WHERE id = (
          SELECT id
          FROM ${PASSES_TABLE}
          WHERE guest_id = $1
            AND source_hotel_slug = $2
            AND pass_type = 'complimentary_hotel_guest'
            AND status = 'active'
          ORDER BY created_at ASC
          LIMIT 1
        )
        RETURNING *
      `,
      [
        normalizedGuestId,
        sourceHotelSlug,
        input.validFrom || null,
        input.validUntil || null,
      ],
    );

    if (existingResult.rows[0]) {
      return mapPassRow(existingResult.rows[0]);
    }
  }

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
      normalizedGuestId,
      sourceHotelSlug,
      passType,
      status,
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
        travel_group,
        services_interested,
        wants_whatsapp_recommendations,
        completed_at,
        updated_at
      ) VALUES (
        $1, $2, $3, $4::text[], $5, $6::text[], COALESCE($7, FALSE), $8, NOW()
      )
      ON CONFLICT (pass_id)
      DO UPDATE SET
        guest_id = EXCLUDED.guest_id,
        stay_length = EXCLUDED.stay_length,
        interests = EXCLUDED.interests,
        travel_group = EXCLUDED.travel_group,
        services_interested = EXCLUDED.services_interested,
        wants_whatsapp_recommendations = EXCLUDED.wants_whatsapp_recommendations,
        completed_at = EXCLUDED.completed_at,
        updated_at = NOW()
      RETURNING *
    `,
    [
      normalizeText(input.guestId),
      normalizeText(input.passId),
      normalizeStayLength(input.stayLength),
      normalizeTextArray(input.interests),
      normalizeText(input.travelGroup),
      normalizeTextArray(
        input.bookingInterests ??
          input.servicesInterestedIn ??
          input.servicesInterested,
      ),
      normalizeBoolean(
        input.whatsappOptIn ?? input.wantsWhatsappRecommendations,
        false,
      ),
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
    values.push(normalizeStayLength(updates.stayLength));
    assignments.push(`stay_length = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(updates, "interests")) {
    values.push(normalizeTextArray(updates.interests));
    assignments.push(`interests = $${values.length}::text[]`);
  }

  if (Object.prototype.hasOwnProperty.call(updates, "travelGroup")) {
    values.push(normalizeText(updates.travelGroup));
    assignments.push(`travel_group = $${values.length}`);
  }

  if (
    Object.prototype.hasOwnProperty.call(updates, "bookingInterests") ||
    Object.prototype.hasOwnProperty.call(updates, "servicesInterestedIn") ||
    Object.prototype.hasOwnProperty.call(updates, "servicesInterested")
  ) {
    values.push(
      normalizeTextArray(
        updates.bookingInterests ??
          updates.servicesInterestedIn ??
          updates.servicesInterested,
      ),
    );
    assignments.push(`services_interested = $${values.length}::text[]`);
  }

  if (
    Object.prototype.hasOwnProperty.call(updates, "whatsappOptIn") ||
    Object.prototype.hasOwnProperty.call(
      updates,
      "wantsWhatsappRecommendations",
    )
  ) {
    values.push(
      normalizeBoolean(
        updates.whatsappOptIn ?? updates.wantsWhatsappRecommendations,
        false,
      ),
    );
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

export async function createBookingRequestsForInterests({
  guestId,
  passId,
  bookingInterests,
  notes = null,
} = {}) {
  const normalizedGuestId = normalizeText(guestId);
  const normalizedPassId = normalizeText(passId);
  const serviceTypes = [
    ...new Set(normalizeTextArray(bookingInterests).map(normalizeSlug)),
  ].filter(Boolean);

  if (!normalizedGuestId || !normalizedPassId || serviceTypes.length === 0) {
    return [];
  }

  const result = await getPool().query(
    `
      INSERT INTO ${BOOKING_REQUESTS_TABLE} (
        guest_id,
        pass_id,
        service_type,
        request_status,
        notes,
        updated_at
      )
      SELECT $1, $2, UNNEST($3::text[]), 'interested', $4, NOW()
      ON CONFLICT (guest_id, pass_id, service_type)
        WHERE request_status = 'interested'
      DO NOTHING
      RETURNING *
    `,
    [normalizedGuestId, normalizedPassId, serviceTypes, normalizeText(notes)],
  );

  return result.rows;
}

export async function recordVenueInteraction({
  guestId,
  passId,
  venueId,
  source = null,
  interactionType,
} = {}) {
  const result = await getPool().query(
    `
      INSERT INTO ${VENUE_INTERACTIONS_TABLE} (
        guest_id,
        pass_id,
        venue_id,
        source,
        interaction_type
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [
      normalizeText(guestId),
      normalizeText(passId),
      normalizeText(venueId),
      normalizeText(source),
      normalizeText(interactionType),
    ],
  );

  return result.rows[0];
}

export async function recordArticleInteraction({
  guestId,
  passId,
  articleId,
  source = null,
  interactionType,
} = {}) {
  const result = await getPool().query(
    `
      INSERT INTO ${ARTICLE_INTERACTIONS_TABLE} (
        guest_id,
        pass_id,
        article_id,
        source,
        interaction_type
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [
      normalizeText(guestId),
      normalizeText(passId),
      normalizeText(articleId),
      normalizeText(source),
      normalizeText(interactionType),
    ],
  );

  return result.rows[0];
}

export async function recordExperienceInteraction({
  guestId,
  passId,
  experienceId,
  source = null,
  interactionType,
} = {}) {
  const result = await getPool().query(
    `
      INSERT INTO ${EXPERIENCE_INTERACTIONS_TABLE} (
        guest_id,
        pass_id,
        experience_id,
        source,
        interaction_type
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [
      normalizeText(guestId),
      normalizeText(passId),
      normalizeText(experienceId),
      normalizeText(source),
      normalizeText(interactionType),
    ],
  );

  return result.rows[0];
}

export async function markEmailClicked({ guestId, passId, source } = {}) {
  const normalizedGuestId = normalizeText(guestId);
  const normalizedPassId = normalizeText(passId);
  const normalizedSource = normalizeText(source);
  const normalizedEmailType = normalizeSourceEmailType(source);

  if (!normalizedGuestId || !normalizedPassId || !normalizedSource) {
    return [];
  }

  const result = await getPool().query(
    `
      UPDATE ${GUEST_EMAIL_HISTORY_TABLE}
      SET clicked = TRUE
      WHERE guest_id = $1
        AND pass_id = $2
        AND email_type = ANY($3::text[])
      RETURNING *
    `,
    [
      normalizedGuestId,
      normalizedPassId,
      [...new Set([normalizedSource, normalizedEmailType].filter(Boolean))],
    ],
  );

  return result.rows;
}

export async function createGuestContentHistoryRows({
  guestId,
  passId,
  source = null,
  sentAt = null,
  contents = [],
} = {}) {
  const normalizedGuestId = normalizeText(guestId);
  const normalizedPassId = normalizeText(passId);
  const normalizedSource = normalizeText(source);
  const normalizedSentAt = sentAt || new Date().toISOString();
  const contentRows = Array.isArray(contents)
    ? contents
        .map((item) => ({
          contentType: normalizeText(item?.contentType ?? item?.type),
          contentId: normalizeText(item?.contentId ?? item?.id),
        }))
        .filter((item) => item.contentType && item.contentId)
    : [];

  if (!normalizedGuestId || !normalizedPassId || contentRows.length === 0) {
    return [];
  }

  const result = await getPool().query(
    `
      INSERT INTO ${GUEST_CONTENT_HISTORY_TABLE} (
        guest_id,
        pass_id,
        content_type,
        content_id,
        source,
        sent_at
      )
      SELECT $1, $2, UNNEST($3::text[]), UNNEST($4::text[]), $5, $6
      RETURNING *
    `,
    [
      normalizedGuestId,
      normalizedPassId,
      contentRows.map((item) => item.contentType),
      contentRows.map((item) => item.contentId),
      normalizedSource,
      normalizedSentAt,
    ],
  );

  return result.rows;
}

export async function createGuestEmailHistoryRow({
  guestId,
  passId,
  emailType,
  dailyIntelligenceId = null,
  sentAt = null,
} = {}) {
  const result = await getPool().query(
    `
      INSERT INTO ${GUEST_EMAIL_HISTORY_TABLE} (
        guest_id,
        pass_id,
        email_type,
        daily_intelligence_id,
        sent_at
      ) VALUES ($1, $2, $3, $4, COALESCE($5, NOW()))
      RETURNING *
    `,
    [
      normalizeText(guestId),
      normalizeText(passId),
      normalizeSourceEmailType(emailType),
      normalizeText(dailyIntelligenceId),
      sentAt || null,
    ],
  );

  return result.rows[0];
}

export async function updatePassGuestById(guestId, updates = {}) {
  const assignments = [];
  const values = [normalizeText(guestId)];

  if (Object.prototype.hasOwnProperty.call(updates, "country")) {
    values.push(normalizeText(updates.country));
    assignments.push(`country = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(updates, "whatsappOptIn")) {
    values.push(normalizeBoolean(updates.whatsappOptIn, false));
    assignments.push(`whatsapp_opt_in = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(updates, "marketingConsent")) {
    values.push(normalizeBoolean(updates.marketingConsent, false));
    assignments.push(`marketing_consent = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(updates, "destination")) {
    values.push(normalizeDestination(updates.destination));
    assignments.push(`destination = $${values.length}`);
  }

  if (assignments.length === 0) {
    return getPassGuestById(guestId);
  }

  const result = await getPool().query(
    `
      UPDATE ${PASS_GUESTS_TABLE}
      SET
        ${assignments.join(",\n        ")},
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    values,
  );

  return mapPassGuestRow(result.rows[0]);
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

export async function listIssuedFreePasses({ sourceHotelSlug, limit = 500 } = {}) {
  const normalizedSourceHotelSlug = normalizeHotelSlug(sourceHotelSlug);
  const normalizedLimit = Math.min(Math.max(normalizeInteger(limit) || 500, 1), 1000);

  const result = await getPool().query(
    `
      SELECT
        passes.id AS pass_id,
        passes.guest_id,
        pass_guests.full_name,
        pass_guests.email,
        pass_guests.phone,
        pass_guests.country,
        COALESCE(passes.source_hotel_slug, pass_guests.source_hotel_slug) AS source_hotel_slug,
        pass_guests.destination,
        passes.pass_type,
        passes.status,
        passes.valid_from,
        passes.valid_until,
        passes.passkit_install_url,
        passes.passkit_status,
        passes.apple_wallet_installed,
        passes.google_wallet_installed,
        guest_preferences.stay_length,
        guest_preferences.interests,
        guest_preferences.travel_group,
        guest_preferences.services_interested,
        guest_preferences.wants_whatsapp_recommendations,
        passes.created_at AS issued_at,
        passes.updated_at
      FROM ${PASSES_TABLE} AS passes
      INNER JOIN ${PASS_GUESTS_TABLE} AS pass_guests
        ON pass_guests.id = passes.guest_id
      LEFT JOIN ${GUEST_PREFERENCES_TABLE} AS guest_preferences
        ON guest_preferences.pass_id = passes.id
      WHERE passes.pass_type = 'complimentary_hotel_guest'
        AND ($1::text IS NULL OR COALESCE(passes.source_hotel_slug, pass_guests.source_hotel_slug) = $1)
      ORDER BY passes.created_at DESC
      LIMIT $2
    `,
    [normalizedSourceHotelSlug, normalizedLimit],
  );

  const venuesResult = await getPool().query(
    `
      SELECT
        COALESCE(passes.source_hotel_slug, pass_guests.source_hotel_slug, 'unknown') AS source_hotel_slug,
        COUNT(*)::int AS count
      FROM ${PASSES_TABLE} AS passes
      INNER JOIN ${PASS_GUESTS_TABLE} AS pass_guests
        ON pass_guests.id = passes.guest_id
      WHERE passes.pass_type = 'complimentary_hotel_guest'
      GROUP BY COALESCE(passes.source_hotel_slug, pass_guests.source_hotel_slug, 'unknown')
      ORDER BY count DESC, source_hotel_slug ASC
    `,
  );

  return {
    passes: result.rows.map(mapIssuedFreePassRow).filter(Boolean),
    venues: venuesResult.rows.map((row) => ({
      sourceHotelSlug: row.source_hotel_slug,
      count: row.count,
    })),
  };
}

export async function createHotelGuestPass(input = {}) {
  const client = await getPool().connect();
  const normalizedEmail = normalizeEmail(input.email);
  const sourceHotelSlug = normalizeHotelSlug(
    input.sourceHotelSlug || input.sourceHotel,
  );
  const passSourceHotelSlug = normalizeHotelSlug(
    input.sourceHotelSlug || input.sourceHotel || input.venueId,
  );
  const destination = normalizeDestination(input.destination);
  const passType = normalizeText(input.passType) || "complimentary_hotel_guest";
  const status = normalizeText(input.status) || "active";

  try {
    await client.query("BEGIN");

    let guestResult = { rows: [] };

    if (normalizedEmail && sourceHotelSlug && destination) {
      guestResult = await client.query(
        `
          UPDATE ${PASS_GUESTS_TABLE}
          SET
            full_name = $1,
            email = $2,
            normalized_email = $2,
            phone = $3,
            country = $4,
            whatsapp_opt_in = COALESCE($5, FALSE),
            marketing_consent = COALESCE($6, FALSE),
            updated_at = NOW()
          WHERE id = (
            SELECT id
            FROM ${PASS_GUESTS_TABLE}
            WHERE normalized_email = $2
              AND source_hotel_slug = $7
              AND destination = $8
            ORDER BY created_at ASC
            LIMIT 1
            FOR UPDATE
          )
          RETURNING *
        `,
        [
          normalizeText(input.fullName),
          normalizedEmail,
          normalizeText(input.phone),
          normalizeText(input.country),
          normalizeBoolean(input.whatsappOptIn, false),
          normalizeBoolean(input.marketingConsent, false),
          sourceHotelSlug,
          destination,
        ],
      );
    }

    if (!guestResult.rows[0]) {
      guestResult = await client.query(
        `
        INSERT INTO ${PASS_GUESTS_TABLE} (
          full_name,
          email,
          normalized_email,
          phone,
          country,
          whatsapp_opt_in,
          marketing_consent,
          source_hotel_slug,
          destination,
          updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, COALESCE($6, FALSE), COALESCE($7, FALSE), $8, $9, NOW()
        )
        RETURNING *
      `,
        [
          normalizeText(input.fullName),
          normalizedEmail,
          normalizedEmail,
          normalizeText(input.phone),
          normalizeText(input.country),
          normalizeBoolean(input.whatsappOptIn, false),
          normalizeBoolean(input.marketingConsent, false),
          sourceHotelSlug,
          destination,
        ],
      );
    }

    const guest = mapPassGuestRow(guestResult.rows[0]);

    let passResult = { rows: [] };

    if (
      guest.id &&
      passSourceHotelSlug &&
      passType === "complimentary_hotel_guest" &&
      status === "active"
    ) {
      passResult = await client.query(
        `
          UPDATE ${PASSES_TABLE}
          SET
            valid_from = CASE
              WHEN $3::timestamptz IS NOT NULL
                AND (valid_from IS NULL OR $3::timestamptz > valid_from)
              THEN $3::timestamptz
              ELSE valid_from
            END,
            valid_until = CASE
              WHEN $4::timestamptz IS NOT NULL
                AND (valid_until IS NULL OR $4::timestamptz > valid_until)
              THEN $4::timestamptz
              ELSE valid_until
            END,
            updated_at = NOW()
          WHERE id = (
            SELECT id
            FROM ${PASSES_TABLE}
            WHERE guest_id = $1
              AND source_hotel_slug = $2
              AND pass_type = 'complimentary_hotel_guest'
              AND status = 'active'
            ORDER BY created_at ASC
            LIMIT 1
            FOR UPDATE
          )
          RETURNING *
        `,
        [
          guest.id,
          passSourceHotelSlug,
          input.validFrom || null,
          input.validUntil || null,
        ],
      );
    }

    if (!passResult.rows[0]) {
      passResult = await client.query(
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
          guest.id,
          passSourceHotelSlug,
          passType,
          status,
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
    }

    const pass = mapPassRow(passResult.rows[0]);

    const preferencesResult = await client.query(
      `
        INSERT INTO ${GUEST_PREFERENCES_TABLE} (
          guest_id,
          pass_id,
          stay_length,
          interests,
          travel_group,
          services_interested,
          wants_whatsapp_recommendations,
          completed_at,
          updated_at
        ) VALUES (
          $1, $2, $3, $4::text[], $5, $6::text[], COALESCE($7, FALSE), $8, NOW()
        )
        ON CONFLICT (pass_id)
        DO UPDATE SET
          guest_id = EXCLUDED.guest_id,
          stay_length = EXCLUDED.stay_length,
          interests = EXCLUDED.interests,
          travel_group = EXCLUDED.travel_group,
          services_interested = EXCLUDED.services_interested,
          wants_whatsapp_recommendations = EXCLUDED.wants_whatsapp_recommendations,
          completed_at = EXCLUDED.completed_at,
          updated_at = NOW()
        RETURNING *
      `,
      [
        guest.id,
        pass.id,
        normalizeStayLength(input.stayLength),
        normalizeTextArray(input.interests),
        normalizeText(input.travelGroup),
        normalizeTextArray(
          input.bookingInterests ??
            input.servicesInterestedIn ??
            input.servicesInterested,
        ),
        normalizeBoolean(
          input.whatsappOptIn ?? input.wantsWhatsappRecommendations,
          false,
        ),
        input.completedAt || null,
      ],
    );

    await client.query("COMMIT");

    return {
      guest,
      pass,
      preferences: mapGuestPreferencesRow(preferencesResult.rows[0]),
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
