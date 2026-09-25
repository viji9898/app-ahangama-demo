const TEMPORARY_ADMIN_PASSWORD = "admin123";

export function isGuideAdminAuthorized(headers = {}) {
  const suppliedPassword =
    headers["x-admin-password"] || headers["X-Admin-Password"] || "";

  return suppliedPassword === TEMPORARY_ADMIN_PASSWORD;
}

export function guideAdminUnauthorizedResponse() {
  return {
    statusCode: 401,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: false, error: "Unauthorized" }),
  };
}