// Backend API handlers for Stripe integration with Netlify DB
import Stripe from "stripe";
import { CARD_PRODUCTS } from "../data/cardConfig";
import DatabaseService from "../lib/database.js";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const {
      priceId,
      productId,
      customerName,
      customerEmail,
      customerPhone,
      successUrl,
      cancelUrl,
    } = req.body;

    const product = CARD_PRODUCTS[productId];
    if (!product) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
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
      // Collect additional customer info
      phone_number_collection: {
        enabled: true,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    // Store purchase in Netlify DB
    const purchase = await DatabaseService.createPurchase(session);

    // Send QR code via WhatsApp and Email
    await sendQRCodeDelivery({
      qrCode: purchase.qrCode,
      customerName: purchase.customerName,
      customerEmail: purchase.customerEmail,
      customerPhone: purchase.customerPhone,
      productName: purchase.productName,
    });

    res.json({
      productName: purchase.productName,
      customerEmail: purchase.customerEmail,
      customerPhone: purchase.customerPhone,
      qrCode: purchase.qrCode,
      validityDays: purchase.validityDays,
      purchaseDate: purchase.purchaseDate,
      expiryDate: purchase.expiryDate,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to generate unique QR codes
const generateQRCode = (sessionId, metadata) => {
  // Generate a unique code for the pass
  const timestamp = Date.now();
  const hash = require("crypto")
    .createHash("md5")
    .update(`${sessionId}-${metadata.productId}-${timestamp}`)
    .digest("hex")
    .substring(0, 8)
    .toUpperCase();

  return `AHANGAMA-${metadata.productId.toUpperCase()}-${hash}`;
};

// Helper function to store purchase record
const storePurchaseRecord = async (purchaseData) => {
  // Implement your database storage logic here
  // This could be MongoDB, PostgreSQL, Firebase, etc.
  console.log("Storing purchase record:", purchaseData);
  return purchaseData;
};

// Helper function to send QR code via WhatsApp and Email
const sendQRCodeDelivery = async ({
  qrCode,
  customerName,
  customerEmail,
  customerPhone,
  productName,
}) => {
  try {
    // Send WhatsApp message (using WhatsApp Business API or service like Twilio)
    await sendWhatsAppMessage({
      to: customerPhone,
      message: `🎉 Welcome to Ahangama, ${customerName}!

Your ${productName} is ready to use.

QR Code: ${qrCode}

Show this QR code at any participating venue to unlock your benefits.

Save this message for easy access to your pass! ✨`,
    });

    // Send Email (using service like SendGrid, Mailgun, or Nodemailer)
    await sendEmail({
      to: customerEmail,
      subject: `Your ${productName} is Ready!`,
      html: `
        <h2>Welcome to Ahangama, ${customerName}!</h2>
        <p>Your <strong>${productName}</strong> is ready to use.</p>
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; text-align: center;">
          <h3>Your QR Code</h3>
          <p style="font-family: monospace; font-size: 18px; background: white; padding: 10px; border-radius: 4px;">${qrCode}</p>
        </div>
        <p>Show this QR code at any participating venue to unlock your benefits.</p>
        <p>Have a wonderful time exploring Ahangama! ✨</p>
      `,
    });

    console.log("QR code sent successfully via WhatsApp and Email");
  } catch (error) {
    console.error("Error sending QR code:", error);
    // Don't throw error - payment was successful, delivery failure shouldn't break the flow
  }
};

// Placeholder functions for message sending (implement with your preferred services)
const sendWhatsAppMessage = async ({ to, message }) => {
  // Implement WhatsApp API call
  console.log(`Sending WhatsApp to ${to}:`, message);
};

const sendEmail = async ({ to, subject, html }) => {
  // Implement email sending
  console.log(`Sending email to ${to}:`, subject);
};
