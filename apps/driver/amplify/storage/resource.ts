import { defineStorage } from "@aws-amplify/backend";

/**
 * S3 bucket for user-uploaded content.
 *
 * Path conventions:
 *   vehicles/{owner}/*  — vehicle photos (private to driver)
 *   receipts/{owner}/*  — service-log receipts (private to driver, readable by shop_member)
 *   shops/{shopId}/*    — shop logos and storefront photos (public read)
 */
export const storage = defineStorage({
  name: "revv-uploads",
  access: (allow) => ({
    "vehicles/{entity_id}/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
      allow.groups(["admin"]).to(["read", "write", "delete"]),
    ],
    "receipts/{entity_id}/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
      allow.groups(["shop_member"]).to(["read"]),
      allow.groups(["admin"]).to(["read", "write", "delete"]),
    ],
    "shops/*": [
      allow.authenticated.to(["read"]),
      allow.groups(["shop_member"]).to(["read", "write"]),
      allow.groups(["admin"]).to(["read", "write", "delete"]),
    ],
  }),
});
