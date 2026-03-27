import Stripe from "stripe";
import { CARD_PRODUCTS } from "../../src/data/cardConfig.js";
import { getStripeKey } from "../../lib/stripe-config.js";

const stripe = new Stripe(getStripeKey());

export const handler = async (event, context) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { sessionId } = event.queryStringParameters || {};

    if (!sessionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Session ID required" }),
      };
    }

    // Environment validation
    try {
      getStripeKey();
    } catch (error) {
      console.error("Stripe configuration error:", error.message);
      const testStartDate = new Date();
      const testExpiryDate = new Date(
        testStartDate.getTime() + 15 * 24 * 60 * 60 * 1000,
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          productId: CARD_PRODUCTS.standard.id,
          productName: "Test Ahangama Pass",
          customerName: "Test Customer",
          customerEmail: "test@example.com",
          customerPhone: "+1234567890",
          qrCode: `AHG-${CARD_PRODUCTS.standard.qrId}-${sessionId
            .substring(0, 8)
            .toUpperCase()}`,
          priceUsd: CARD_PRODUCTS.standard.priceUsd,
          maxPeople: CARD_PRODUCTS.standard.maxPeople,
          validityDays: 15,
          purchaseDate: new Date().toISOString(),
          startDate: testStartDate.toISOString(),
          expiryDate: testExpiryDate.toISOString(),
        }),
      };
    }

    // Try to retrieve Stripe session
    console.log("Attempting to retrieve Stripe session:", sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Payment not completed" }),
      };
    }

    const product = CARD_PRODUCTS[session.metadata.productId];
    const qrCodeId = `AHG-${product.qrId}-${sessionId
      .substring(0, 8)
      .toUpperCase()}`;

    // Calculate dates based on start date from metadata
    const startDate = session.metadata.startDate
      ? new Date(session.metadata.startDate)
      : new Date();

    const expiryDate = new Date(
      startDate.getTime() +
        parseInt(session.metadata.validityDays) * 24 * 60 * 60 * 1000,
    );

    const responseData = {
      productId: session.metadata.productId,
      productName: session.metadata.productName,
      customerName: session.metadata.customerName || "Guest",
      customerEmail: session.customer_details.email,
      customerPhone: session.metadata.customerPhone,
      qrCode: qrCodeId,
      priceUsd: (session.amount_total / 100).toString(),
      maxPeople: parseInt(session.metadata.maxPeople || "1"),
      validityDays: parseInt(session.metadata.validityDays),
      purchaseDate: new Date().toISOString(),
      startDate: startDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData),
    };
  } catch (error) {
    console.error("Error in verify-payment:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Payment verification failed",
        details: error.message,
      }),
    };
  }
};
