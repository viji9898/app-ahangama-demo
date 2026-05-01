import {
  getPassAttribution,
  persistPassAttribution,
} from "./lib/passAttribution";

// src/analytics.js
export const trackPageView = (url) => {
  persistPassAttribution();

  if (window.gtag) {
    window.gtag("event", "page_view", {
      page_path: url,
    });
  }
};

export const trackPassCtaClick = ({
  ctaLocation,
  productId,
  destinationUrl,
} = {}) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  const attribution = getPassAttribution();

  window.gtag("event", "pass_cta_click", {
    event_category: "engagement",
    event_label: ctaLocation || "unknown",
    source_domain: window.location.hostname,
    cta_location: ctaLocation || "unknown",
    page_path: window.location.pathname,
    ...(productId ? { product_id: productId } : {}),
    ...(destinationUrl ? { destination_url: destinationUrl } : {}),
    ...(attribution.utm_source ? { utm_source: attribution.utm_source } : {}),
    ...(attribution.utm_medium ? { utm_medium: attribution.utm_medium } : {}),
    ...(attribution.utm_campaign
      ? { utm_campaign: attribution.utm_campaign }
      : {}),
    ...(attribution.utm_content
      ? { utm_content: attribution.utm_content }
      : {}),
    ...(attribution.utm_term ? { utm_term: attribution.utm_term } : {}),
  });
};

export const trackQrEvent = (eventName, params = {}) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
};
