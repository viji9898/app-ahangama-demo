/* global exports, process, require */

const sgMail = require("@sendgrid/mail");

const TEAM_EMAIL = "team@ahangama.com";
const FROM_EMAIL = "hello@ahangama.com";
const AUDIENCE_LABELS = {
  business_owner: "Business owner",
  resident: "Resident",
  tourist: "Tourist",
};

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

    if (!process.env.SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY is not configured");
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const submittedAt = new Date().toISOString();
    const subjectName = normalizeText(guest.fullName) || normalizeText(guest.email);
    const audienceLabel = AUDIENCE_LABELS[audienceType];
    const rows = [
      renderRow("Audience type", audienceLabel),
      renderRow("Full name", guest.fullName),
      renderRow("Email", guest.email),
      renderRow("Phone", guest.phone),
      renderRow("Pass ID", pass.id),
      renderRow("Guest ID", guest.id),
      renderRow("Source", pass.sourceHotelSlug || body.sourceHotelSlug),
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
      subject: `New /hospo complimentary pass profile - ${audienceLabel} - ${subjectName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 760px; margin: 0 auto; color: #111827; line-height: 1.6;">
          <h1 style="margin: 0 0 8px; font-size: 26px; color: #111827;">New /hospo complimentary pass profile</h1>
          <p style="margin: 0 0 22px; color: #4b5563;">A visitor completed the second stage of the Ahangama complimentary pass flow. This profile has not been saved to a dedicated database table.</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
            ${rows}
          </table>
        </div>
      `,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, submittedAt }),
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