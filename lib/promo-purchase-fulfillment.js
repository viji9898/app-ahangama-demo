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
  let existingPurchase =
    (await getPromoPurchaseBySessionId(purchase.stripeSessionId)) || purchase;
  const venue = existingPurchase.venueSlug
    ? await getVenueBySlug(existingPurchase.venueSlug)
    : null;
  const sentAt = new Date().toISOString();
  let hasFailure = false;

  const persistStatuses = async (updates = {}) => {
    existingPurchase = await updatePromoPurchaseDeliveryStatus(
      existingPurchase.stripeSessionId,
      updates,
    );

    return existingPurchase;
  };

  if (existingPurchase.customerEmailStatus !== "sent") {
    try {
      await sendPromoCustomerEmail(existingPurchase);
      await persistStatuses({
        customerEmailStatus: "sent",
        customerEmailSentAt: sentAt,
      });
    } catch (error) {
      console.error("Failed to send promo customer email:", error);
      hasFailure = true;
      await persistStatuses({
        customerEmailStatus: "failed",
      });
    }
  }

  if (existingPurchase.teamEmailStatus !== "sent") {
    try {
      await sendPromoTeamEmail(existingPurchase, venue);
      await persistStatuses({
        teamEmailStatus: "sent",
        teamEmailSentAt: sentAt,
      });
    } catch (error) {
      console.error("Failed to send promo team email:", error);
      hasFailure = true;
      await persistStatuses({
        teamEmailStatus: "failed",
      });
    }
  }

  if (existingPurchase.venueEmailStatus !== "skipped") {
    await persistStatuses({
      venueEmailStatus: "skipped",
    });
  }

  const nextFulfillmentStatus = hasFailure ? "email_failed" : "emails_sent";

  if (existingPurchase.fulfillmentStatus !== nextFulfillmentStatus) {
    return persistStatuses({
      fulfillmentStatus: nextFulfillmentStatus,
    });
  }

  return existingPurchase;
}
