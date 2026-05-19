import {
  getPassAttribution,
  getPassAttributionFromSearch,
} from "../lib/passAttribution";

// Stripe integration service for Ahangama Pass payments

export const STRIPE_PRICE_IDS = {
  standard: "price_ahangama_standard", // Replace with actual Stripe Price IDs
  duo: "price_ahangama_duo",
  longStay: "price_ahangama_longstay",
  explorer: "price_ahangama_explorer",
  week: "price_ahangama_week", // Now 15-day pass (P15)
};

export const createCheckoutSession = async (
  productId,
  customerData,
  checkoutContext = {},
) => {
  try {
    const {
      promoContext = null,
      ctaLocation = null,
      attribution: attributionOverride = null,
      cancelUrl: cancelUrlOverride = null,
    } = checkoutContext;
    const currentUrl = new URL(window.location.href);
    const attribution = attributionOverride || {
      ...getPassAttribution(),
      ...getPassAttributionFromSearch(currentUrl.search),
    };
    const successUrl = new URL("/card/success", window.location.origin);
    const cancelUrl = cancelUrlOverride
      ? new URL(cancelUrlOverride, window.location.origin)
      : new URL("/card", window.location.origin);

    currentUrl.searchParams.forEach((value, key) => {
      successUrl.searchParams.set(key, value);
      cancelUrl.searchParams.set(key, value);
    });

    successUrl.searchParams.set("session_id", "__CHECKOUT_SESSION_ID__");
    const successUrlString = successUrl
      .toString()
      .replace("__CHECKOUT_SESSION_ID__", "{CHECKOUT_SESSION_ID}");

    const response = await fetch(
      "/.netlify/functions/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: STRIPE_PRICE_IDS[productId],
          productId,
          customerName: customerData.name,
          customerEmail: customerData.email,
          customerPhone: customerData.phone,
          startDate: customerData.startDate,
          flowType: promoContext ? "promo" : "standard",
          promoCode: promoContext?.promoCode,
          venueSlug: promoContext?.slug,
          ctaLocation,
          successUrl: successUrlString,
          cancelUrl: cancelUrl.toString(),
          attribution,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Checkout session creation failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: response.url,
      });
      throw new Error(
        `Checkout session failed: ${response.status} - ${errorText}`,
      );
    }

    const session = await response.json();

    if (session.error) {
      throw new Error(session.error);
    }

    // Redirect to Stripe Checkout
    window.location.href = session.url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};

export const verifyPayment = async (sessionId) => {
  const response = await fetch(
    `/.netlify/functions/verify-payment?sessionId=${sessionId}`,
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Payment verification failed:", errorText);
    throw new Error(`Payment verification failed: ${response.status}`);
  }

  return response.json();
};

export const getPromoPurchaseBySession = async (sessionId) => {
  const response = await fetch(
    `/.netlify/functions/promo-purchase-by-session?session_id=${encodeURIComponent(sessionId)}`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Promo purchase lookup failed:", errorText);
    throw new Error(`Promo purchase lookup failed: ${response.status}`);
  }

  return response.json();
};

export const getPromoPassById = async (passId) => {
  const response = await fetch(
    `/.netlify/functions/promo-pass-by-id?pass_id=${encodeURIComponent(passId)}`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Promo pass lookup failed:", errorText);
    throw new Error(`Promo pass lookup failed: ${response.status}`);
  }

  return response.json();
};

export const redeemPromoPass = async ({
  passId,
  venueSlug,
  venueName,
  redemptionType,
  offerUsed,
  vendorPin,
}) => {
  const response = await fetch(`/.netlify/functions/promo-redeem-pass`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      passId,
      venueSlug,
      venueName,
      redemptionType,
      offerUsed,
      vendorPin,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || `Promo redemption failed: ${response.status}`);
  }

  return payload;
};
