/**
 * seed.ts — populate Revv with initial shops and deals for beta testing
 *
 * Run from repo root after deploying the sandbox:
 *   npx tsx scripts/seed.ts
 *
 * Requires REVV_ADMIN_USER / REVV_ADMIN_PASS env vars for a Cognito admin user
 * in the `admin` group (create one first in the Cognito console).
 */
import { Amplify } from "aws-amplify";
import { signIn, signOut } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../apps/driver/amplify/data/resource";
import outputs from "../apps/driver/amplify_outputs.json";

Amplify.configure(outputs);
const client = generateClient<Schema>();

// ── Seed data ──────────────────────────────────────────────────────────────

const SHOPS = [
  {
    name: "Pacific Auto Care",
    neighborhood: "Kitsilano",
    address: "1842 W 4th Ave, Vancouver, BC",
    lat: 49.2672, lng: -123.1559,
    hours: "Mon–Sat 8am–6pm",
    specialties: ["Oil change", "Brakes", "Tires", "Inspection"],
    logoColor: "#3B7BFF",
    logo: "PA",
    verified: true,
    honorRate: 96,
    rating: 4.8,
    reviewsCount: 142,
    contactPhone: process.env.SEED_SHOP1_PHONE ?? "",
  },
  {
    name: "Mount Pleasant Motors",
    neighborhood: "Mount Pleasant",
    address: "180 E 2nd Ave, Vancouver, BC",
    lat: 49.2684, lng: -123.1020,
    hours: "Mon–Fri 7:30am–5:30pm",
    specialties: ["Engine", "Transmission", "Diagnostics", "AC"],
    logoColor: "#10B981",
    logo: "MP",
    verified: true,
    honorRate: 94,
    rating: 4.7,
    reviewsCount: 98,
    contactPhone: process.env.SEED_SHOP2_PHONE ?? "",
  },
  {
    name: "Broadway Tire & Auto",
    neighborhood: "Fairview",
    address: "1345 W Broadway, Vancouver, BC",
    lat: 49.2629, lng: -123.1373,
    hours: "Mon–Sat 8am–5pm",
    specialties: ["Tires", "Alignment", "Brakes"],
    logoColor: "#F59E0B",
    logo: "BT",
    verified: false,
    honorRate: 89,
    rating: 4.4,
    reviewsCount: 61,
    contactPhone: process.env.SEED_SHOP3_PHONE ?? "",
  },
];

const DEALS_BY_SHOP: Record<string, Array<{ offer: string; category: string; priceNow?: number; priceWas?: number; pct?: number; expiresInDays: number }>> = {
  "Pacific Auto Care": [
    { offer: "Full synthetic oil change + filter", category: "oil", priceNow: 79.95, priceWas: 109.95, expiresInDays: 30 },
    { offer: "Brake inspection + pad replacement (front)", category: "brake", priceNow: 219, priceWas: 289, expiresInDays: 21 },
    { offer: "4-wheel alignment check", category: "tire", pct: 20, expiresInDays: 14 },
  ],
  "Mount Pleasant Motors": [
    { offer: "AC recharge & leak check", category: "ac", priceNow: 149, priceWas: 199, expiresInDays: 45 },
    { offer: "Full diagnostic scan + report", category: "insp", pct: 30, expiresInDays: 30 },
    { offer: "Synthetic oil change (up to 7L)", category: "oil", priceNow: 89, priceWas: 119, expiresInDays: 30 },
  ],
  "Broadway Tire & Auto": [
    { offer: "Tire rotation + balance (4 tires)", category: "tire", priceNow: 59.99, priceWas: 89.99, expiresInDays: 30 },
    { offer: "Winter-to-summer tire swap + storage", category: "tire", pct: 25, expiresInDays: 21 },
  ],
};

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const user = process.env.REVV_ADMIN_USER;
  const pass = process.env.REVV_ADMIN_PASS;
  if (!user || !pass) {
    console.error("Set REVV_ADMIN_USER and REVV_ADMIN_PASS env vars first.");
    process.exit(1);
  }

  console.log("Signing in as admin…");
  await signIn({ username: user, password: pass });
  console.log("Signed in.\n");

  for (const shopData of SHOPS) {
    const { name, contactPhone, ...rest } = shopData;
    console.log(`Creating shop: ${name}`);

    const { data: shop, errors } = await client.models.Shop.create({
      name,
      contactPhone,
      ...rest,
    } as Parameters<typeof client.models.Shop.create>[0]);

    if (errors?.length || !shop) {
      console.error("  Error:", errors);
      continue;
    }
    console.log(`  Created ${shop.id}`);

    const dealsForShop = DEALS_BY_SHOP[name] ?? [];
    for (const d of dealsForShop) {
      const expiresAt = new Date(Date.now() + d.expiresInDays * 86_400_000).toISOString();
      const { data: deal, errors: de } = await client.models.Deal.create({
        shopId: shop.id,
        offer: d.offer,
        category: d.category as Schema["Deal"]["type"]["category"],
        priceNow: d.priceNow,
        priceWas: d.priceWas,
        pct: d.pct,
        expiresAt,
        active: true,
      });
      if (de?.length || !deal) {
        console.error("  Deal error:", de);
      } else {
        console.log(`  + Deal: ${deal.offer}`);
      }
    }
  }

  await signOut();
  console.log("\nSeed complete.");
}

main().catch(e => { console.error(e); process.exit(1); });
