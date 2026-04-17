const sgMail = require("@sendgrid/mail");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const formData = JSON.parse(event.body || "{}");

    // Input validation
    if (!formData.venueName || !formData.email || !formData.contactName) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required fields: venueName, email, contactName",
        }),
      };
    }

    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Create email content for admin
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h2>🤝 New Partner Sign-Up - ${formData.venueName}</h2>
        <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <strong style="color: #1890ff;">✅ VENUE NOW LIVE AS PARTNER</strong>
        </div>
        
        <h3>📍 Venue Details</h3>
        <p><strong>Venue Name:</strong> ${formData.venueName}</p>
        <p><strong>Venue Type:</strong> ${
          formData.venueType || "Not specified"
        }</p>
        <p><strong>Location:</strong> ${
          formData.location || "Not specified"
        }</p>
        ${
          formData.otherVenueType
            ? `<p><strong>Other Type:</strong> ${formData.otherVenueType}</p>`
            : ""
        }
        
        <h3>👤 Contact Information</h3>
        <p><strong>Contact Name:</strong> ${formData.contactName}</p>
        <p><strong>Role:</strong> ${formData.contactRole}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Primary Contact:</strong> ${formData.phone}</p>
        ${
          formData.instagram
            ? `<p><strong>Instagram:</strong> ${formData.instagram}</p>`
            : ""
        }
        ${
          formData.website
            ? `<p><strong>Website:</strong> ${formData.website}</p>`
            : ""
        }
        
        <h3>🎁 Customer Offer</h3>
        ${
          formData.offerType
            ? `<p><strong>Offer Type:</strong> ${JSON.stringify(
                formData.offerType,
              )}</p>`
            : ""
        }
        ${
          formData.offerDescription
            ? `<p><strong>Offer Description:</strong> ${formData.offerDescription}</p>`
            : ""
        }
        ${
          formData.offerAppliesTo
            ? `<p><strong>Applies To:</strong> ${JSON.stringify(
                formData.offerAppliesTo,
              )}</p>`
            : ""
        }
        
        <h3>🔄 Guest Redemption Process</h3>
        <p><strong>Redemption Info:</strong> Partner has been informed about how guests can redeem offers (show pass, mention at booking, QR verification, staff verification)</p>
        
        <h3>📢 Marketing</h3>
        ${
          formData.marketingNotes
            ? `<p><strong>Marketing Notes:</strong> ${formData.marketingNotes}</p>`
            : ""
        }
        
        <h3>✅ Agreements</h3>
        <p><strong>Agreed to Terms:</strong> ${
          formData.agreeToTerms ? "Yes" : "No"
        }</p>
        <p><strong>Marketing Consent:</strong> ${
          formData.agreeToMarketing ? "Yes" : "No"
        }</p>
        
        <hr>
        <p><small>Application submitted on: ${new Date().toLocaleString()}</small></p>
      </div>
    `;

    // Create email content for partner
    const partnerEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h1 style="margin-bottom: 24px;">Welcome to the Ahangama Pass</h1>

        <p>Dear Partner,</p>

        <p>
          We’re excited to have you on board as a vendor partner, joining a curated network of
          businesses coming together to offer exclusive privileges and experiences to travellers
          exploring Ahangama. Your participation plays a key role in shaping how visitors discover and
          engage with the destination.
        </p>

        <h2 style="margin-top: 32px;">What happens next</h2>

        <h3 style="margin-top: 24px;">1. Media &amp; Brand Asset Collection</h3>
        <p>
          A member of our team will be in touch within 2 business days to collect your media and
          branding assets. This includes photography, logos, and any relevant brand materials
          required to feature your business across Ahangama Pass platforms and marketing channels.
        </p>

        <h3 style="margin-top: 24px;">2. Staff Training &amp; Onboarding</h3>
        <p>
          We will guide you on how to brief and train your staff to ensure a smooth and consistent
          experience for Ahangama Pass holders. Detailed training guidelines will follow in a separate
          communication.
        </p>

        <h3 style="margin-top: 24px;">3. Ongoing Support</h3>
        <p>
          For any questions or assistance, please feel free to reach out to our Vendor Coordinator:
        </p>

        <div style="background: #f7f7f7; padding: 16px; border-radius: 8px; border: 1px solid #e5e5e5; margin: 16px 0 24px;">
          <p style="margin: 0 0 8px;"><strong>Vishmi de Silva</strong></p>
          <p style="margin: 0 0 8px;">hello@ahangama.com</p>
          <p style="margin: 0;">+94 77 273 3202</p>
        </div>

        <h2 style="margin-top: 32px;">Partner Terms Summary</h2>

        <p>
          By joining the Ahangama Pass, you agree to honour the offer submitted through your
          signup form and participate as part of the Ahangama Pass partner network.
        </p>

        <div style="background: #f7f7f7; padding: 16px; border-radius: 8px; border: 1px solid #e5e5e5; margin: 16px 0 24px;">
          <p style="margin: 0 0 8px;"><strong>Your submitted offer</strong></p>
          ${
            formData.offerType
              ? `<p style="margin: 0 0 8px;"><strong>Offer Type:</strong> ${
                  Array.isArray(formData.offerType)
                    ? formData.offerType.join(", ")
                    : formData.offerType
                }</p>`
              : ""
          }
          ${
            formData.offerDescription
              ? `<p style="margin: 0 0 8px;"><strong>Offer Description:</strong> ${formData.offerDescription}</p>`
              : ""
          }
          ${
            formData.offerAppliesTo
              ? `<p style="margin: 0;"><strong>Applies To:</strong> ${
                  Array.isArray(formData.offerAppliesTo)
                    ? formData.offerAppliesTo.join(", ")
                    : formData.offerAppliesTo
                }</p>`
              : ""
          }
        </div>

        <ul style="padding-left: 20px; margin: 0 0 24px;">
          <li>Guests must present the Ahangama Pass before payment or mention it when booking directly.</li>
          <li>Offers cannot be applied after payment has been completed.</li>
          <li>Accommodation offers apply to direct bookings only and exclude OTA bookings.</li>
          <li>Direct booking rates should not exceed OTA rates for the same dates.</li>
          <li>You agree to support minimal Ahangama Pass branding at the venue where appropriate.</li>
          <li>There are no fees or commissions, and the partnership is non-exclusive.</li>
          <li>Either party may terminate the partnership with 30 days written notice.</li>
        </ul>

        <p>
          We look forward to working closely with you and building something meaningful together in
          Ahangama.
        </p>

        <p style="margin-top: 24px;">
          Warm regards,<br>
          <strong>Ahangama Pass Team</strong>
        </p>
      </div>
    `;

    // Send email to admin
    await sgMail.send({
      to: "team@ahangama.com",
      from: "hello@ahangama.com",
      subject: `${formData.venueName} Partnership Sign Up`,
      html: adminEmailContent,
    });

    // Send confirmation email to partner
    await sgMail.send({
      to: formData.email,
      from: "hello@ahangama.com",
      subject: `Partnership Application Received - ${formData.venueName}`,
      html: partnerEmailContent,
    });

    console.log(
      `Partnership application emails sent successfully for ${formData.venueName}`,
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Partnership application submitted successfully",
      }),
    };
  } catch (error) {
    console.error("Error sending partnership application emails:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to submit partnership application",
        details: error.message,
      }),
    };
  }
};
