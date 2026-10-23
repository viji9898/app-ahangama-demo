import assert from "node:assert/strict";
import test from "node:test";
import { maskDisplayName } from "../lib/public-pass-data.js";
import { isGuideAdminAuthorized } from "../lib/guide-admin-auth.js";
import {
  createCheckoutAccessToken,
  hashCheckoutAccessToken,
  verifyCheckoutAccessToken,
} from "../lib/checkout-access.js";

test("public pass names expose only a first name and last initial", () => {
  assert.equal(maskDisplayName("Vijitha Wijesuriya"), "Vijitha W.");
  assert.equal(maskDisplayName("Maya"), "Maya");
  assert.equal(maskDisplayName(""), "Guest");
});

test("guide admin authorization fails closed without a configured secret", () => {
  const previousPassword = process.env.GUIDE_ADMIN_PASSWORD;
  delete process.env.GUIDE_ADMIN_PASSWORD;

  assert.equal(
    isGuideAdminAuthorized({ "x-admin-password": "admin123" }),
    false,
  );

  if (previousPassword === undefined) {
    delete process.env.GUIDE_ADMIN_PASSWORD;
  } else {
    process.env.GUIDE_ADMIN_PASSWORD = previousPassword;
  }
});

test("guide admin authorization uses the configured server secret", () => {
  const previousPassword = process.env.GUIDE_ADMIN_PASSWORD;
  process.env.GUIDE_ADMIN_PASSWORD = "test-only-secret";

  assert.equal(
    isGuideAdminAuthorized({ "x-admin-password": "test-only-secret" }),
    true,
  );
  assert.equal(
    isGuideAdminAuthorized({ "x-admin-password": "incorrect" }),
    false,
  );

  if (previousPassword === undefined) {
    delete process.env.GUIDE_ADMIN_PASSWORD;
  } else {
    process.env.GUIDE_ADMIN_PASSWORD = previousPassword;
  }
});

test("checkout access tokens are high entropy and verified by hash", () => {
  const token = createCheckoutAccessToken();
  const hash = hashCheckoutAccessToken(token);

  assert.ok(token.length >= 40);
  assert.equal(verifyCheckoutAccessToken(token, hash), true);
  assert.equal(verifyCheckoutAccessToken(`${token}x`, hash), false);
  assert.equal(verifyCheckoutAccessToken("", hash), false);
});