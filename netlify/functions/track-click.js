import {
  markEmailClicked,
  recordArticleInteraction,
  recordExperienceInteraction,
  recordVenueInteraction,
} from "../../lib/hotel-passes-db.js";

function normalizeText(value) {
  return String(value || "").trim();
}

function isClickAction(action) {
  return normalizeText(action).toLowerCase().includes("click");
}

function safeRedirect(value) {
  const redirect = normalizeText(value);

  if (!redirect) {
    return "";
  }

  try {
    const parsed = new URL(redirect);

    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    if (redirect.startsWith("/") && !redirect.startsWith("//")) {
      return redirect;
    }
  }

  return "";
}

function redirectResponse(location) {
  return {
    statusCode: 302,
    headers: {
      Location: location,
      "Cache-Control": "no-store",
    },
    body: "",
  };
}

async function recordInteraction({
  guestId,
  passId,
  type,
  contentId,
  action,
  source,
}) {
  if (type === "venue") {
    return recordVenueInteraction({
      guestId,
      passId,
      venueId: contentId,
      source,
      interactionType: action,
    });
  }

  if (type === "article") {
    return recordArticleInteraction({
      guestId,
      passId,
      articleId: contentId,
      source,
      interactionType: action,
    });
  }

  if (type === "experience") {
    return recordExperienceInteraction({
      guestId,
      passId,
      experienceId: contentId,
      source,
      interactionType: action,
    });
  }

  throw new Error(`Unsupported tracking type: ${type}`);
}

export const handler = async (event) => {
  const params = event.queryStringParameters || {};
  const guestId = normalizeText(params.guestId);
  const passId = normalizeText(params.passId);
  const type = normalizeText(params.type).toLowerCase();
  const contentId = normalizeText(params.contentId);
  const action = normalizeText(params.action);
  const source = normalizeText(params.source);
  const redirect = safeRedirect(params.redirect);
  const missingFields = [
    ["guestId", guestId],
    ["passId", passId],
    ["type", type],
    ["contentId", contentId],
    ["action", action],
    ["redirect", redirect],
  ]
    .filter(([, value]) => !value)
    .map(([field]) => field);

  if (missingFields.length > 0) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Missing required tracking fields",
        fields: missingFields,
      }),
    };
  }

  try {
    await recordInteraction({
      guestId,
      passId,
      type,
      contentId,
      action,
      source,
    });

    if (source && isClickAction(action)) {
      await markEmailClicked({ guestId, passId, source });
    }
  } catch (error) {
    console.error("track-click tracking error:", {
      guestId,
      passId,
      type,
      contentId,
      action,
      source,
      message: error?.message || "Unknown tracking error",
    });
  }

  return redirectResponse(redirect);
};
