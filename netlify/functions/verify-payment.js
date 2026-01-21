import Stripe from "stripe";
import { neon } from "@netlify/neon";
import crypto from "crypto";
import { CARD_PRODUCTS } from "../../src/data/cardConfig.js";
import { getStripeKey, getEnvironmentName } from "../../lib/stripe-config.js";

const ALPH = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford Base32

function base32(buf) {
  let bits = 0,
    value = 0,
    out = "";
  for (const b of buf) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += ALPH[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALPH[(value << (5 - bits)) & 31];
  return out;
}

const stripe = new Stripe(getStripeKey());

// Only initialize database connection if we have a valid URL
let sql = null;
const databaseUrl =
  process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

if (
  databaseUrl &&
  databaseUrl !== "[auto-provided by Netlify DB]" &&
  databaseUrl.startsWith("postgresql://")
) {
  try {
    sql = neon(databaseUrl);
    console.log("✅ Database connection initialized");
  } catch (error) {
    console.warn("⚠️ Database connection failed:", error.message);
    sql = null;
  }
} else {
  console.warn("⚠️ Database URL not available or invalid:", databaseUrl);
}

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
      getStripeKey(); // This will throw if keys are missing
    } catch (error) {
      console.error("Stripe configuration error:", error.message);
      console.log("Using test mode for sessionId:", sessionId);

      const token = base32(
        crypto
          .createHmac("sha256", process.env.QR_SECRET || "test-secret")
          .update(sessionId)
          .digest()
      ).slice(0, 6);

      const qrCodeId = `AHG-${CARD_PRODUCTS.standard.qrId}-${token}`;
      const qrCode = `https://ahangama.com/card/verify?qr=${encodeURIComponent(
        qrCodeId
      )}`;

      // Save test purchase to database
      if (sql) {
        try {
          // Default start date for test mode (today)
          const testStartDate = new Date();
          const testExpiryDate = new Date(
            testStartDate.getTime() + 30 * 24 * 60 * 60 * 1000
          );

          await sql`
            INSERT INTO purchases (
              session_id, qr_code, product_id, product_name, price_usd,
              validity_days, max_people, customer_name, customer_email, customer_phone,
              stripe_payment_intent_id, currency, purchase_date, start_date, expiry_date,
              is_active, created_at, updated_at
            ) VALUES (
              ${sessionId}, ${qrCodeId}, ${"standard"},
              ${"Test Ahangama Pass"}, ${"35.00"}, ${30},
              ${1}, ${"Test Customer"}, ${"test@example.com"},
              ${"+1234567890"}, ${`pi_test_${sessionId}`}, ${"usd"},
              ${new Date()}, ${testStartDate}, ${testExpiryDate}, ${true},
              ${new Date()}, ${new Date()}
            )
            ON CONFLICT (session_id) DO UPDATE SET
              updated_at = ${new Date()}
          `;

          console.log(`✅ Test purchase saved to database: ${qrCodeId}`);
        } catch (dbError) {
          console.error("❌ Test database error:", dbError);
        }
      } else {
        console.warn("⚠️ Database not available - purchase not saved");
      }

      // Default start date for test mode (today)
      const testStartDate = new Date();
      const testExpiryDate = new Date(
        testStartDate.getTime() + 30 * 24 * 60 * 60 * 1000
      );

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

    // Generate QR code as a scannable URL
    const product = CARD_PRODUCTS[session.metadata.productId];
    const token = base32(
      crypto
        .createHmac("sha256", process.env.QR_SECRET || "test-secret")
        .update(sessionId)
        .digest()
    ).slice(0, 6);

    const qrCodeId = `AHG-${product.qrId}-${token}`;
    const qrCode = `https://ahangama.com/card/verify?qr=${encodeURIComponent(
      qrCodeId
    )}`;

    // Calculate dates based on start date from metadata
    const startDate = session.metadata.startDate
      ? new Date(session.metadata.startDate)
      : new Date();

    const expiryDate = new Date(
      startDate.getTime() +
        parseInt(session.metadata.validityDays) * 24 * 60 * 60 * 1000
    );

    // Save real purchase to database
    if (sql) {
      try {
        await sql`
          INSERT INTO purchases (
            session_id, qr_code, product_id, product_name, price_usd,
            validity_days, max_people, customer_name, customer_email, customer_phone,
            stripe_payment_intent_id, currency, purchase_date, start_date, expiry_date,
            is_active, created_at, updated_at
          ) VALUES (
            ${session.id}, ${qrCodeId}, ${session.metadata.productId},
            ${session.metadata.productName}, ${(
          session.amount_total / 100
        ).toString()}, ${parseInt(session.metadata.validityDays)},
            ${parseInt(session.metadata.maxPeople || "1")}, ${
          session.metadata.customerName || "Unknown"
        }, ${session.customer_details.email},
            ${session.metadata.customerPhone || ""}, ${
          session.payment_intent
        }, ${session.currency},
            ${new Date()}, ${startDate}, ${expiryDate}, ${true},
            ${new Date()}, ${new Date()}
          )
          ON CONFLICT (session_id) DO UPDATE SET
            updated_at = ${new Date()}
        `;

        console.log(`✅ Real purchase saved to database: ${qrCodeId}`);
      } catch (dbError) {
        console.error("❌ Real database error:", dbError);
      }
    } else {
      console.warn("⚠️ Database not available - purchase not saved");
    }

    const responseData = {
      productName: session.metadata.productName,
      customerEmail: session.customer_details.email,
      customerPhone: session.metadata.customerPhone,
      qrCode,
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
