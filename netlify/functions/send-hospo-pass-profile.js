/* global exports, process, require */

const sgMail = require("@sendgrid/mail");
const pg = require("pg");

const { Pool } = pg;

const TEAM_EMAIL = "team@ahangama.com";
const FROM_EMAIL = "hello@ahangama.com";
const HOSPO_PASS_PROFILES_TABLE = "hospo_pass_profiles";
const PASS_CONTEXT_LABELS = {
  hospo: "/hospo",
  "comp-pass": "/comp-pass",
};
const AUDIENCE_LABELS = {
  business_owner: "Business owner",
  resident: "Resident",
  tourist: "Tourist",
};

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

function jsonHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeArray(value) {
  return Array.isArray(value)
    ? value.map((item) => normalizeText(item)).filter(Boolean)
    : [];
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

function normalizeBoolean(value, fallback = false) {
  if (value === null || value === undefined) {
    return fallback;
  }

  return Boolean(value);
}

async function saveHospoPassProfile({
  guest,
  pass,
  profile,
  audienceType,
  sourceHotelSlug,
  passContext,
}) {
  const passId = normalizeUuid(pass.id);

  if (!passId) {
    throw new Error("pass.id must be a valid UUID");
  }

  const submittedAt = new Date().toISOString();
  const result = await getPool().query(
    `
      INSERT INTO ${HOSPO_PASS_PROFILES_TABLE} (
        pass_id,
        guest_id,
        full_name,
        email,
        phone,
        pass_context,
        source_hotel_slug,
        audience_type,
        business_name,
        business_category,
        business_location,
        resident_area,
        resident_connection,
        stay_length,
        travel_group,
        interests,
        goals,
        whatsapp_opt_in,
        wants_partner_updates,
        notes,
        submitted_at,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, NOW()
      )
      ON CONFLICT (pass_id) DO UPDATE SET
        guest_id = EXCLUDED.guest_id,
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        pass_context = EXCLUDED.pass_context,
        source_hotel_slug = EXCLUDED.source_hotel_slug,
        audience_type = EXCLUDED.audience_type,
        business_name = EXCLUDED.business_name,
        business_category = EXCLUDED.business_category,
        business_location = EXCLUDED.business_location,
        resident_area = EXCLUDED.resident_area,
        resident_connection = EXCLUDED.resident_connection,
        stay_length = EXCLUDED.stay_length,
        travel_group = EXCLUDED.travel_group,
        interests = EXCLUDED.interests,
        goals = EXCLUDED.goals,
        whatsapp_opt_in = EXCLUDED.whatsapp_opt_in,
        wants_partner_updates = EXCLUDED.wants_partner_updates,
        notes = EXCLUDED.notes,
        submitted_at = EXCLUDED.submitted_at,
        updated_at = NOW()
      RETURNING *
    `,
    [
      passId,
      normalizeUuid(guest.id),
      normalizeText(guest.fullName),
      normalizeText(guest.email).toLowerCase(),
      normalizeText(guest.phone),
      normalizeText(passContext) || "hospo",
      normalizeText(sourceHotelSlug),
      audienceType,
      normalizeText(profile.businessName),
      normalizeText(profile.businessCategory),
      normalizeText(profile.businessLocation),
      normalizeText(profile.residentArea),
      normalizeText(profile.residentConnection),
      normalizeText(profile.stayLength),
      normalizeText(profile.travelGroup),
      normalizeArray(profile.interests),
      normalizeArray(profile.goals),
      normalizeBoolean(profile.whatsappOptIn, false),
      normalizeBoolean(profile.wantsPartnerUpdates, false),
      normalizeText(profile.notes),
      submittedAt,
    ],
  );

  return result.rows[0];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderRow(label, value) {
  const normalized = Array.isArray(value) ? value.join(", ") : normalizeText(value);

  if (!normalized) {
    return "";
  }

  return `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; width: 220px; vertical-align: top;">${escapeHtml(label)}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: #111827; white-space: pre-wrap;">${escapeHtml(normalized)}</td>
    </tr>
  `;
}

exports.handler = async (event) => {
  const headers = jsonHeaders();

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const guest = body.guest || {};
    const pass = body.pass || {};
    const profile = body.profile || {};
    const audienceType = normalizeText(profile.audienceType);
    const sourceHotelSlug = normalizeText(
      pass.sourceHotelSlug || body.sourceHotelSlug,
    );
    const passContext = normalizeText(body.passContext) || "hospo";

    if (!normalizeText(pass.id)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "pass.id is required" }),
      };
    }

    if (!normalizeText(guest.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "guest.email is required" }),
      };
    }

    if (!AUDIENCE_LABELS[audienceType]) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "audienceType is required" }),
      };
    }

    const savedProfile = await saveHospoPassProfile({
      guest,
      pass,
      profile,
      audienceType,
      sourceHotelSlug,
      passContext,
    });

    if (!process.env.SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY is not configured");
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const submittedAt = savedProfile.submitted_at || new Date().toISOString();
    const subjectName = normalizeText(guest.fullName) || normalizeText(guest.email);
    const audienceLabel = AUDIENCE_LABELS[audienceType];
    const passContextLabel = PASS_CONTEXT_LABELS[passContext] || passContext;
    const rows = [
      renderRow("Pass context", passContextLabel),
      renderRow("Audience type", audienceLabel),
      renderRow("Full name", guest.fullName),
      renderRow("Email", guest.email),
      renderRow("Phone", guest.phone),
      renderRow("Pass ID", pass.id),
      renderRow("Guest ID", guest.id),
      renderRow("Source", sourceHotelSlug),
      renderRow("Pass install URL", pass.passkitInstallUrl),
      renderRow("Business name", profile.businessName),
      renderRow("Business category", profile.businessCategory),
      renderRow("Business location", profile.businessLocation),
      renderRow("Resident area", profile.residentArea),
      renderRow("Resident connection", profile.residentConnection),
      renderRow("Stay length", profile.stayLength),
      renderRow("Travel group", profile.travelGroup),
      renderRow("Interests", normalizeArray(profile.interests)),
      renderRow("Goals", normalizeArray(profile.goals)),
      renderRow("WhatsApp opt-in", profile.whatsappOptIn ? "Yes" : "No"),
      renderRow(
        "Partner/community updates",
        profile.wantsPartnerUpdates ? "Yes" : "No",
      ),
      renderRow("Notes", profile.notes),
      renderRow("Submitted at", new Date(submittedAt).toLocaleString()),
    ].join("");

    await sgMail.send({
      to: TEAM_EMAIL,
      from: FROM_EMAIL,
      replyTo: normalizeText(guest.email),
      subject: `New ${passContextLabel} complimentary pass profile - ${audienceLabel} - ${subjectName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 760px; margin: 0 auto; color: #111827; line-height: 1.6;">
          <h1 style="margin: 0 0 8px; font-size: 26px; color: #111827;">New ${escapeHtml(passContextLabel)} complimentary pass profile</h1>
          <p style="margin: 0 0 22px; color: #4b5563;">A visitor completed the second stage of the Ahangama complimentary pass flow. This profile has been saved to the hospo_pass_profiles database table with pass context ${escapeHtml(passContextLabel)}.</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
            ${rows}
          </table>
        </div>
      `,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        submittedAt,
        profileId: savedProfile.id,
      }),
    };
  } catch (error) {
    console.error("send hospo pass profile error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || "Unable to send hospo pass profile",
      }),
    };
  }
};