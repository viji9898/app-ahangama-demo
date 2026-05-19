const ATTRIBUTION_STORAGE_KEY = "ahangama_pass_attribution";

export const PASS_CTA_BASE_URL = "https://pass.ahangama.com";

export const PASS_ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

const hasValue = (value) => typeof value === "string" && value.length > 0;

const sanitizeAttribution = (attribution = {}) =>
  PASS_ATTRIBUTION_KEYS.reduce((result, key) => {
    if (hasValue(attribution[key])) {
      result[key] = attribution[key];
    }

    return result;
  }, {});

const hasAttribution = (attribution = {}) =>
  PASS_ATTRIBUTION_KEYS.some((key) => hasValue(attribution[key]));

export const getPassAttributionFromSearch = (search = "") => {
  const params = new URLSearchParams(search);

  return sanitizeAttribution(
    PASS_ATTRIBUTION_KEYS.reduce((result, key) => {
      const value = params.get(key);

      if (value !== null) {
        result[key] = value;
      }

      return result;
    }, {}),
  );
};

export const isCanonicalQrAttribution = (attribution = {}) =>
  attribution.utm_source === "qr" &&
  attribution.utm_medium === "offline" &&
  hasValue(attribution.utm_content);

export const readStoredPassAttribution = () => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);

    if (!rawValue) {
      return {};
    }

    return sanitizeAttribution(JSON.parse(rawValue));
  } catch {
    return {};
  }
};

const writeStoredPassAttribution = (attribution = {}) => {
  if (typeof window === "undefined") {
    return {};
  }

  const sanitizedAttribution = sanitizeAttribution(attribution);

  if (!hasAttribution(sanitizedAttribution)) {
    return sanitizedAttribution;
  }

  try {
    window.localStorage.setItem(
      ATTRIBUTION_STORAGE_KEY,
      JSON.stringify(sanitizedAttribution),
    );
  } catch {
    return sanitizedAttribution;
  }

  return sanitizedAttribution;
};

export const persistPassAttribution = (search) => {
  if (typeof window === "undefined") {
    return {};
  }

  const incomingAttribution = getPassAttributionFromSearch(
    typeof search === "string" ? search : window.location.search,
  );
  const storedAttribution = readStoredPassAttribution();

  if (
    !hasAttribution(storedAttribution) &&
    hasAttribution(incomingAttribution)
  ) {
    return writeStoredPassAttribution(incomingAttribution);
  }

  if (
    hasAttribution(incomingAttribution) &&
    isCanonicalQrAttribution(incomingAttribution)
  ) {
    return writeStoredPassAttribution(incomingAttribution);
  }

  return storedAttribution;
};

export const getPassAttribution = () => persistPassAttribution();

export const buildPassCtaUrl = (destinationUrl = PASS_CTA_BASE_URL) => {
  const attribution = getPassAttribution();

  if (!hasAttribution(attribution)) {
    return destinationUrl;
  }

  try {
    const url = destinationUrl.startsWith("http")
      ? new URL(destinationUrl)
      : new URL(destinationUrl, window.location.origin);

    PASS_ATTRIBUTION_KEYS.forEach((key) => {
      if (hasValue(attribution[key])) {
        url.searchParams.set(key, attribution[key]);
      }
    });

    return url.toString();
  } catch {
    return destinationUrl;
  }
};
