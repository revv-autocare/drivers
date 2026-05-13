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
  const { claimId, shopId, dealOffer } = event.arguments;

  // Only send if Twilio is configured (skip in dev without secrets)
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    console.log("Twilio not configured — skipping SMS for claim", claimId);
    return "skipped";
  }

  // Lazy import Amplify client inside handler to avoid cold-start overhead
  const { generateClient } = await import("aws-amplify/data");
  const { Amplify } = await import("aws-amplify");
  const outputs = await import("../../../amplify_outputs.json");
  Amplify.configure(outputs.default ?? outputs);
  const client = generateClient<Schema>();

  const { data: shop } = await client.models.Shop.get({ id: shopId });
  if (!shop?.contactPhone) {
    console.warn("Shop has no contactPhone — cannot SMS. shopId:", shopId);
    return "no-phone";
  }

  const msg =
    `New Revv claim! A driver claimed your deal: "${dealOffer}". ` +
    `Claim ID: ${claimId}. ` +
    `You have 24 hours to contact them. Log in at revv.app/shop to view.`;

  await sendSms(shop.contactPhone, msg);
  return "sent";
};
