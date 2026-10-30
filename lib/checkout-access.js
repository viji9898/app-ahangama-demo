import crypto from "node:crypto";

export function createCheckoutAccessToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashCheckoutAccessToken(token) {
  return crypto
    .createHash("sha256")
    .update(String(token || ""))
    .digest("hex");
}

export function verifyCheckoutAccessToken(token, expectedHash) {
  if (!token || !expectedHash) return false;

  const actualBuffer = Buffer.from(hashCheckoutAccessToken(token), "hex");
  const expectedBuffer = Buffer.from(String(expectedHash), "hex");

  return (
    actualBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  );
}