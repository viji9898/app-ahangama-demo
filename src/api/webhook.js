// Stripe webhook handler
// This ensures payment processing is handled securely via webhooks

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log("Payment successful for session:", session.id);

      // Process the successful payment
      await processSuccessfulPayment(session);
      break;

    case "payment_intent.payment_failed":
      const paymentIntent = event.data.object;
      console.log("Payment failed:", paymentIntent.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

const processSuccessfulPayment = async (session) => {
  try {
    // This is where you'd implement the same logic as in verifyPayment
    // but triggered automatically by webhook for better reliability

    const qrCode = generateQRCode(session.id, session.metadata);

    await storePurchaseRecord({
      sessionId: session.id,
      productId: session.metadata.productId,
      productName: session.metadata.productName,
      customerName: session.metadata.customerName,
      customerEmail: session.customer_details.email,
      customerPhone: session.metadata.customerPhone,
      amount: session.amount_total / 100,
      currency: session.currency,
      qrCode,
      purchaseDate: new Date(),
    });

    await sendQRCodeDelivery({
      qrCode,
      customerName: session.metadata.customerName,
      customerEmail: session.customer_details.email,
      customerPhone: session.metadata.customerPhone,
      productName: session.metadata.productName,
    });

    console.log("Successfully processed payment and sent QR code");
  } catch (error) {
    console.error("Error processing successful payment:", error);
  }
};
