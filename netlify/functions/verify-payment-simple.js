import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");

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

    // For testing without Stripe key - simplified version
    if (
      !process.env.STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY === "sk_test_dummy"
    ) {
      console.log("Using test mode for sessionId:", sessionId);

      const qrCodeId = `AHANGAMA-TEST-${sessionId
        .substring(0, 8)
        .toUpperCase()}`;
      const qrCode = `${
        process.env.URL || "http://localhost:8888"
      }/card/verify?qr=${encodeURIComponent(qrCodeId)}`;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          productName: "Test Ahangama Pass",
          customerEmail: "test@example.com",
          customerPhone: "+1234567890",
          qrCode,
          validityDays: 30,
          purchaseDate: new Date().toISOString(),
          expiryDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
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

    // Generate QR code as a scannable URL
    const qrCodeId = `AHANGAMA-${session.metadata.productId.toUpperCase()}-${sessionId
      .substring(0, 8)
      .toUpperCase()}`;
    const qrCode = `${
      process.env.URL || "http://localhost:8888"
    }/card/verify?qr=${encodeURIComponent(qrCodeId)}`;

    const responseData = {
      productName: session.metadata.productName,
      customerEmail: session.customer_details.email,
      customerPhone: session.metadata.customerPhone,
      qrCode,
      validityDays: parseInt(session.metadata.validityDays),
      purchaseDate: new Date().toISOString(),
      expiryDate: new Date(
        Date.now() +
          parseInt(session.metadata.validityDays) * 24 * 60 * 60 * 1000
      ).toISOString(),
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
