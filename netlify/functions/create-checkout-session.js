import Stripe from "stripe";
import { CARD_PRODUCTS } from "../../src/data/cardConfig.js";
import { getPrPromoCheckoutContext } from "../../src/data/prPromotions.js";
import { calculatePromoReceipt } from "../../src/lib/promoReceipt.js";
import { getStripeKey } from "../../lib/stripe-config.js";

const stripe = new Stripe(getStripeKey());

function normalizeStripeSuccessUrl(value) {
  const url = String(value || "");

  return url
    .replaceAll("%7BCHECKOUT_SESSION_ID%7D", "{CHECKOUT_SESSION_ID}")
    .replaceAll("%7bCHECKOUT_SESSION_ID%7d", "{CHECKOUT_SESSION_ID}");
}

function formatBundleItemLabel(item) {
  const quantity = Number(item?.quantity) || 0;
  const label = String(item?.label || "").trim();

  if (!label) {
    return "";
  }

  if (quantity > 1) {
    return `${quantity}x ${label}`;
  }

  return label;
}

function buildPromoBundleDescription(promoContext, product) {
  const bundleItems = (promoContext?.promotion?.receipt?.items || [])
    .map((item) => formatBundleItemLabel(item))
    .filter(Boolean);

  if (bundleItems.length === 0) {
    return product.description;
  }

  return bundleItems.join(" + ");
}

function getStripeProductName(product, promoContext) {
  return promoContext ? "Value Bundle" : product.name;
}

function getValidityDays(product, promoContext) {
  return promoContext ? 30 : product.validityDays;
}

// Stripe Price IDs - update these with your actual Stripe Price IDs
const STRIPE_PRICE_IDS = {
  standard: "price_ahangama_standard",
  duo: "price_ahangama_duo",
  longStay: "price_ahangama_longstay",
  explorer: "price_ahangama_explorer",
  week: "price_ahangama_week", // Now 15-day pass (P15)
};

export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const {
      productId,
      customerName,
      customerEmail,
      customerPhone,
      startDate,
      flowType,
      promoCode,
      venueSlug,
      ctaLocation,
      attribution = {},
      successUrl,
      cancelUrl,
    } = JSON.parse(event.body);

    const product = CARD_PRODUCTS[productId];
    if (!product) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid product ID" }),
      };
    }

    const promoContext =
      flowType === "promo"
        ? getPrPromoCheckoutContext(venueSlug, promoCode)
        : null;

    if (flowType === "promo" && !promoContext) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid promo checkout context" }),
      };
    }

    const promoSummary = promoContext
      ? calculatePromoReceipt(
          promoContext.promotion?.receipt?.items,
          promoContext.promoPrice,
        )
      : null;
    const retailPriceUsd = promoSummary?.totalRetailValue || product.priceUsd;
    const finalPriceUsd = promoContext?.promoPrice || product.priceUsd;
    const discountAmountUsd = Math.max(retailPriceUsd - finalPriceUsd, 0);
    const productName = getStripeProductName(product, promoContext);
    const validityDays = getValidityDays(product, promoContext);
    const productDescription = promoContext
      ? buildPromoBundleDescription(promoContext, product)
      : product.description;

    const coupon =
      promoContext && discountAmountUsd > 0
        ? await stripe.coupons.create({
            amount_off: Math.round(discountAmountUsd * 100),
            currency: "usd",
            duration: "once",
            name: promoContext.promoCode,
            metadata: {
              flowType: "promo",
              venueSlug: promoContext.slug,
              promoCode: promoContext.promoCode,
            },
          })
        : null;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: Math.round(retailPriceUsd * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      ...(coupon ? { discounts: [{ coupon: coupon.id }] } : {}),
      metadata: {
        productId,
        customerName,
        customerPhone,
        flowType: flowType || "standard",
        ctaLocation: ctaLocation || "",
        venueSlug: promoContext?.slug || "",
        promoCode: promoContext?.promoCode || "",
        utmSource: attribution.utm_source || "",
        utmMedium: attribution.utm_medium || "",
        utmCampaign: attribution.utm_campaign || "",
        utmContent: attribution.utm_content || "",
        utmTerm: attribution.utm_term || "",
        productName,
        productDescription,
        listPriceUsd: retailPriceUsd.toString(),
        chargedPriceUsd: finalPriceUsd.toString(),
        discountUsd: discountAmountUsd.toString(),
        validityDays: validityDays.toString(),
        maxPeople: product.maxPeople.toString(),
        startDate: startDate || new Date().toISOString().split("T")[0], // Default to today if not provided
      },
      success_url: normalizeStripeSuccessUrl(successUrl),
      cancel_url: cancelUrl,
      ...(!coupon ? { allow_promotion_codes: true } : {}),
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
