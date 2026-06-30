import {
  createGuestContentHistoryRows,
  createGuestEmailHistoryRow,
} from "./hotel-passes-db.js";
import { buildTrackedEmailLink } from "./email-link-tracking.js";
import { createTrackedLink } from "./visitor-tracking.js";

export { createTrackedLink };
export { buildTrackedEmailLink };

export async function recordPreparedGuestEmail({
  guestId,
  passId,
  emailType,
  source,
  dailyIntelligenceId,
  contents = [],
  sentAt,
} = {}) {
  const emailHistory = await createGuestEmailHistoryRow({
    guestId,
    passId,
    emailType,
    dailyIntelligenceId,
    sentAt,
  });

  const contentHistory = await createGuestContentHistoryRows({
    guestId,
    passId,
    source: source || `${emailType}-email`,
    sentAt: emailHistory?.sent_at || sentAt,
    contents,
  });

  return { emailHistory, contentHistory };
}
