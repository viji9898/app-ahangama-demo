import process from "node:process";
import { createPromoPasskitLink } from "./promo-passkit.js";

function getPasskitApiKey() {
  return process.env.PASSKIT_API_KEY || "";
}

function getPasskitProgramId() {
  return process.env.PASSKIT_PROGRAM_ID || "";
}

function getPasskitBaseUrl() {
  return String(process.env.PASSKIT_BASE_URL || "").trim();
}

function getPublicSiteUrl() {
  return String(
    process.env.PASS_VERIFICATION_BASE_URL ||
      process.env.PUBLIC_SITE_URL ||
      process.env.VITE_SITE_URL ||
      "https://ahangama.com",
  )
    .trim()
    .replace(/\/$/, "");
}

function hasPasskitMemberConfig() {
  return Boolean(
    getPasskitApiKey() && getPasskitProgramId() && getPasskitBaseUrl(),
  );
}

function normalizeText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function normalizeCommaList(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .join(", ");
}

export function buildPassVerificationUrl(code) {
  const normalizedCode = normalizeText(code).toLowerCase();

  if (!normalizedCode) {
    return "";
  }

  return `${getPublicSiteUrl()}/valid?${encodeURIComponent(normalizedCode)}`;
}

function formatStayLength(value) {
  const normalized = normalizeText(value).toLowerCase().replaceAll("–", "-");

  const mapped = {
    3: "1-3 nights",
    7: "4-7 nights",
    14: "8-14 nights",
    30: "15-30 nights",
    31: "1 month+",
  }[normalized];

  return mapped || normalizeText(value);
}

function toColomboIsoString(value) {
  const date = new Date(value || "");

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetMs = 5.5 * 60 * 60 * 1000;
  const local = new Date(date.getTime() + offsetMs);
  const pad = (part) => String(part).padStart(2, "0");

  return `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}-${pad(local.getUTCDate())}T${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}:${pad(local.getUTCSeconds())}+05:30`;
}

function splitFullName(fullName) {
  const normalized = normalizeText(fullName);

  if (!normalized) {
    return { firstName: "", lastName: "" };
  }

  const parts = normalized.split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

function requirePasskitConfig() {
  const apiKey = getPasskitApiKey();
  const programId = getPasskitProgramId();
  const baseUrl = getPasskitBaseUrl();

  if (!apiKey || !programId || !baseUrl) {
    throw new Error(
      "PassKit is not configured. Expected PASSKIT_API_KEY, PASSKIT_PROGRAM_ID, and PASSKIT_BASE_URL.",
    );
  }

  return { apiKey, programId, baseUrl };
}

function buildPasskitMembersUrl(baseUrl) {
  const normalized = baseUrl.replace(/\/+$/, "");
  return normalized.endsWith("/members") ? normalized : `${normalized}/members`;
}

function getByPath(source, path) {
  return path
    .split(".")
    .reduce(
      (current, key) =>
        current && current[key] !== undefined ? current[key] : undefined,
      source,
    );
}

function firstDefined(source, paths) {
  for (const path of paths) {
    const value = getByPath(source, path);
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return null;
}

function normalizePasskitResponse(data, payload) {
  const installUrl =
    firstDefined(data, [
      "installUrl",
      "walletUrl",
      "url",
      "member.installUrl",
      "member.walletUrl",
      "member.url",
      "pass.installUrl",
      "pass.url",
      "links.installUrl",
    ]) || null;
  const passUrl =
    firstDefined(data, [
      "passUrl",
      "member.passUrl",
      "pass.url",
      "links.passUrl",
    ]) || installUrl;

  return {
    passkitProgramId:
      firstDefined(data, ["programId", "member.programId", "program.id"]) ||
      payload.programId,
    passkitMemberId:
      firstDefined(data, ["memberId", "id", "member.id", "pass.id"]) || null,
    passkitExternalId:
      firstDefined(data, [
        "externalId",
        "member.externalId",
        "pass.externalId",
      ]) || payload.externalId,
    passkitPassUrl: normalizeText(passUrl) || null,
    passkitInstallUrl: normalizeText(installUrl) || null,
    passkitStatus:
      firstDefined(data, ["status", "member.status", "pass.status"]) ||
      "created",
    passkitCreatedAt:
      firstDefined(data, ["createdAt", "member.createdAt", "pass.createdAt"]) ||
      null,
    passkitUpdatedAt:
      firstDefined(data, ["updatedAt", "member.updatedAt", "pass.updatedAt"]) ||
      null,
  };
}

async function parsePasskitResponse(response) {
  const rawText = await response.text();

  if (!rawText) {
    return {};
  }

  try {
    return JSON.parse(rawText);
  } catch {
    return { rawText };
  }
}

export function buildPasskitMemberPayload({
  guest,
  pass,
  preferences,
  sourceHotelSlug,
}) {
  const programId = getPasskitProgramId();
  const { firstName, lastName } = splitFullName(guest?.fullName);
  const verificationUrl = buildPassVerificationUrl(pass?.verificationCode);
  const normalizedSourceHotelSlug = normalizeText(
    sourceHotelSlug || pass?.sourceHotelSlug,
  );
  const isOneYearWalletPass = ["ahangama-hospo", "ahangama-comp-pass"].includes(
    normalizedSourceHotelSlug,
  );
  const expiryDate = toColomboIsoString(pass?.validUntil);

  return {
    programId,
    externalId: verificationUrl || pass?.id,
    email: normalizeText(guest?.email),
    firstName,
    lastName,
    mobileNumber: normalizeText(guest?.phone),
    passType: normalizeText(pass?.passType),
    validFrom: pass?.validFrom || null,
    validUntil: pass?.validUntil || null,
    ...(isOneYearWalletPass
      ? {
          fields: {
            "universal.expiryDate": expiryDate,
            "universal.validUntil": expiryDate,
            "universal.validity": "Valid for 1 year",
            "members.member.expiryDate": expiryDate,
          },
        }
      : {}),
    customFields: {
      sourceHotelSlug: normalizedSourceHotelSlug,
      destination: normalizeText(guest?.destination),
      country: normalizeText(guest?.country),
      stayLength: formatStayLength(preferences?.stayLength),
      interests: normalizeCommaList(preferences?.interests),
      servicesInterested: normalizeCommaList(preferences?.servicesInterested),
      whatsappOptIn: guest?.whatsappOptIn ? "yes" : "no",
      passType: normalizeText(pass?.passType),
      validFrom: pass?.validFrom || "",
      validUntil: pass?.validUntil || "",
      ...(isOneYearWalletPass
        ? {
            expiryDate,
            validityLabel: "Valid for 1 year",
          }
        : {}),
      verificationCode: normalizeText(pass?.verificationCode),
      verificationUrl,
    },
  };
}

async function createDistributionOnlySmartPassForHotelGuest({ guest, pass }) {
  if (!pass?.id || !pass?.validUntil) {
    throw new Error(
      "PassKit smart link generation requires a persisted pass id and validUntil date.",
    );
  }

  const verificationUrl = buildPassVerificationUrl(pass.verificationCode);

  const smartPassUrl = await createPromoPasskitLink({
    passkitPassId: verificationUrl || pass.id,
    verifyUrl: verificationUrl,
    passHolderName: guest?.fullName,
    customerEmail: guest?.email,
    customerPhone: guest?.phone,
    expiryDate: pass.validUntil,
  });

  if (!smartPassUrl) {
    throw new Error(
      "PassKit smart link generation did not return an install URL.",
    );
  }

  return {
    passkitProgramId: null,
    passkitMemberId: null,
    passkitExternalId: verificationUrl || pass.id,
    passkitPassUrl: null,
    passkitInstallUrl: smartPassUrl,
    passkitStatus: "smartpass_ready",
    passkitCreatedAt: null,
    passkitUpdatedAt: null,
  };
}

export async function createPasskitMemberForHotelGuest({
  guest,
  pass,
  preferences,
  sourceHotelSlug,
}) {
  if (!hasPasskitMemberConfig()) {
    return createDistributionOnlySmartPassForHotelGuest({ guest, pass });
  }

  const { apiKey, baseUrl } = requirePasskitConfig();
  const payload = buildPasskitMemberPayload({
    guest,
    pass,
    preferences,
    sourceHotelSlug,
  });

  const response = await fetch(buildPasskitMembersUrl(baseUrl), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parsePasskitResponse(response);

  if (!response.ok) {
    const errorMessage =
      firstDefined(data, ["message", "error", "rawText"]) ||
      `HTTP ${response.status}`;
    const error = new Error(`PassKit request failed: ${errorMessage}`);
    error.statusCode = response.status;
    throw error;
  }

  const normalizedResponse = normalizePasskitResponse(data, payload);

  if (!normalizedResponse.passkitInstallUrl && pass?.validUntil) {
    try {
      const smartPassUrl = await createPromoPasskitLink({
        passkitPassId:
          normalizedResponse.passkitExternalId ||
          normalizedResponse.passkitMemberId ||
          payload.externalId,
        verifyUrl: normalizedResponse.passkitPassUrl,
        passHolderName: guest?.fullName,
        customerEmail: guest?.email,
        customerPhone: guest?.phone,
        expiryDate: pass.validUntil,
      });

      if (smartPassUrl) {
        normalizedResponse.passkitInstallUrl = smartPassUrl;
      }
    } catch (error) {
      console.error("PassKit smart link generation failed:", {
        message: error?.message || "Unknown PassKit smart link error",
        passId: payload.externalId,
      });
    }
  }

  return normalizedResponse;
}
