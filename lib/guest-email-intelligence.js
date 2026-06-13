import {
  createGuestContentHistoryRows,
  createGuestEmailHistoryRow,
} from "./hotel-passes-db.js";
import { createTrackedLink } from "./visitor-tracking.js";

export { createTrackedLink };

export async function recordPreparedGuestEmail({
  guestId,
  passId,
  emailType,
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
    source: emailType,
    sentAt: emailHistory?.sent_at || sentAt,
    contents,
  });

  return { emailHistory, contentHistory };
}