import process from "node:process";
import pg from "pg";

const { Pool } = pg;

const PROMO_PURCHASES_TABLE = "promo_purchases";
const PROMO_PASS_REDEMPTIONS_TABLE = "promo_pass_redemptions";

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

function normalizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isMissingRelationError(error, relationName) {
  return (
    error &&
    error.code === "42P01" &&
    String(error.message || "").includes(relationName)
  );
}

function mapPromoRedemptionRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    passId: row.pass_id,
    venueSlug: row.venue_slug,
    venueName: row.venue_name,
    redeemedAt: row.redeemed_at,
    redemptionType: row.redemption_type,
    offerUsed: row.offer_used,
    redeemedBy: row.redeemed_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPromoPurchaseRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    stripeSessionId: row.stripe_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    stripeCustomerId: row.stripe_customer_id,
    customerEmail: row.customer_email,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    productId: row.product_id,
    productName: row.product_name,
    productDescription: row.product_description,
    flowType: row.flow_type,
    promoCode: row.promo_code,
    venueSlug: row.venue_slug,
    ctaLocation: row.cta_location,
    utmSource: row.utm_source,
    utmMedium: row.utm_medium,
    utmCampaign: row.utm_campaign,
    utmContent: row.utm_content,
    utmTerm: row.utm_term,
    listPriceUsd: row.list_price_usd,
    discountUsd: row.discount_usd,
    chargedPriceUsd: row.charged_price_usd,
    currency: row.currency,
    startDate: row.start_date,
    expiryDate: row.expiry_date,
    validityDays: row.validity_days,
    maxPeople: row.max_people,
    passId: row.pass_id,
    passUrl: row.pass_url,
    passkitPassId: row.passkit_pass_id,
    passkitUrl: row.passkit_url,
    fulfillmentStatus: row.fulfillment_status,
    customerEmailStatus: row.customer_email_status,
    venueEmailStatus: row.venue_email_status,
    teamEmailStatus: row.team_email_status,
    customerEmailSentAt: row.customer_email_sent_at,
    venueEmailSentAt: row.venue_email_sent_at,
    teamEmailSentAt: row.team_email_sent_at,
    stripeReceiptUrl: row.stripe_receipt_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function upsertPromoPurchase(input = {}) {
  const result = await getPool().query(
    `
      INSERT INTO ${PROMO_PURCHASES_TABLE} (
        stripe_session_id,
        stripe_payment_intent_id,
        stripe_customer_id,
        customer_email,
        customer_name,
        customer_phone,
        product_id,
        product_name,
        product_description,
        flow_type,
        promo_code,
        venue_slug,
        cta_location,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        list_price_usd,
        discount_usd,
        charged_price_usd,
        currency,
        start_date,
        expiry_date,
        validity_days,
        max_people,
        pass_id,
        pass_url,
        passkit_pass_id,
        passkit_url,
        fulfillment_status,
        customer_email_status,
        venue_email_status,
        team_email_status,
        customer_email_sent_at,
        venue_email_sent_at,
        team_email_sent_at,
        stripe_receipt_url,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35, $36, $37, $38, NOW()
      )
      ON CONFLICT (stripe_session_id) DO UPDATE SET
        stripe_payment_intent_id = EXCLUDED.stripe_payment_intent_id,
        stripe_customer_id = EXCLUDED.stripe_customer_id,
        customer_email = EXCLUDED.customer_email,
        customer_name = EXCLUDED.customer_name,
        customer_phone = EXCLUDED.customer_phone,
        product_id = EXCLUDED.product_id,
        product_name = EXCLUDED.product_name,
        product_description = EXCLUDED.product_description,
        flow_type = EXCLUDED.flow_type,
        promo_code = EXCLUDED.promo_code,
        venue_slug = EXCLUDED.venue_slug,
        cta_location = EXCLUDED.cta_location,
        utm_source = EXCLUDED.utm_source,
        utm_medium = EXCLUDED.utm_medium,
        utm_campaign = EXCLUDED.utm_campaign,
        utm_content = EXCLUDED.utm_content,
        utm_term = EXCLUDED.utm_term,
        list_price_usd = EXCLUDED.list_price_usd,
        discount_usd = EXCLUDED.discount_usd,
        charged_price_usd = EXCLUDED.charged_price_usd,
        currency = EXCLUDED.currency,
        start_date = EXCLUDED.start_date,
        expiry_date = EXCLUDED.expiry_date,
        validity_days = EXCLUDED.validity_days,
        max_people = EXCLUDED.max_people,
        pass_id = EXCLUDED.pass_id,
        pass_url = EXCLUDED.pass_url,
        passkit_pass_id = COALESCE(${PROMO_PURCHASES_TABLE}.passkit_pass_id, EXCLUDED.passkit_pass_id),
        passkit_url = COALESCE(${PROMO_PURCHASES_TABLE}.passkit_url, EXCLUDED.passkit_url),
        fulfillment_status = EXCLUDED.fulfillment_status,
        customer_email_status = CASE
          WHEN EXCLUDED.customer_email_status = 'pending' THEN ${PROMO_PURCHASES_TABLE}.customer_email_status
          ELSE EXCLUDED.customer_email_status
        END,
        venue_email_status = CASE
          WHEN EXCLUDED.venue_email_status = 'pending' THEN ${PROMO_PURCHASES_TABLE}.venue_email_status
          ELSE EXCLUDED.venue_email_status
        END,
        team_email_status = CASE
          WHEN EXCLUDED.team_email_status = 'pending' THEN ${PROMO_PURCHASES_TABLE}.team_email_status
          ELSE EXCLUDED.team_email_status
        END,
        customer_email_sent_at = COALESCE(${PROMO_PURCHASES_TABLE}.customer_email_sent_at, EXCLUDED.customer_email_sent_at),
        venue_email_sent_at = COALESCE(${PROMO_PURCHASES_TABLE}.venue_email_sent_at, EXCLUDED.venue_email_sent_at),
        team_email_sent_at = COALESCE(${PROMO_PURCHASES_TABLE}.team_email_sent_at, EXCLUDED.team_email_sent_at),
        stripe_receipt_url = COALESCE(EXCLUDED.stripe_receipt_url, ${PROMO_PURCHASES_TABLE}.stripe_receipt_url),
        updated_at = NOW()
      RETURNING *
    `,
    [
      normalizeText(input.stripeSessionId),
      normalizeText(input.stripePaymentIntentId),
      normalizeText(input.stripeCustomerId),
      normalizeText(input.customerEmail),
      normalizeText(input.customerName),
      normalizeText(input.customerPhone),
      normalizeText(input.productId),
      normalizeText(input.productName),
      normalizeText(input.productDescription),
      normalizeText(input.flowType) || "promo",
      normalizeText(input.promoCode),
      normalizeText(input.venueSlug),
      normalizeText(input.ctaLocation),
      normalizeText(input.utmSource),
      normalizeText(input.utmMedium),
      normalizeText(input.utmCampaign),
      normalizeText(input.utmContent),
      normalizeText(input.utmTerm),
      normalizeNumber(input.listPriceUsd).toFixed(2),
      normalizeNumber(input.discountUsd).toFixed(2),
      normalizeNumber(input.chargedPriceUsd).toFixed(2),
      normalizeText(input.currency) || "USD",
      input.startDate || null,
      input.expiryDate || null,
      Number(input.validityDays) || null,
      Number(input.maxPeople) || null,
      normalizeText(input.passId),
      normalizeText(input.passUrl),
      normalizeText(input.passkitPassId),
      normalizeText(input.passkitUrl),
      normalizeText(input.fulfillmentStatus) || "checkout_created",
      normalizeText(input.customerEmailStatus) || "pending",
      normalizeText(input.venueEmailStatus) || "pending",
      normalizeText(input.teamEmailStatus) || "pending",
      input.customerEmailSentAt || null,
      input.venueEmailSentAt || null,
      input.teamEmailSentAt || null,
      normalizeText(input.stripeReceiptUrl),
    ],
  );

  return mapPromoPurchaseRow(result.rows[0]);
}

export async function getPromoPurchaseBySessionId(stripeSessionId) {
  const result = await getPool().query(
    `SELECT * FROM ${PROMO_PURCHASES_TABLE} WHERE stripe_session_id = $1 LIMIT 1`,
    [normalizeText(stripeSessionId)],
  );

  return mapPromoPurchaseRow(result.rows[0]);
}

export async function getPromoPurchaseByPassId(passId) {
  const result = await getPool().query(
    `SELECT * FROM ${PROMO_PURCHASES_TABLE} WHERE pass_id = $1 LIMIT 1`,
    [normalizeText(passId)],
  );

  return mapPromoPurchaseRow(result.rows[0]);
}

export async function listPromoRedemptionsForPass(passId) {
  try {
    const result = await getPool().query(
      `
        SELECT *
        FROM ${PROMO_PASS_REDEMPTIONS_TABLE}
        WHERE pass_id = $1
        ORDER BY redeemed_at DESC
      `,
      [normalizeText(passId)],
    );

    return result.rows.map((row) => mapPromoRedemptionRow(row));
  } catch (error) {
    if (isMissingRelationError(error, PROMO_PASS_REDEMPTIONS_TABLE)) {
      return [];
    }

    throw error;
  }
}

export async function getPromoRedemptionByPassAndVenue(passId, venueSlug) {
  try {
    const result = await getPool().query(
      `
        SELECT *
        FROM ${PROMO_PASS_REDEMPTIONS_TABLE}
        WHERE pass_id = $1 AND venue_slug = $2
        LIMIT 1
      `,
      [normalizeText(passId), normalizeText(venueSlug)],
    );

    return mapPromoRedemptionRow(result.rows[0]);
  } catch (error) {
    if (isMissingRelationError(error, PROMO_PASS_REDEMPTIONS_TABLE)) {
      return null;
    }

    throw error;
  }
}

export async function createPromoRedemption(input = {}) {
  const result = await getPool().query(
    `
      INSERT INTO ${PROMO_PASS_REDEMPTIONS_TABLE} (
        pass_id,
        venue_slug,
        venue_name,
        redeemed_at,
        redemption_type,
        offer_used,
        redeemed_by,
        updated_at
      ) VALUES (
        $1, $2, $3, COALESCE($4, NOW()), $5, $6, $7, NOW()
      )
      ON CONFLICT (pass_id, venue_slug) DO UPDATE SET
        venue_name = COALESCE(${PROMO_PASS_REDEMPTIONS_TABLE}.venue_name, EXCLUDED.venue_name),
        redemption_type = COALESCE(${PROMO_PASS_REDEMPTIONS_TABLE}.redemption_type, EXCLUDED.redemption_type),
        offer_used = COALESCE(${PROMO_PASS_REDEMPTIONS_TABLE}.offer_used, EXCLUDED.offer_used),
        redeemed_by = COALESCE(${PROMO_PASS_REDEMPTIONS_TABLE}.redeemed_by, EXCLUDED.redeemed_by),
        updated_at = NOW()
      RETURNING *
    `,
    [
      normalizeText(input.passId),
      normalizeText(input.venueSlug),
      normalizeText(input.venueName),
      input.redeemedAt || null,
      normalizeText(input.redemptionType),
      normalizeText(input.offerUsed),
      normalizeText(input.redeemedBy),
    ],
  );

  return mapPromoRedemptionRow(result.rows[0]);
}

export async function updatePromoPurchaseDeliveryStatus(
  stripeSessionId,
  updates = {},
) {
  const result = await getPool().query(
    `
      UPDATE ${PROMO_PURCHASES_TABLE}
      SET
        fulfillment_status = COALESCE($2, fulfillment_status),
        customer_email_status = COALESCE($3, customer_email_status),
        venue_email_status = COALESCE($4, venue_email_status),
        team_email_status = COALESCE($5, team_email_status),
        customer_email_sent_at = COALESCE($6, customer_email_sent_at),
        venue_email_sent_at = COALESCE($7, venue_email_sent_at),
        team_email_sent_at = COALESCE($8, team_email_sent_at),
        stripe_receipt_url = COALESCE($9, stripe_receipt_url),
        updated_at = NOW()
      WHERE stripe_session_id = $1
      RETURNING *
    `,
    [
      normalizeText(stripeSessionId),
      normalizeText(updates.fulfillmentStatus),
      normalizeText(updates.customerEmailStatus),
      normalizeText(updates.venueEmailStatus),
      normalizeText(updates.teamEmailStatus),
      updates.customerEmailSentAt || null,
      updates.venueEmailSentAt || null,
      updates.teamEmailSentAt || null,
      normalizeText(updates.stripeReceiptUrl),
    ],
  );

  return mapPromoPurchaseRow(result.rows[0]);
}