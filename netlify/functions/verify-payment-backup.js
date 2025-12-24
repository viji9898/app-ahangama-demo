import Stripe from "stripe";
import { neon } from "@netlify/neon";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");
const databaseUrl =
  process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;

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

    // For testing without Stripe key
    if (
      !process.env.STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY === "sk_test_dummy"
    ) {
      const qrCodeId = `AHANGAMA-TEST-${sessionId
        .substring(0, 8)
        .toUpperCase()}`;
      const qrCode = `${
        process.env.URL || "http://localhost:8888"
      }/card/verify?qr=${encodeURIComponent(qrCodeId)}`;

      // Save test data to database
      if (sql) {
        try {
          const testData = {
            sessionId: sessionId,
            qrCode: qrCodeId,
            productId: "standard",
            productName: "Test Ahangama Pass",
            priceUsd: "35.00",
            validityDays: 30,
            maxPeople: 1,
            customerName: "Test Customer",
            customerEmail: "test@example.com",
            customerPhone: "+1234567890",
            stripePaymentIntentId: `pi_test_${sessionId}`,
            currency: "usd",
            purchaseDate: new Date(),
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await sql`
            INSERT INTO purchases (
              session_id, qr_code, product_id, product_name, price_usd,
              validity_days, max_people, customer_name, customer_email, customer_phone,
              stripe_payment_intent_id, currency, purchase_date, expiry_date,
              is_active, created_at, updated_at
            ) VALUES (
              ${testData.sessionId}, ${testData.qrCode}, ${testData.productId},
              ${testData.productName}, ${testData.priceUsd}, ${testData.validityDays},
              ${testData.maxPeople}, ${testData.customerName}, ${testData.customerEmail},
              ${testData.customerPhone}, ${testData.stripePaymentIntentId}, ${testData.currency},
              ${testData.purchaseDate}, ${testData.expiryDate}, ${testData.isActive},
              ${testData.createdAt}, ${testData.updatedAt}
            )
            ON CONFLICT (session_id) DO UPDATE SET
              updated_at = ${testData.updatedAt}
          `;

          console.log(`✅ Test purchase saved: ${testData.qrCode}`);
        } catch (dbError) {
          console.error("❌ Test database error:", dbError);
        }
      }

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

    // Save to database
    if (sql) {
      try {
        const purchaseData = {
          sessionId: session.id,
          qrCode: qrCodeId, // Store the actual QR code, not the URL
          productId: session.metadata.productId,
          productName: session.metadata.productName,
          priceUsd: (session.amount_total / 100).toString(),
          validityDays: parseInt(session.metadata.validityDays),
          maxPeople: parseInt(session.metadata.maxPeople || "1"),
          customerName: session.metadata.customerName || "Unknown",
          customerEmail: session.customer_details.email,
          customerPhone: session.metadata.customerPhone || "",
          stripePaymentIntentId: session.payment_intent,
          currency: session.currency,
          purchaseDate: new Date(),
          expiryDate: new Date(
            Date.now() +
              parseInt(session.metadata.validityDays) * 24 * 60 * 60 * 1000
          ),
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await sql`
          INSERT INTO purchases (
            session_id, qr_code, product_id, product_name, price_usd,
            validity_days, max_people, customer_name, customer_email, customer_phone,
            stripe_payment_intent_id, currency, purchase_date, expiry_date,
            is_active, created_at, updated_at
          ) VALUES (
            ${purchaseData.sessionId}, ${purchaseData.qrCode}, ${purchaseData.productId},
            ${purchaseData.productName}, ${purchaseData.priceUsd}, ${purchaseData.validityDays},
            ${purchaseData.maxPeople}, ${purchaseData.customerName}, ${purchaseData.customerEmail},
            ${purchaseData.customerPhone}, ${purchaseData.stripePaymentIntentId}, ${purchaseData.currency},
            ${purchaseData.purchaseDate}, ${purchaseData.expiryDate}, ${purchaseData.isActive},
            ${purchaseData.createdAt}, ${purchaseData.updatedAt}
          )
          ON CONFLICT (session_id) DO UPDATE SET
            updated_at = ${purchaseData.updatedAt}
        `;

        console.log(`✅ Purchase saved to database: ${purchaseData.qrCode}`);
      } catch (dbError) {
        console.error("❌ Database error:", dbError);
        // Continue without failing the payment verification
      }
    }

    const responseData = {
      productName: session.metadata.productName,
      customerEmail: session.customer_details.email,
      customerPhone: session.metadata.customerPhone,
      qrCode, // Return the URL for display
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
    console.error("Error verifying payment:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
