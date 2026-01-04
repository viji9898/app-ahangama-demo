// Client-side email service - only contains functions for calling Netlify functions
// Server-side Gmail API code is handled in /netlify/functions/send-pass-email.js

// Function to call the Netlify serverless function (recommended for production)
export const sendPassEmailViaFunction = async (
  customerEmail,
  customerName,
  qrCode,
  pdfBase64
) => {
  try {
    const response = await fetch("/.netlify/functions/send-pass-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerEmail,
        customerName,
        qrCode,
        pdfBase64,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Email sending via function failed:", error);
    throw error;
  }
};
