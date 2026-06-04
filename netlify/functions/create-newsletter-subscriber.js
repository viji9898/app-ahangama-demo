import { createNewsletterSubscriber } from "../../lib/newsletter-subscribers-db.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export const handler = async (event) => {
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
    const email = normalizeEmail(body.email);
    const source = String(body.source || "homepage-footer").trim() || "homepage-footer";

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Email is required" }),
      };
    }

    if (!EMAIL_PATTERN.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Please enter a valid email address" }),
      };
    }

    const { subscriber, created } = await createNewsletterSubscriber({
      email,
      source,
      subscribedAt: new Date().toISOString(),
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        duplicate: !created,
        subscriber,
      }),
    };
  } catch (error) {
    console.error("create-newsletter-subscriber error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || "Unable to create newsletter subscriber",
      }),
    };
  }
};