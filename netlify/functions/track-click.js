import {
  markEmailClicked,
  recordEmailClick,
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

function validHttpUrl(value) {
  const candidate = normalizeText(value);

  if (!candidate) {
    return null;
  }

  try {
    const parsed = new URL(candidate);

    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

function appendUtmParameters(url, { campaign, content, cta } = {}) {
  url.searchParams.set("utm_source", "ahangama");
  url.searchParams.set("utm_medium", "email");

  const normalizedCampaign = normalizeText(campaign);
  const normalizedContent = normalizeText(content) || normalizeText(cta);

  if (normalizedCampaign) {
    url.searchParams.set("utm_campaign", normalizedCampaign);
  }

  if (normalizedContent) {
    url.searchParams.set("utm_content", normalizedContent);
  }

  return url.toString();
}

function getHeader(event, name) {
  const headers = event.headers || {};
  const lowerName = name.toLowerCase();
  const matchingKey = Object.keys(headers).find(
    (key) => key.toLowerCase() === lowerName,
  );

  return matchingKey ? headers[matchingKey] : "";
}

function getIpAddress(event) {
  const forwardedFor = normalizeText(getHeader(event, "x-forwarded-for"));

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || forwardedFor;
  }

  return (
    normalizeText(getHeader(event, "x-nf-client-connection-ip")) ||
    normalizeText(getHeader(event, "client-ip")) ||
    normalizeText(event.requestContext?.identity?.sourceIp)
  );
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
  const destinationUrl = validHttpUrl(params.url);

  if (Object.prototype.hasOwnProperty.call(params, "url")) {
    if (!destinationUrl) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "A valid http/https url is required" }),
      };
    }

    const source = normalizeText(params.source) || "ahangama";
    const medium = normalizeText(params.medium) || "email";
    const finalDestinationUrl = appendUtmParameters(destinationUrl, {
      campaign: params.campaign,
      content: params.content,
      cta: params.cta,
    });

    try {
      await recordEmailClick({
        guestId: params.guestId,
        emailId: params.emailId,
        venueSlug: params.venueSlug,
        cta: params.cta,
        campaign: params.campaign,
        source,
        medium,
        content: params.content,
        destinationUrl: finalDestinationUrl,
        userAgent: getHeader(event, "user-agent"),
        ipAddress: getIpAddress(event),
        clickedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("track-click email click error:", {
        guestId: params.guestId,
        emailId: params.emailId,
        campaign: params.campaign,
        cta: params.cta,
        message: error?.message || "Unknown email click tracking error",
      });
    }

    return redirectResponse(finalDestinationUrl);
  }

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
