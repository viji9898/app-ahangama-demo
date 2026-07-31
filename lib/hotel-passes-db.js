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
const EMAIL_CLICKS_TABLE = "email_clicks";
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

function normalizeUuid(value) {
  const normalized = normalizeText(value);

  if (
    normalized &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      normalized,
    )
  ) {
    return normalized;
  }

  return null;
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
    verificationCode: row.pass_verification_code,
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

function mapGuestPassInteractionRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.event_id,
    type: row.event_type,
    interactionType: row.interaction_type,
    contentType: row.content_type,
    contentId: row.content_id,
    source: row.source,
    campaign: row.campaign,
    cta: row.cta,
    destinationUrl: row.destination_url,
    eventAt: row.event_at,
    sourceHotelSlug: row.source_hotel_slug,
    guest: {
      id: row.guest_id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      destination: row.destination,
    },
    pass: {
      id: row.pass_id,
      status: row.pass_status,
      passType: row.pass_type,
      validFrom: row.valid_from,
      validUntil: row.valid_until,
      verificationCode: row.pass_verification_code,
      passkitInstallUrl: row.passkit_install_url,
    },
    email: {
      id: row.email_id,
      type: row.email_type,
      opened: row.email_opened,
      clicked: row.email_clicked,
    },
  };
}

function buildInteractionSummary(interactions) {
  const uniqueGuests = new Set();
  const uniquePasses = new Set();
  const byType = {};
  const byVenue = {};

  interactions.forEach((interaction) => {
    if (interaction.guest?.id) {
      uniqueGuests.add(interaction.guest.id);
    }

    if (interaction.pass?.id) {
      uniquePasses.add(interaction.pass.id);
    }

    const type = interaction.type || "unknown";
    byType[type] = (byType[type] || 0) + 1;

    const venue = interaction.sourceHotelSlug || "unknown";
    byVenue[venue] = (byVenue[venue] || 0) + 1;
  });

  return {
    total: interactions.length,
    uniqueGuests: uniqueGuests.size,
    uniquePasses: uniquePasses.size,
    emailSends: byType.email_sent || 0,
    emailClicks: byType.email_click || 0,
    contentInteractions:
      (byType.venue_interaction || 0) +
      (byType.article_interaction || 0) +
      (byType.experience_interaction || 0),
    byType,
    byVenue,
  };
}

function buildGuestInteractionProfiles(interactions) {
  const profileMap = new Map();

  interactions.forEach((interaction) => {
    const guestId = interaction.guest?.id || "unknown";
    const key = guestId;
    const current = profileMap.get(key) || {
      id: key,
      guest: interaction.guest,
      sourceHotelSlug: interaction.sourceHotelSlug,
      passes: new Map(),
      totalInteractions: 0,
      emailSends: 0,
      emailClicks: 0,
      contentInteractions: 0,
      lastInteractionAt: null,
      lastInteractionType: null,
      campaigns: new Set(),
      content: new Set(),
    };

    current.totalInteractions += 1;

    if (interaction.type === "email_sent") {
      current.emailSends += 1;
    } else if (interaction.type === "email_click") {
      current.emailClicks += 1;
    } else {
      current.contentInteractions += 1;
    }

    if (interaction.pass?.id) {
      current.passes.set(interaction.pass.id, interaction.pass);
    }

    if (interaction.campaign) {
      current.campaigns.add(interaction.campaign);
    }

    if (interaction.contentId) {
      current.content.add(interaction.contentId);
    }

    if (
      interaction.eventAt &&
      (!current.lastInteractionAt ||
        new Date(interaction.eventAt) > new Date(current.lastInteractionAt))
    ) {
      current.lastInteractionAt = interaction.eventAt;
      current.lastInteractionType = interaction.type;
    }

    profileMap.set(key, current);
  });

  return [...profileMap.values()]
    .map((profile) => ({
      ...profile,
      passes: [...profile.passes.values()],
      campaigns: [...profile.campaigns],
      content: [...profile.content],
    }))
    .sort((left, right) => {
      const leftTime = left.lastInteractionAt
        ? new Date(left.lastInteractionAt).getTime()
        : 0;
      const rightTime = right.lastInteractionAt
        ? new Date(right.lastInteractionAt).getTime()
        : 0;

      return rightTime - leftTime;
    });
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
          whatsapp_opt_in = COALESCE($5, TRUE),
          marketing_consent = COALESCE($6, TRUE),
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
        normalizeBoolean(input.whatsappOptIn, true),
        normalizeBoolean(input.marketingConsent, true),
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
        $1, $2, $3, $4, $5, COALESCE($6, TRUE), COALESCE($7, TRUE), $8, $9, NOW()
      )
      RETURNING *
    `,
    [
      normalizeText(input.fullName),
      normalizedEmail,
      normalizedEmail,
      normalizeText(input.phone),
      normalizeText(input.country),
      normalizeBoolean(input.whatsappOptIn, true),
      normalizeBoolean(input.marketingConsent, true),
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
          pass_verification_code = COALESCE(pass_verification_code, $5),
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
        normalizeText(input.verificationCode),
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
        pass_verification_code,
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
        $5, $6, $7, $8, $9, $10, $11, $12, $13,
        COALESCE($14, FALSE), COALESCE($15, FALSE), $16, NOW()
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
      normalizeText(input.verificationCode),
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

export async function getPassVerificationByCode(code) {
  const normalizedCode = normalizeText(code)?.toLowerCase();

  if (!normalizedCode) {
    return null;
  }

  const result = await getPool().query(
    `
      SELECT
        p.id AS pass_id,
        p.pass_verification_code,
        p.source_hotel_slug,
        p.pass_type,
        p.status,
        p.valid_from,
        p.valid_until,
        p.passkit_status,
        p.created_at AS issued_at,
        g.id AS guest_id,
        g.full_name,
        g.email,
        g.phone,
        g.destination
      FROM ${PASSES_TABLE} p
      INNER JOIN ${PASS_GUESTS_TABLE} g ON g.id = p.guest_id
      WHERE LOWER(p.pass_verification_code) = $1
      LIMIT 1
    `,
    [normalizedCode],
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    passId: row.pass_id,
    verificationCode: row.pass_verification_code,
    sourceHotelSlug: row.source_hotel_slug,
    passType: row.pass_type,
    status: row.status,
    validFrom: row.valid_from,
    validUntil: row.valid_until,
    passkitStatus: row.passkit_status,
    issuedAt: row.issued_at,
    guestId: row.guest_id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    destination: row.destination,
  };
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

export async function recordEmailClick({
  guestId,
  emailId,
  venueSlug,
  cta,
  campaign,
  source,
  medium,
  content,
  destinationUrl,
  userAgent,
  ipAddress,
  clickedAt,
} = {}) {
  const result = await getPool().query(
    `
      INSERT INTO ${EMAIL_CLICKS_TABLE} (
        guest_id,
        email_id,
        venue_slug,
        cta,
        campaign,
        source,
        medium,
        content,
        destination_url,
        user_agent,
        ip_address,
        clicked_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, COALESCE($12, NOW()))
      RETURNING *
    `,
    [
      normalizeUuid(guestId),
      normalizeUuid(emailId),
      normalizeText(venueSlug),
      normalizeText(cta),
      normalizeText(campaign),
      normalizeText(source),
      normalizeText(medium),
      normalizeText(content),
      normalizeText(destinationUrl),
      normalizeText(userAgent),
      normalizeText(ipAddress),
      clickedAt || null,
    ],
  );

  return result.rows[0];
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
    values.push(normalizeBoolean(updates.whatsappOptIn, true));
    assignments.push(`whatsapp_opt_in = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(updates, "marketingConsent")) {
    values.push(normalizeBoolean(updates.marketingConsent, true));
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

export async function listIssuedFreePasses({
  sourceHotelSlug,
  limit = 500,
} = {}) {
  const normalizedSourceHotelSlug = normalizeHotelSlug(sourceHotelSlug);
  const normalizedLimit = Math.min(
    Math.max(normalizeInteger(limit) || 500, 1),
    1000,
  );

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

export async function listGuestPassInteractions({
  sourceHotelSlug,
  limit = 500,
} = {}) {
  const normalizedSourceHotelSlug = normalizeHotelSlug(sourceHotelSlug);
  const normalizedLimit = Math.min(
    Math.max(normalizeInteger(limit) || 500, 1),
    1000,
  );

  const result = await getPool().query(
    `
      WITH events AS (
        SELECT
          guest_email_history.id::text AS event_id,
          'email_sent'::text AS event_type,
          guest_email_history.email_type AS interaction_type,
          'email'::text AS content_type,
          guest_email_history.email_type AS content_id,
          guest_email_history.email_type AS source,
          NULL::text AS campaign,
          NULL::text AS cta,
          NULL::text AS destination_url,
          guest_email_history.sent_at AS event_at,
          guest_email_history.guest_id,
          guest_email_history.pass_id,
          guest_email_history.id AS email_id,
          guest_email_history.email_type,
          guest_email_history.opened AS email_opened,
          guest_email_history.clicked AS email_clicked
        FROM ${GUEST_EMAIL_HISTORY_TABLE} AS guest_email_history

        UNION ALL

        SELECT
          email_clicks.id::text AS event_id,
          'email_click'::text AS event_type,
          email_clicks.cta AS interaction_type,
          'email_click'::text AS content_type,
          COALESCE(email_clicks.content, email_clicks.venue_slug, email_clicks.campaign) AS content_id,
          email_clicks.source,
          email_clicks.campaign,
          email_clicks.cta,
          email_clicks.destination_url,
          email_clicks.clicked_at AS event_at,
          email_clicks.guest_id,
          COALESCE(guest_email_history.pass_id, fallback_pass.id) AS pass_id,
          email_clicks.email_id,
          guest_email_history.email_type,
          guest_email_history.opened AS email_opened,
          TRUE AS email_clicked
        FROM ${EMAIL_CLICKS_TABLE} AS email_clicks
        LEFT JOIN ${GUEST_EMAIL_HISTORY_TABLE} AS guest_email_history
          ON guest_email_history.id = email_clicks.email_id
        LEFT JOIN LATERAL (
          SELECT passes.id
          FROM ${PASSES_TABLE} AS passes
          WHERE passes.guest_id = email_clicks.guest_id
            AND passes.pass_type = 'complimentary_hotel_guest'
          ORDER BY passes.created_at DESC
          LIMIT 1
        ) AS fallback_pass ON TRUE

        UNION ALL

        SELECT
          venue_interactions.id::text AS event_id,
          'venue_interaction'::text AS event_type,
          venue_interactions.interaction_type,
          'venue'::text AS content_type,
          venue_interactions.venue_id AS content_id,
          venue_interactions.source,
          NULL::text AS campaign,
          NULL::text AS cta,
          NULL::text AS destination_url,
          venue_interactions.created_at AS event_at,
          venue_interactions.guest_id,
          venue_interactions.pass_id,
          NULL::uuid AS email_id,
          NULL::text AS email_type,
          NULL::boolean AS email_opened,
          NULL::boolean AS email_clicked
        FROM ${VENUE_INTERACTIONS_TABLE} AS venue_interactions

        UNION ALL

        SELECT
          article_interactions.id::text AS event_id,
          'article_interaction'::text AS event_type,
          article_interactions.interaction_type,
          'article'::text AS content_type,
          article_interactions.article_id AS content_id,
          article_interactions.source,
          NULL::text AS campaign,
          NULL::text AS cta,
          NULL::text AS destination_url,
          article_interactions.created_at AS event_at,
          article_interactions.guest_id,
          article_interactions.pass_id,
          NULL::uuid AS email_id,
          NULL::text AS email_type,
          NULL::boolean AS email_opened,
          NULL::boolean AS email_clicked
        FROM ${ARTICLE_INTERACTIONS_TABLE} AS article_interactions

        UNION ALL

        SELECT
          experience_interactions.id::text AS event_id,
          'experience_interaction'::text AS event_type,
          experience_interactions.interaction_type,
          'experience'::text AS content_type,
          experience_interactions.experience_id AS content_id,
          experience_interactions.source,
          NULL::text AS campaign,
          NULL::text AS cta,
          NULL::text AS destination_url,
          experience_interactions.created_at AS event_at,
          experience_interactions.guest_id,
          experience_interactions.pass_id,
          NULL::uuid AS email_id,
          NULL::text AS email_type,
          NULL::boolean AS email_opened,
          NULL::boolean AS email_clicked
        FROM ${EXPERIENCE_INTERACTIONS_TABLE} AS experience_interactions
      )
      SELECT
        events.*,
        pass_guests.full_name,
        pass_guests.email,
        pass_guests.phone,
        pass_guests.destination,
        COALESCE(passes.source_hotel_slug, pass_guests.source_hotel_slug, 'unknown') AS source_hotel_slug,
        passes.status AS pass_status,
        passes.pass_type,
        passes.valid_from,
        passes.valid_until,
        passes.pass_verification_code,
        passes.passkit_install_url
      FROM events
      LEFT JOIN ${PASS_GUESTS_TABLE} AS pass_guests
        ON pass_guests.id = events.guest_id
      LEFT JOIN ${PASSES_TABLE} AS passes
        ON passes.id = events.pass_id
      WHERE ($1::text IS NULL OR COALESCE(passes.source_hotel_slug, pass_guests.source_hotel_slug) = $1)
      ORDER BY events.event_at DESC
      LIMIT $2
    `,
    [normalizedSourceHotelSlug, normalizedLimit],
  );

  const interactions = result.rows.map(mapGuestPassInteractionRow).filter(Boolean);

  return {
    interactions,
    guests: buildGuestInteractionProfiles(interactions),
    summary: buildInteractionSummary(interactions),
  };
}

function mapCountRow(row) {
  return {
    label: row.label || "Unknown",
    value: Number(row.value || 0),
  };
}

export async function getTipVendorStats() {
  const [summaryResult, topArticlesResult, topClickedContentResult, topInterestsResult] =
    await Promise.all([
      getPool().query(
        `
          WITH email_database AS (
            SELECT normalized_email AS email
            FROM ${PASS_GUESTS_TABLE}
            WHERE normalized_email IS NOT NULL

            UNION

            SELECT LOWER(email) AS email
            FROM ${NEWSLETTER_SUBSCRIBERS_TABLE}
            WHERE email IS NOT NULL
              AND COALESCE(subscription_status, TRUE) = TRUE
          ),
          email_summary AS (
            SELECT
              COUNT(*)::int AS emails_sent,
              COUNT(*) FILTER (WHERE opened)::int AS emails_opened,
              COUNT(*) FILTER (WHERE clicked)::int AS emails_clicked
            FROM ${GUEST_EMAIL_HISTORY_TABLE}
          ),
          click_summary AS (
            SELECT
              COUNT(*)::int AS email_clicks,
              COUNT(DISTINCT guest_id)::int AS unique_email_clickers
            FROM ${EMAIL_CLICKS_TABLE}
          ),
          guest_summary AS (
            SELECT
              COUNT(DISTINCT pass_guests.id)::int AS pass_guests,
              COUNT(DISTINCT country)::int AS countries,
              COALESCE(ROUND(AVG(stay_length)::numeric, 1), 0)::float AS average_stay_nights
            FROM ${PASS_GUESTS_TABLE}
            LEFT JOIN ${GUEST_PREFERENCES_TABLE}
              ON guest_preferences.guest_id = pass_guests.id
          ),
          pass_summary AS (
            SELECT COUNT(*)::int AS passes_issued
            FROM ${PASSES_TABLE}
            WHERE pass_type = 'complimentary_hotel_guest'
          )
          SELECT
            email_summary.emails_sent,
            email_summary.emails_opened,
            email_summary.emails_clicked,
            click_summary.email_clicks,
            click_summary.unique_email_clickers,
            guest_summary.pass_guests,
            guest_summary.countries,
            guest_summary.average_stay_nights,
            pass_summary.passes_issued,
            (SELECT COUNT(*)::int FROM email_database) AS email_database_size,
            CASE
              WHEN email_summary.emails_sent = 0 THEN 0
              ELSE ROUND((email_summary.emails_clicked::numeric / email_summary.emails_sent::numeric) * 100, 1)
            END::float AS email_click_rate,
            CASE
              WHEN email_summary.emails_sent = 0 THEN 0
              ELSE ROUND((email_summary.emails_opened::numeric / email_summary.emails_sent::numeric) * 100, 1)
            END::float AS email_open_rate
          FROM email_summary, click_summary, guest_summary, pass_summary
        `,
      ),
      getPool().query(
        `
          SELECT
            article_id AS label,
            COUNT(*)::int AS value
          FROM ${ARTICLE_INTERACTIONS_TABLE}
          GROUP BY article_id
          ORDER BY value DESC, article_id ASC
          LIMIT 6
        `,
      ),
      getPool().query(
        `
          SELECT
            COALESCE(NULLIF(content, ''), NULLIF(cta, ''), NULLIF(venue_slug, ''), NULLIF(campaign, ''), 'Unknown click') AS label,
            COUNT(*)::int AS value
          FROM ${EMAIL_CLICKS_TABLE}
          GROUP BY COALESCE(NULLIF(content, ''), NULLIF(cta, ''), NULLIF(venue_slug, ''), NULLIF(campaign, ''), 'Unknown click')
          ORDER BY value DESC, label ASC
          LIMIT 6
        `,
      ),
      getPool().query(
        `
          WITH clicked_guests AS (
            SELECT DISTINCT guest_id
            FROM ${EMAIL_CLICKS_TABLE}
            WHERE guest_id IS NOT NULL
          ),
          interest_values AS (
            SELECT UNNEST(guest_preferences.interests) AS label
            FROM ${GUEST_PREFERENCES_TABLE} AS guest_preferences
            INNER JOIN clicked_guests
              ON clicked_guests.guest_id = guest_preferences.guest_id
            WHERE guest_preferences.interests IS NOT NULL

            UNION ALL

            SELECT UNNEST(guest_preferences.services_interested) AS label
            FROM ${GUEST_PREFERENCES_TABLE} AS guest_preferences
            INNER JOIN clicked_guests
              ON clicked_guests.guest_id = guest_preferences.guest_id
            WHERE guest_preferences.services_interested IS NOT NULL
          )
          SELECT
            label,
            COUNT(*)::int AS value
          FROM interest_values
          WHERE label IS NOT NULL
            AND BTRIM(label) <> ''
          GROUP BY label
          ORDER BY value DESC, label ASC
          LIMIT 8
        `,
      ),
    ]);

  const summary = summaryResult.rows[0] || {};

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      emailDatabaseSize: Number(summary.email_database_size || 0),
      emailsSent: Number(summary.emails_sent || 0),
      emailsOpened: Number(summary.emails_opened || 0),
      emailOpenRate: Number(summary.email_open_rate || 0),
      emailClicks: Number(summary.email_clicks || 0),
      uniqueEmailClickers: Number(summary.unique_email_clickers || 0),
      emailClickRate: Number(summary.email_click_rate || 0),
      passGuests: Number(summary.pass_guests || 0),
      passesIssued: Number(summary.passes_issued || 0),
      countries: Number(summary.countries || 0),
      averageStayNights: Number(summary.average_stay_nights || 0),
    },
    topArticles: topArticlesResult.rows.map(mapCountRow),
    topClickedContent: topClickedContentResult.rows.map(mapCountRow),
    topInterests: topInterestsResult.rows.map(mapCountRow),
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
            whatsapp_opt_in = COALESCE($5, TRUE),
            marketing_consent = COALESCE($6, TRUE),
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
          normalizeBoolean(input.whatsappOptIn, true),
          normalizeBoolean(input.marketingConsent, true),
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
          $1, $2, $3, $4, $5, COALESCE($6, TRUE), COALESCE($7, TRUE), $8, $9, NOW()
        )
        RETURNING *
      `,
        [
          normalizeText(input.fullName),
          normalizedEmail,
          normalizedEmail,
          normalizeText(input.phone),
          normalizeText(input.country),
          normalizeBoolean(input.whatsappOptIn, true),
          normalizeBoolean(input.marketingConsent, true),
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
            pass_verification_code = COALESCE(pass_verification_code, $5),
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
          normalizeText(input.verificationCode),
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
          pass_verification_code,
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
          $5, $6, $7, $8, $9, $10, $11, $12, $13,
          COALESCE($14, FALSE), COALESCE($15, FALSE), $16, NOW()
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
          normalizeText(input.verificationCode),
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
