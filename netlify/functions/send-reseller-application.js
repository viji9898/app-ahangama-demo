/* global exports, process, require */

const sgMail = require("@sendgrid/mail");

const REQUIRED_FIELDS = [
  "partnerType",
  "name",
  "business",
  "location",
  "volume",
  "email",
  "phone",
  "channel",
  "motivation",
];

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const formData = JSON.parse(event.body || "{}");
    const missingFields = REQUIRED_FIELDS.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        }),
      };
    }

    if (!formData.termsAgreed) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Terms agreement is required",
        }),
      };
    }

    if (!process.env.SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY is not configured");
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const submittedAt = new Date().toISOString();
    const safe = {
      partnerType: escapeHtml(formData.partnerType),
      name: escapeHtml(formData.name),
      business: escapeHtml(formData.business),
      location: escapeHtml(formData.location),
      volume: escapeHtml(formData.volume),
      email: escapeHtml(formData.email),
      phone: escapeHtml(formData.phone),
      channel: escapeHtml(formData.channel),
      motivation: escapeHtml(formData.motivation),
      submittedAt: escapeHtml(new Date(submittedAt).toLocaleString()),
    };

    await sgMail.send({
      to: "team@ahangama.com",
      from: "hello@ahangama.com",
      replyTo: formData.email,
      subject: `New reseller application - ${formData.business}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #1f2937;">
          <h2 style="margin-bottom: 16px; color: #005f6b;">New Ahangama Pass reseller application</h2>
          <p style="margin-bottom: 20px; color: #4b5563;">A new reseller application has been submitted through the /resellers form.</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; width: 220px;">Partner type</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb;"><strong>${safe.partnerType}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Full name</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb;">${safe.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Business</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb;">${safe.business}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Location</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb;">${safe.location}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Estimated volume</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb;">${safe.volume}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Email</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${safe.email}">${safe.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Phone</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb;">${safe.phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Sales channel</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb;">${safe.channel}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; vertical-align: top;">Motivation</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; white-space: pre-wrap;">${safe.motivation}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; color: #6b7280;">Submitted at</td>
              <td style="padding: 10px 12px;">${safe.submittedAt}</td>
            </tr>
          </table>
        </div>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Error sending reseller application email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to submit reseller application",
        details: error.message,
      }),
    };
  }
};
