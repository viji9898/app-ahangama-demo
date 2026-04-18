// src/analytics.js
export const trackPageView = (url) => {
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

  window.gtag("event", "pass_cta_click", {
    event_category: "engagement",
    event_label: ctaLocation || "unknown",
    source_domain: window.location.hostname,
    cta_location: ctaLocation || "unknown",
    page_path: window.location.pathname,
    ...(productId ? { product_id: productId } : {}),
    ...(destinationUrl ? { destination_url: destinationUrl } : {}),
  });
};
