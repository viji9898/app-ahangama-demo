const DEFAULT_TRACKING_BASE_URL = "https://ahangama.com";
const TRACK_CLICK_PATH = "/.netlify/functions/track-click";

function normalizeText(value) {
  return String(value || "").trim();
}

function isLocalHostname(hostname) {
  const normalized = String(hostname || "").toLowerCase();

  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "0.0.0.0" ||
    normalized.endsWith(".local")
  );
}

export function getEmailTrackingBaseUrl() {
  const candidates = [
    process.env.EMAIL_TRACKING_BASE_URL,
    process.env.GUEST_EMAIL_BASE_URL,
    process.env.EMAIL_PUBLIC_SITE_URL,
    process.env.PUBLIC_SITE_URL,
    process.env.VITE_SITE_URL,
  ];

  for (const candidate of candidates) {
    const configured = normalizeText(candidate);

    if (!configured) {
      continue;
    }

    try {
      const url = new URL(configured);

      if (!isLocalHostname(url.hostname)) {
        return url.origin.replace(/\/$/, "");
      }
    } catch {
      // Ignore invalid configured values and use production tracking.
    }
  }

  return DEFAULT_TRACKING_BASE_URL;
}

export function buildTrackedEmailLink({
  url,
  guestId,
  emailId,
  campaign,
  source = "ahangama",
  medium = "email",
  venueSlug,
  cta,
  content,
} = {}) {
  const destinationUrl = normalizeText(url);

  if (!destinationUrl) {
    return "";
  }

  const params = new URLSearchParams();
  params.set("url", destinationUrl);

  const optionalParams = {
    guestId,
    emailId,
    campaign,
    source,
    medium,
    content,
    venueSlug,
    cta,
  };

  Object.entries(optionalParams).forEach(([key, value]) => {
    const normalized = normalizeText(value);

    if (normalized) {
      params.set(key, normalized);
    }
  });

  return `${getEmailTrackingBaseUrl()}${TRACK_CLICK_PATH}?${params.toString()}`;
}
