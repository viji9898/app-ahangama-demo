import {
  getPromoPurchaseBySessionId,
  updatePromoPurchaseDeliveryStatus,
} from "./promo-purchases-db.js";
import {
  sendPromoCustomerEmail,
  sendPromoTeamEmail,
} from "./promo-purchase-emails.js";
import { getVenueBySlug } from "./venues-db.js";

export async function sendPromoNotifications(purchase) {
  const existingPurchase =
    (await getPromoPurchaseBySessionId(purchase.stripeSessionId)) || purchase;
  const venue = existingPurchase.venueSlug
    ? await getVenueBySlug(existingPurchase.venueSlug)
    : null;
  const nextStatuses = {};
  const sentAt = new Date().toISOString();
  let hasFailure = false;

  if (existingPurchase.customerEmailStatus !== "sent") {
    try {
      await sendPromoCustomerEmail(existingPurchase);
      nextStatuses.customerEmailStatus = "sent";
      nextStatuses.customerEmailSentAt = sentAt;
    } catch (error) {
      console.error("Failed to send promo customer email:", error);
      nextStatuses.customerEmailStatus = "failed";
      hasFailure = true;
    }
  }

  if (existingPurchase.teamEmailStatus !== "sent") {
    try {
      await sendPromoTeamEmail(existingPurchase, venue);
      nextStatuses.teamEmailStatus = "sent";
      nextStatuses.teamEmailSentAt = sentAt;
    } catch (error) {
      console.error("Failed to send promo team email:", error);
      nextStatuses.teamEmailStatus = "failed";
      hasFailure = true;
    }
  }

  if (existingPurchase.venueEmailStatus !== "skipped") {
    nextStatuses.venueEmailStatus = "skipped";
  }

  if (Object.keys(nextStatuses).length) {
    const nextFulfillmentStatus = hasFailure ? "email_failed" : "emails_sent";

    return updatePromoPurchaseDeliveryStatus(existingPurchase.stripeSessionId, {
      ...nextStatuses,
      fulfillmentStatus: nextFulfillmentStatus,
    });
  }

  return existingPurchase;
}
