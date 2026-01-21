const { google } = require("googleapis");
const http = require("http");
const url = require("url");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "http://localhost:8889"
);

// Generate the URL that will be used for authorization
const scopes = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/userinfo.email",
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  prompt: "consent", // This forces a refresh token to be returned
});

console.log("🔧 Starting OAuth server on http://localhost:8889");
console.log(
  "🔗 Please visit this URL to authorize the application for hello@ahangama.com:"
);
console.log("\n" + authUrl + "\n");
console.log("📋 The authorization code will be captured automatically...");

// Start local server to capture the authorization code
const server = http.createServer((req, res) => {
  const queryObject = url.parse(req.url, true).query;

  if (queryObject.code) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <html>
        <body>
          <h2>✅ Authorization Successful!</h2>
          <p>You can close this tab now. The token is being processed...</p>
        </body>
      </html>
    `);

    // Exchange code for tokens
    oauth2Client.getToken(queryObject.code, (err, token) => {
      server.close();

      if (err) {
        console.error("❌ Error retrieving access token:", err);
        process.exit(1);
      }

      console.log("\n✅ Token received successfully!");
      console.log("📝 Add this to your .env file:");
      console.log(`GMAIL_REFRESH_TOKEN=${token.refresh_token}`);

      // Test the token
      oauth2Client.setCredentials(token);
      const gmail = google.gmail({ version: "v1", auth: oauth2Client });

      gmail.users.getProfile({ userId: "me" }, (err, response) => {
        if (err) {
          console.log("❌ Test failed:", err.message);
        } else {
          console.log("✅ Test successful!");
          console.log("📧 Authenticated as:", response.data.emailAddress);
        }
        process.exit(0);
      });
    });
  } else if (queryObject.error) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end(`
      <html>
        <body>
          <h2>❌ Authorization Failed</h2>
          <p>Error: ${queryObject.error}</p>
          <p>Description: ${
            queryObject.error_description || "Unknown error"
          }</p>
        </body>
      </html>
    `);
    server.close();
    console.error("❌ Authorization failed:", queryObject.error);
    process.exit(1);
  }
});

server.listen(8889, () => {
  console.log("🔧 Local server started on port 8889");
});
