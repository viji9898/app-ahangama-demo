import { Buffer } from "node:buffer";
import process from "node:process";
import Stripe from "stripe";
import { sendPromoNotifications } from "../../lib/promo-purchase-fulfillment.js";
import { syncPromoPurchaseFromSession } from "../../lib/promo-purchase-sync.js";
import { getStripeKey } from "../../lib/stripe-config.js";

const stripe = new Stripe(getStripeKey());

async function resolveStripeReceiptUrl(session) {
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || null;

  const latestChargeReceiptUrl =
    session.payment_intent?.latest_charge?.receipt_url || null;

  if (latestChargeReceiptUrl) {
    return latestChargeReceiptUrl;
  }

  if (!paymentIntentId) {
    return null;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      {
        expand: ["latest_charge"],
      },
    );

    return paymentIntent.latest_charge?.receipt_url || null;
  } catch (error) {
    console.error("Failed to resolve Stripe receipt URL:", error);
    return null;
  }
}

function getWebhookSecret() {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is required for promo webhooks");
  }

  return process.env.STRIPE_WEBHOOK_SECRET;
}

function getRawBody(event) {
  if (!event.body) {
    return "";
  }

  if (event.isBase64Encoded) {
    return Buffer.from(event.body, "base64").toString("utf8");
  }

  return event.body;
}

async function handleCheckoutSessionCompleted(session, headers) {
  return syncPromoPurchaseFromSession(session, {
    headers,
    resolveStripeReceiptUrl,
  });
}

export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const signature =
    event.headers["stripe-signature"] || event.headers["Stripe-Signature"];

  if (!signature) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Missing Stripe signature" }),
    };
  }

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      getRawBody(event),
      signature,
      getWebhookSecret(),
    );
  } catch (error) {
    console.error("Promo webhook signature verification failed:", error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }

  try {
    switch (stripeEvent.type) {
      case "checkout.session.completed":
        {
          const purchase = await handleCheckoutSessionCompleted(
            stripeEvent.data.object,
            event.headers || {},
          );

          if (purchase.fulfillmentStatus === "payment_confirmed") {
            await sendPromoNotifications(purchase);
          }
        }
        break;
      default:
        console.log(`Ignoring Stripe promo event type ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error("Promo webhook handler error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Unknown error" }),
    };
  }
};
