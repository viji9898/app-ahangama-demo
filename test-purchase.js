#!/usr/bin/env node

console.log("🧪 Testing purchase creation...\n");

const testSessionId = `cs_test_${Date.now()}_test`;

try {
  const response = await fetch(
    `http://localhost:8888/.netlify/functions/verify-payment?sessionId=${testSessionId}`
  );
  const result = await response.json();

  if (response.ok) {
    console.log("✅ Payment verification test successful!");
    console.log("📧 Customer:", result.customerEmail);
    console.log("🎫 Product:", result.productName);
    console.log("🔢 QR Code URL:", result.qrCode);
    console.log("📅 Expires:", result.expiryDate);
  } else {
    console.error("❌ Test failed:", result.error);
  }
} catch (error) {
  console.error("❌ Test error:", error.message);
  console.log("\n💡 Make sure your development server is running:");
  console.log("   npm run dev");
}

console.log("\n🔍 Now check the database:");
console.log("   node verify-db.js");
console.log("   node db-query.js list-customers");
