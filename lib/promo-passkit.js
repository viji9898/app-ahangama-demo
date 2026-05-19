import process from "node:process";

function getPasskitSecret() {
  return process.env.PASSKIT_SMARTPASS_SECRET || "";
}

function getDistributionUrl() {
  return process.env.PASSKIT_DISTRIBUTION_URL || "";
}

function toColomboIsoString(date) {
  const offsetMs = 5.5 * 60 * 60 * 1000;
  const local = new Date(date.getTime() + offsetMs);
  const pad = (value) => String(value).padStart(2, "0");

  return `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}-${pad(local.getUTCDate())}T${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}:${pad(local.getUTCSeconds())}+05:30`;
}

export async function createPromoPasskitLink({
  passkitPassId,
  passHolderName,
  customerEmail,
  customerPhone,
  expiryDate,
}) {
  const passkitSecret = getPasskitSecret();
  const distributionUrl = getDistributionUrl();

  if (!passkitSecret || !distributionUrl || !passkitPassId || !expiryDate) {
    return null;
  }

  const response = await fetch(
    "https://api.pub1.passkit.io/distribution/smartpasslink",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${passkitSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectDistributionUrl: {
          url: distributionUrl,
          title: "Ahangama Pass",
        },
        fields: {
          "members.program.name": "Ahangama Pass",
          "members.member.points": "0",
          "members.tier.name": "Base",
          "members.member.status": "ACTIVE",
          "members.member.externalId": passkitPassId,
          "person.displayName": passHolderName || "Ahangama Pass Holder",
          "person.surname": "",
          "person.emailAddress": customerEmail || "",
          "person.mobileNumber": customerPhone || "",
          "universal.info": "Valid at all participating Ahangama Pass venues.",
          "universal.expiryDate": toColomboIsoString(new Date(expiryDate)),
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PassKit request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data?.url || null;
}