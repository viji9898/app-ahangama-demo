import crypto from "node:crypto";
import process from "node:process";

function secureEqual(first, second) {
  const firstBuffer = Buffer.from(String(first || ""));
  const secondBuffer = Buffer.from(String(second || ""));

  return (
    firstBuffer.length === secondBuffer.length &&
    crypto.timingSafeEqual(firstBuffer, secondBuffer)
  );
}

export function isGuideAdminAuthorized(headers = {}) {
  const configuredPassword = process.env.GUIDE_ADMIN_PASSWORD || "";
  const suppliedPassword =
    headers["x-admin-password"] || headers["X-Admin-Password"] || "";

  return Boolean(configuredPassword) && secureEqual(suppliedPassword, configuredPassword);
}

export function guideAdminUnauthorizedResponse() {
  return {
    statusCode: 401,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: false, error: "Unauthorized" }),
  };
}