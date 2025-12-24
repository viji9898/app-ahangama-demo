// Stripe integration service for Ahangama Pass payments

export const STRIPE_PRICE_IDS = {
  standard: "price_ahangama_standard", // Replace with actual Stripe Price IDs
  duo: "price_ahangama_duo",
  longStay: "price_ahangama_longstay",
  explorer: "price_ahangama_explorer",
  week: "price_ahangama_week",
};

export const createCheckoutSession = async (productId, customerData) => {
  const response = await fetch("/.netlify/functions/create-checkout-session", {
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
      successUrl: `${window.location.origin}/card/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/card`,
    }),
  });

  const session = await response.json();

  if (session.error) {
    throw new Error(session.error);
  }

  // Redirect to Stripe Checkout
  window.location.href = session.url;
};

export const verifyPayment = async (sessionId) => {
  const response = await fetch(
    `/.netlify/functions/verify-payment?sessionId=${sessionId}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Payment verification failed:", errorText);
    throw new Error(`Payment verification failed: ${response.status}`);
  }

  return response.json();
};
