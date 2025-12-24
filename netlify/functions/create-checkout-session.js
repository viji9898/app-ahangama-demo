import Stripe from "stripe";
import { CARD_PRODUCTS } from "../../src/data/cardConfig.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");

// Stripe Price IDs - update these with your actual Stripe Price IDs
const STRIPE_PRICE_IDS = {
  standard: "price_ahangama_standard",
  duo: "price_ahangama_duo",
  longStay: "price_ahangama_longstay",
  explorer: "price_ahangama_explorer",
  week: "price_ahangama_week",
};

export const handler = async (event, context) => {
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
      priceId,
      productId,
      customerName,
      customerEmail,
      customerPhone,
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceUsd * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: customerEmail,
      metadata: {
        productId,
        customerName,
        customerPhone,
        productName: product.name,
        validityDays: product.validityDays.toString(),
        maxPeople: product.maxPeople.toString(),
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
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
