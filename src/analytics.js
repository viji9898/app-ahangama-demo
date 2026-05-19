import {
  getPassAttribution,
  getPassAttributionFromSearch,
  persistPassAttribution,
} from "./lib/passAttribution";

const getAnalyticsAttribution = () => {
  const storedAttribution = getPassAttribution();
  const searchAttribution =
    typeof window === "undefined"
      ? {}
      : getPassAttributionFromSearch(window.location.search);

  return {
    ...storedAttribution,
    ...searchAttribution,
  };
};

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

  const attribution = getAnalyticsAttribution();

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

export const trackPassPurchase = ({ sessionId, paymentData }) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  const clientAttribution = getAnalyticsAttribution();
  const paymentAttribution = {
    utm_source: paymentData?.utmSource || "",
    utm_medium: paymentData?.utmMedium || "",
    utm_campaign: paymentData?.utmCampaign || "",
    utm_content: paymentData?.utmContent || "",
    utm_term: paymentData?.utmTerm || "",
  };
  const attribution = {
    ...clientAttribution,
    ...Object.fromEntries(
      Object.entries(paymentAttribution).filter(([, value]) => Boolean(value)),
    ),
  };
  const value = Number(paymentData?.chargedPriceUsd || paymentData?.priceUsd || 0);

  window.gtag("event", "purchase", {
    transaction_id: sessionId,
    value,
    currency: "USD",
    event_category: "ecommerce",
    event_label: paymentData?.productName || "ahangama_pass",
    source_domain: window.location.hostname,
    page_path: window.location.pathname,
    flow_type: paymentData?.flowType || "standard",
    cta_location: paymentData?.ctaLocation || "unknown",
    venue_slug: paymentData?.venueSlug || "",
    ...(paymentData?.promoCode ? { coupon: paymentData.promoCode } : {}),
    ...(attribution.utm_source ? { utm_source: attribution.utm_source } : {}),
    ...(attribution.utm_medium ? { utm_medium: attribution.utm_medium } : {}),
    ...(attribution.utm_campaign
      ? { utm_campaign: attribution.utm_campaign }
      : {}),
    ...(attribution.utm_content
      ? { utm_content: attribution.utm_content }
      : {}),
    ...(attribution.utm_term ? { utm_term: attribution.utm_term } : {}),
    items: [
      {
        item_id: paymentData?.productId || "unknown",
        item_name: paymentData?.productName || "Ahangama Pass",
        price: value,
        quantity: 1,
        ...(paymentData?.promoCode ? { coupon: paymentData.promoCode } : {}),
      },
    ],
  });
};
