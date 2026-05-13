import type { Schema } from "../../data/resource";
import type { AppSyncResolverHandler } from "aws-lambda";

type NotifyArgs = Schema["notifyShopOfClaim"]["args"];
type NotifyReturn = Schema["notifyShopOfClaim"]["returnType"];

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;

async function sendSms(to: string, body: string) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const creds = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: to, From: TWILIO_FROM_NUMBER!, Body: body }).toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Twilio error ${res.status}: ${text}`);
  }
}

export const handler: AppSyncResolverHandler<NotifyArgs, NotifyReturn> = async (event) => {
  const { claimId, contactPhone, dealOffer } = event.arguments;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    console.log("Twilio not configured — skipping SMS for claim", claimId);
    return "skipped";
  }

  if (!contactPhone) {
    console.warn("No contactPhone provided for claim", claimId);
    return "no-phone";
  }

  const msg =
    `New Revv claim! A driver claimed your deal: "${dealOffer ?? ""}". ` +
    `Claim ID: ${claimId}. ` +
    `You have 24 hours to contact them. Log in at revv.app/shop to view.`;

  await sendSms(contactPhone, msg);
  return "sent";
};
