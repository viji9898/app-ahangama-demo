import process from "node:process";
import sgMail from "@sendgrid/mail";
import {
  createRetreatEnquiry,
  markRetreatEnquiryNotificationSent,
} from "../../lib/retreat-enquiries-db.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_TEXT_LENGTH = 1000;

function headers() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function text(value, maxLength = 200) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return text(value, MAX_TEXT_LENGTH)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function venueLabel(value) {
  const labels = {
    "help-me-choose": "Help me choose",
    "kurulu-bay": "Kurulu Bay",
    "the-palm": "The PALM",
    makahiya: "Makahiya",
  };
  return labels[value] || value;
}

async function sendNotification(enquiry) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("Retreat enquiry stored without email notification: SENDGRID_API_KEY is not configured");
    return false;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const safe = Object.fromEntries(
    Object.entries(enquiry).map(([key, value]) => [key, escapeHtml(value)]),
  );

  await sgMail.send({
    to: process.env.RETREAT_ENQUIRY_EMAIL || process.env.STAY_ENQUIRY_EMAIL || "team@ahangama.com",
    from: process.env.SENDGRID_FROM_EMAIL || "hello@ahangama.com",
    replyTo: enquiry.email,
    subject: `New retreat enquiry - ${venueLabel(enquiry.preferredVenue)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #26302b; line-height: 1.6;">
        <h1 style="font-size: 26px; color: #344b3f;">New Ahangama retreat enquiry</h1>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">Venue</td><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;"><strong>${escapeHtml(venueLabel(enquiry.preferredVenue))}</strong></td></tr>
          <tr><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">Retreat style</td><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">${safe.retreatStyle}</td></tr>
          <tr><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">Dates</td><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">${safe.startDate} to ${safe.endDate}</td></tr>
          <tr><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">Expected guests</td><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">${safe.expectedGuests}</td></tr>
          <tr><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">Organiser</td><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">${safe.name}</td></tr>
          <tr><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">Email</td><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${safe.email}">${safe.email}</a></td></tr>
          <tr><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">WhatsApp</td><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">${safe.whatsapp || "Not provided"}</td></tr>
          <tr><td style="padding: 9px; vertical-align: top;">Notes</td><td style="padding: 9px; white-space: pre-wrap;">${safe.notes || "None"}</td></tr>
        </table>
        <p style="color: #69746f; font-size: 12px;">Enquiry ID: ${safe.id} · Source: ${safe.source}</p>
      </div>
    `,
  });

  return true;
}

export const handler = async (event) => {
  const responseHeaders = headers();

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: responseHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: responseHeaders, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const preferredVenue = text(body.preferredVenue, 80) || "help-me-choose";
    const retreatStyle = text(body.retreatStyle, 120);
    const startDate = text(body.startDate, 10);
    const endDate = text(body.endDate, 10);
    const expectedGuests = Number(body.expectedGuests);
    const name = text(body.name, 160);
    const email = text(body.email, 320).toLowerCase();

    if (!retreatStyle || !startDate || !endDate || !name || !email) {
      return { statusCode: 400, headers: responseHeaders, body: JSON.stringify({ error: "Retreat style, dates, name and email are required" }) };
    }
    if (!DATE_PATTERN.test(startDate) || !DATE_PATTERN.test(endDate) || endDate < startDate) {
      return { statusCode: 400, headers: responseHeaders, body: JSON.stringify({ error: "Please enter a valid date range" }) };
    }
    if (!Number.isInteger(expectedGuests) || expectedGuests < 1 || expectedGuests > 200) {
      return { statusCode: 400, headers: responseHeaders, body: JSON.stringify({ error: "Expected guests must be between 1 and 200" }) };
    }
    if (!EMAIL_PATTERN.test(email)) {
      return { statusCode: 400, headers: responseHeaders, body: JSON.stringify({ error: "Please enter a valid email address" }) };
    }

    const enquiry = await createRetreatEnquiry({
      preferredVenue,
      retreatStyle,
      startDate,
      endDate,
      expectedGuests,
      name,
      email,
      whatsapp: text(body.whatsapp, 80),
      notes: text(body.notes, MAX_TEXT_LENGTH),
      source: text(body.source, 120) || "host-a-retreat",
    });

    try {
      if (await sendNotification(enquiry)) {
        await markRetreatEnquiryNotificationSent(enquiry.id);
      }
    } catch (error) {
      console.error("Retreat enquiry notification failed:", error);
    }

    return { statusCode: 201, headers: responseHeaders, body: JSON.stringify({ success: true, enquiryId: enquiry.id }) };
  } catch (error) {
    console.error("create-retreat-enquiry error:", error);
    return { statusCode: 500, headers: responseHeaders, body: JSON.stringify({ error: "Unable to create retreat enquiry" }) };
  }
};