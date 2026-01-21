import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

async function sendTestEmail() {
  try {
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      "http://localhost:8889"
    );

    // Set refresh token
    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    });

    // Create Gmail API client
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Create email content
    const emailSubject = "🧪 Test Email from Ahangama App";
    const emailBody = `
Hello from Ahangama!

This is a test email sent from hello@ahangama.com using the Gmail API.

✅ OAuth setup successful
✅ Gmail API authentication working
✅ Email delivery functional

Test sent at: ${new Date().toISOString()}

Best regards,
The Ahangama Team
    `.trim();

    // Create the email message
    const emailLines = [
      `From: ${process.env.GMAIL_USER}`,
      `To: vijitha.wijesuriya@gmail.com`,
      `Subject: ${emailSubject}`,
      "",
      emailBody,
    ];

    const email = emailLines.join("\r\n");
    const encodedEmail = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Send the email
    console.log("🚀 Sending test email...");
    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedEmail,
      },
    });

    console.log("✅ Test email sent successfully!");
    console.log(`📧 From: ${process.env.GMAIL_USER}`);
    console.log(`📧 To: hello@viji.com`);
    console.log(`📧 Subject: ${emailSubject}`);
    console.log(`📧 Message ID: ${result.data.id}`);
    console.log(`📊 Thread ID: ${result.data.threadId}`);
  } catch (error) {
    console.error("❌ Failed to send test email:");
    console.error(error.message);
    if (error.response && error.response.data) {
      console.error("Error details:", error.response.data);
    }
  }
}

// Run the test
sendTestEmail();
