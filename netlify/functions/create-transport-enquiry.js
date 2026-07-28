import process from "node:process";
import sgMail from "@sendgrid/mail";
import {
  createTransportEnquiry,
  markTransportEnquiryNotificationSent,
} from "../../lib/transport-enquiries-db.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_TEXT_LENGTH = 1000;
const SERVICE_LABELS = {
  scooter: "Scooter rental",
  tuk_tuk: "Tuk-tuk rental or ride",
  airport_transfer: "Airport transfer",
  private_transfer: "Private transfer",
};

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

function positiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function escapeHtml(value) {
  return text(value, MAX_TEXT_LENGTH)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendNotification(enquiry) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn(
      "Transport enquiry stored without email notification: SENDGRID_API_KEY is not configured",
    );
    return false;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const safe = Object.fromEntries(
    Object.entries(enquiry).map(([key, value]) => [key, escapeHtml(value)]),
  );
  const serviceLabel = SERVICE_LABELS[enquiry.serviceType] || enquiry.serviceType;

  await sgMail.send({
    to:
      process.env.TRANSPORT_ENQUIRY_EMAIL ||
      process.env.STAY_ENQUIRY_EMAIL ||
      "team@ahangama.com",
    from: process.env.SENDGRID_FROM_EMAIL || "hello@ahangama.com",
    replyTo: enquiry.email,
    subject: `New transport enquiry - ${serviceLabel}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #24312c; line-height: 1.6;">
        <h1 style="font-size: 26px; color: #254d3e;">New Ahangama transport enquiry</h1>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">Service</td><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;"><strong>${escapeHtml(serviceLabel)}</strong></td></tr>
          <tr><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">Date</td><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">${safe.journeyDate}</td></tr>
          <tr><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">Pickup</td><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">${safe.pickupLocation || "Not provided"}</td></tr>
          <tr><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">Destination</td><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">${safe.destination || "Not provided"}</td></tr>
          <tr><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">Passengers</td><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">${safe.passengers}</td></tr>
          <tr><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">Rental days</td><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">${safe.rentalDays || "Not applicable"}</td></tr>
          <tr><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">Guest</td><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">${safe.name}</td></tr>
          <tr><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">Email</td><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${safe.email}">${safe.email}</a></td></tr>
          <tr><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">WhatsApp</td><td style="padding: 9px; border-bottom: 1px solid #e5e7eb;">${safe.whatsapp}</td></tr>
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
    return {
      statusCode: 405,
      headers: responseHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const serviceType = text(body.serviceType, 80);
    const journeyDate = text(body.journeyDate, 10);
    const name = text(body.name, 160);
    const email = text(body.email, 320).toLowerCase();
    const whatsapp = text(body.whatsapp, 80);
    const passengers = positiveInteger(body.passengers, 1);
    const rentalDays = body.rentalDays
      ? positiveInteger(body.rentalDays, null)
      : null;

    if (!SERVICE_LABELS[serviceType]) {
      return {
        statusCode: 400,
        headers: responseHeaders,
        body: JSON.stringify({ error: "Please choose a transport service" }),
      };
    }

    if (!journeyDate || !name || !email || !whatsapp) {
      return {
        statusCode: 400,
        headers: responseHeaders,
        body: JSON.stringify({ error: "Date, name, email and WhatsApp are required" }),
      };
    }

    if (!EMAIL_PATTERN.test(email)) {
      return {
        statusCode: 400,
        headers: responseHeaders,
        body: JSON.stringify({ error: "Please enter a valid email address" }),
      };
    }

    if (
      !DATE_PATTERN.test(journeyDate) ||
      Number.isNaN(Date.parse(`${journeyDate}T00:00:00Z`))
    ) {
      return {
        statusCode: 400,
        headers: responseHeaders,
        body: JSON.stringify({ error: "Please enter a valid date" }),
      };
    }

    if (passengers > 20 || (rentalDays && rentalDays > 90)) {
      return {
        statusCode: 400,
        headers: responseHeaders,
        body: JSON.stringify({ error: "Please enter valid trip details" }),
      };
    }

    const enquiry = await createTransportEnquiry({
      serviceType,
      journeyDate,
      pickupLocation: text(body.pickupLocation, 240),
      destination: text(body.destination, 240),
      passengers,
      rentalDays,
      name,
      email,
      whatsapp,
      notes: text(body.notes, MAX_TEXT_LENGTH),
      source: text(body.source, 120) || "transport-page",
    });

    try {
      if (await sendNotification(enquiry)) {
        await markTransportEnquiryNotificationSent(enquiry.id);
      }
    } catch (error) {
      console.error("Transport enquiry notification failed:", error);
    }

    return {
      statusCode: 201,
      headers: responseHeaders,
      body: JSON.stringify({ success: true, enquiryId: enquiry.id }),
    };
  } catch (error) {
    console.error("create-transport-enquiry error:", error);
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify({ error: "Unable to create transport enquiry" }),
    };
  }
};