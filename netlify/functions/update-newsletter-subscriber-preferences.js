import { updateNewsletterSubscriberPreferences } from "../../lib/newsletter-subscribers-db.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AUDIENCE_TYPES = [
  "I live in Ahangama",
  "I’m Sri Lankan / local and visit often",
  "I’m currently visiting Ahangama",
  "I’m planning to visit soon",
  "I’m interested in Ahangama / Sri Lanka",
];
const INTEREST_OPTIONS = [
  "Food & cafés",
  "Surf",
  "Wellness",
  "Events",
  "Places to stay",
  "Local deals",
];

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

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
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
    const name = normalizeText(body.name);
    const audienceType = normalizeText(body.audienceType);
    const interests = Array.isArray(body.interests)
      ? body.interests.map((interest) => normalizeText(interest)).filter(Boolean)
      : [];

    if (!email || !EMAIL_PATTERN.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "A valid email address is required" }),
      };
    }

    if (!name) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Name is required" }),
      };
    }

    if (!AUDIENCE_TYPES.includes(audienceType)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Please choose a valid audience type" }),
      };
    }

    if (!interests.length) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Please choose at least one interest" }),
      };
    }

    if (interests.some((interest) => !INTEREST_OPTIONS.includes(interest))) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Please choose valid interests" }),
      };
    }

    const subscriber = await updateNewsletterSubscriberPreferences(email, {
      name,
      audienceType,
      interests,
    });

    if (!subscriber) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "Subscriber not found" }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, subscriber }),
    };
  } catch (error) {
    console.error("update-newsletter-subscriber-preferences error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || "Unable to update newsletter preferences",
      }),
    };
  }
};