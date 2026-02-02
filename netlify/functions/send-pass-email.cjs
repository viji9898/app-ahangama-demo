const sgMail = require("@sendgrid/mail");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { customerEmail, customerName, qrCode, pdfBase64 } = JSON.parse(
      event.body || "{}",
    );

    // Input validation
    if (!customerEmail || !pdfBase64 || !qrCode) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required fields: customerEmail, qrCode, pdfBase64",
        }),
      };
    }

    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const subject = "Your Ahangama Pass is Ready - Digital Card Inside!";

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <style>
              body { font-family: 'Helvetica', Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
              .content { background: #fff; padding: 30px; border: 1px solid #ddd; }
              .pass-code { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; font-family: monospace; font-size: 16px; border: 2px dashed #8B4513; }
              .benefits { background: #fff8dc; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; font-size: 12px; color: #666; }
              .button { background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 10px; }
              ul { padding-left: 20px; }
              li { margin-bottom: 8px; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>🎉 Welcome to Ahangama Pass!</h1>
                  <p>Your digital experience card is ready</p>
              </div>
              
              <div class="content">
                  <p>Dear ${customerName || "Valued Customer"},</p>
                  
                  <p>🎊 <strong>Congratulations!</strong> Your Ahangama Pass purchase was successful, and you're now ready to unlock exclusive experiences in beautiful Ahangama!</p>
                  
                  <div class="pass-code" style="text-align: center; margin: 20px 0;">
                      <a href="https://ahangama.com/card/pass/${qrCode.includes("?qr=") ? qrCode.split("?qr=")[1] : qrCode}" class="button" style="margin-top: 10px; display: inline-block;">📱 View Your Digital Pass</a>
                  </div>
                  
                  <div class="benefits">
                      <h3>🎁 What Your Pass Unlocks:</h3>
                      <ul>
                          <li><strong>Exclusive Discounts</strong> at curated restaurants and cafes</li>
                          <li><strong>Special Perks</strong> at wellness and experience venues</li>
                          <li><strong>VIP Treatment</strong> at selected accommodations</li>
                          <li><strong>Free Items</strong> and upgrades at partner locations</li>
                          <li><strong>Local Insider Access</strong> to hidden gems</li>
                      </ul>
                  </div>
                  
                  <h3>📱 How to Use Your Pass:</h3>
                  <ol>
                      <li><strong>Show the QR code</strong> from the attached PDF or your phone</li>
                      <li><strong>Present at any participating venue</strong> - just ask staff to scan</li>
                      <li><strong>Enjoy your exclusive benefit</strong> - each venue offers unique perks!</li>
                  </ol>
                  
                  <p><strong>📎 Attached:</strong> Your personalized Ahangama Pass PDF - save it to your phone or print it for easy access!</p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                      <a href="https://ahangama.com" class="button">🗺️ View All Participating Venues</a>
                      <a href="https://wa.me/94777908790?text=Hi!%20I%20need%20help%20with%20my%20Ahangama%20Pass.%20My%20pass%20code%20is:%20${qrCode}" class="button" style="background: #25d366; border-color: #25d366;">💬 WhatsApp Support</a>
                  </div>
                  
                  <p><strong>💡 Pro Tips:</strong></p>
                  <ul>
                      <li>Save the PDF to your phone's photos for quick access</li>
                      <li>Check our website for the complete list of participating venues</li>
                      <li>Your pass is valid for the full duration - use it as much as you want!</li>
                      <li>Each QR code is unique and tied to your purchase</li>
                  </ul>
                  
                  <p>Ready to explore Ahangama like a local? Your curated adventure starts now! 🌊</p>
                  
                  <p>Happy exploring!<br>
                  <strong>The Ahangama Pass Team</strong></p>
              </div>
              
              <div class="footer">
                  <p>Questions? Reply to this email or visit <a href="https://ahangama.com">ahangama.com</a></p>
                  <p>© 2026 Ahangama Pass - Curated Local Experiences</p>
                  <p style="font-size: 10px; margin-top: 10px;">This email was sent because you purchased an Ahangama Pass. Keep this email for your records.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    const safeSuffix = String(qrCode).split("-").pop() || "pass";
    const filename = `ahangama-pass-${safeSuffix}.pdf`;

    // Send email with SendGrid
    const msg = {
      to: customerEmail,
      from: "hello@ahangama.com",
      subject,
      html: htmlBody,
      attachments: [
        {
          content: pdfBase64,
          filename,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Email sent successfully",
      }),
    };
  } catch (error) {
    console.error("Email sending error:", error?.message || error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to send email",
        details: error.message,
      }),
    };
  }
};
