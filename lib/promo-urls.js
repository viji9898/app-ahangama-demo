import process from "node:process";

const DEFAULT_PUBLIC_PROMO_BASE_URL = "https://ahangama.com";

function isLocalHostname(hostname) {
  const normalized = String(hostname || "").toLowerCase();
  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "0.0.0.0" ||
    normalized.endsWith(".local")
  );
}

export function getPublicPromoBaseUrl() {
  const configured = String(process.env.VITE_SITE_URL || "").trim();

  if (configured) {
    try {
      const url = new URL(configured);

      if (!isLocalHostname(url.hostname)) {
        return url.origin.replace(/\/$/, "");
      }
    } catch {
      // Ignore invalid URL input and fall back to the canonical public domain.
    }
  }

  return DEFAULT_PUBLIC_PROMO_BASE_URL;
}

export function buildPromoPassUrl(passId) {
  return `${getPublicPromoBaseUrl()}/card/pass/${encodeURIComponent(passId || "")}`;
}
