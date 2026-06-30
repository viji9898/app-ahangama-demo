import {
  generateGuestWelcomeEmail,
  sendGuestWelcomeEmail,
} from "../../lib/guest-welcome-email.js";
import {
  generateGuestPassVenueNotificationEmail,
  sendGuestPassVenueNotificationEmail,
} from "../../lib/guest-pass-venue-email.js";

const TEST_EMAIL_RECIPIENT = "viji@viji.com";

function jsonHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

function buildPreviewPayload() {
  const validFrom = new Date();
  const validUntil = new Date(validFrom);
  validUntil.setUTCDate(validUntil.getUTCDate() + 15);

  return {
    guest: {
      id: "email-preview-guest",
      fullName: "Viji Preview",
      email: TEST_EMAIL_RECIPIENT,
      phone: "+94770000000",
      sourceHotelSlug: "lighthouse-hotel",
      destination: "ahangama",
    },
    pass: {
      id: "email-preview-pass",
      guestId: "email-preview-guest",
      sourceHotelSlug: "lighthouse-hotel",
      passType: "complimentary_hotel_guest",
      status: "active",
      validFrom: validFrom.toISOString(),
      validUntil: validUntil.toISOString(),
      passkitInstallUrl: "https://ahangama.com/lighthouse",
    },
    preferences: {
      id: "email-preview-preferences",
      stayLength: 7,
      interests: ["food", "surf", "events"],
      travelGroup: "friends",
      servicesInterested: ["restaurant bookings", "experiences"],
      wantsWhatsappRecommendations: true,
    },
  };
}

function buildOtherVenuePreviewPayload() {
  const validFrom = new Date();
  const validUntil = new Date(validFrom);
  validUntil.setUTCDate(validUntil.getUTCDate() + 15);

  return {
    guest: {
      id: "email-preview-kaffi-guest",
      fullName: "Maya Preview",
      email: "maya@example.com",
      phone: "+94771112222",
      sourceHotelSlug: "kaffi",
      destination: "ahangama",
    },
    pass: {
      id: "email-preview-kaffi-pass",
      guestId: "email-preview-kaffi-guest",
      sourceHotelSlug: "kaffi",
      passType: "complimentary_hotel_guest",
      status: "active",
      validFrom: validFrom.toISOString(),
      validUntil: validUntil.toISOString(),
      passkitInstallUrl: "https://ahangama.com/kaffi",
    },
    preferences: {
      id: "email-preview-kaffi-preferences",
      stayLength: 4,
      interests: ["coffee", "surf", "food"],
      travelGroup: "couple",
      servicesInterested: ["restaurant bookings"],
      wantsWhatsappRecommendations: true,
    },
  };
}

function parseBody(event) {
  if (!event.body) {
    return {};
  }

  try {
    return JSON.parse(event.body);
  } catch {
    return {};
  }
}

export const handler = async (event) => {
  const headers = jsonHeaders();

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (!["GET", "POST"].includes(event.httpMethod)) {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const payload = buildPreviewPayload();
    const otherVenuePayload = buildOtherVenuePreviewPayload();

    if (event.httpMethod === "POST") {
      const body = parseBody(event);
      const emailType = body.emailType || "guest-welcome";
      const email =
        emailType === "other-venue-notification"
          ? await sendGuestPassVenueNotificationEmail({
              ...otherVenuePayload,
              sourceHotelSlug: otherVenuePayload.pass.sourceHotelSlug,
              recipientOverride: TEST_EMAIL_RECIPIENT,
            })
          : emailType === "venue-notification"
            ? await sendGuestPassVenueNotificationEmail({
                ...payload,
                sourceHotelSlug: payload.pass.sourceHotelSlug,
                recipientOverride: TEST_EMAIL_RECIPIENT,
              })
            : await sendGuestWelcomeEmail({
                ...payload,
                recordHistory: false,
              });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          recipient: TEST_EMAIL_RECIPIENT,
          emailType,
          subject: email.subject,
        }),
      };
    }

    const guestWelcomeEmail = generateGuestWelcomeEmail(payload);
    const venueNotificationEmail = generateGuestPassVenueNotificationEmail({
      ...payload,
      sourceHotelSlug: payload.pass.sourceHotelSlug,
    });
    const otherVenueNotificationEmail = generateGuestPassVenueNotificationEmail(
      {
        ...otherVenuePayload,
        sourceHotelSlug: otherVenuePayload.pass.sourceHotelSlug,
      },
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        subject: guestWelcomeEmail.subject,
        html: guestWelcomeEmail.html,
        text: guestWelcomeEmail.text,
        recipient: TEST_EMAIL_RECIPIENT,
        guestWelcome: {
          subject: guestWelcomeEmail.subject,
          html: guestWelcomeEmail.html,
          text: guestWelcomeEmail.text,
          recipient: TEST_EMAIL_RECIPIENT,
        },
        venueNotification: {
          subject: venueNotificationEmail.subject,
          html: venueNotificationEmail.html,
          text: venueNotificationEmail.text,
          recipient: venueNotificationEmail.recipient,
        },
        otherVenueNotification: {
          subject: otherVenueNotificationEmail.subject,
          html: otherVenueNotificationEmail.html,
          text: otherVenueNotificationEmail.text,
          recipient: otherVenueNotificationEmail.recipient,
        },
      }),
    };
  } catch (error) {
    console.error("guest welcome email preview error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || "Unable to prepare guest welcome email preview",
      }),
    };
  }
};
