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

const GOOGLE_ADS_CONVERSION_CONFIG = {
  send_to: "AW-18209868538/xq0RCLWB6tgcEPqVkutD",
  value: 1.0,
  currency: "GBP",
};

const GOOGLE_ADS_PAGE_VIEW_CONVERSION_CONFIG = {
  send_to: "AW-18209868538/bwCLCKmm_OscEPqVkutD",
};

const isPassConversionUrl = (destinationUrl) => {
  if (typeof window === "undefined" || !destinationUrl) {
    return false;
  }

  try {
    const url = new URL(destinationUrl, window.location.origin);

    return url.hostname === "pass.ahangama.com";
  } catch {
    return false;
  }
};

export const reportPassAdsConversion = ({
  destinationUrl,
  navigate = false,
} = {}) => {
  if (typeof window === "undefined" || !isPassConversionUrl(destinationUrl)) {
    return false;
  }

  if (typeof window.gtag_report_conversion === "function") {
    window.gtag_report_conversion(navigate ? destinationUrl : undefined);
    return true;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", GOOGLE_ADS_CONVERSION_CONFIG);

    if (navigate) {
      window.location.assign(destinationUrl);
    }

    return true;
  }

  if (navigate) {
    window.location.assign(destinationUrl);
  }

  return false;
};

// src/analytics.js
export const trackPageView = (url) => {
  persistPassAttribution();

  if (window.gtag) {
    window.gtag("event", "page_view", {
      page_path: url,
    });
    window.gtag(
      "event",
      "conversion",
      GOOGLE_ADS_PAGE_VIEW_CONVERSION_CONFIG,
    );
  }
};

export const trackPassCtaClick = ({
  ctaLocation,
  productId,
  destinationUrl,
} = {}) => {
  reportPassAdsConversion({ destinationUrl });

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

export const trackGuideEvent = (eventName, params = {}) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return false;
  }

  window.gtag("event", eventName, {
    event_category: "guide_engagement",
    source_domain: window.location.hostname,
    page_path: window.location.pathname,
    ...params,
  });

  return true;
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
  const value = Number(
    paymentData?.chargedPriceUsd || paymentData?.priceUsd || 0,
  );
  const qrVenue =
    paymentData?.qrVenue || paymentData?.venueSlug || attribution.utm_content || "";
  const qrLandingPage =
    paymentData?.qrLandingPage || (qrVenue ? `/qr/${qrVenue}` : "");
  const promoType = paymentData?.promoType || paymentData?.promoCode || "";

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
    ...(qrVenue ? { qr_venue: qrVenue } : {}),
    ...(qrLandingPage ? { qr_landing_page: qrLandingPage } : {}),
    ...(promoType ? { promo_type: promoType } : {}),
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
