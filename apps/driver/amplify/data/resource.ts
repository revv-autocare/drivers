import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * Revv data model.
 *
 * Authorization summary:
 *  - Drivers own their UserProfile, Vehicle, Claim, Appointment, ServiceLogEntry.
 *  - Shops and Deals are owned by shop_member group; readable by all signed-in
 *    drivers (so they can browse).
 *  - Admin group has read/write on everything.
 *
 * This is the Phase 1 schema. Subscriptions, custom resolvers, and per-row
 * fine-grained rules (e.g. "shop_member can only mutate their own Shop") are
 * added in Phase 2 alongside the shop app.
 */
const schema = a.schema({
  // ── User profile (extends Cognito identity) ────────────────────────
  UserProfile: a
    .model({
      owner: a.string(), // Cognito sub
      email: a.string().required(),
      name: a.string(),
      phone: a.string(),
      neighborhood: a.string(),
      vehicles: a.hasMany("Vehicle", "ownerId"),
      claims: a.hasMany("Claim", "ownerId"),
      appointments: a.hasMany("Appointment", "ownerId"),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.group("admin"),
    ]),

  // ── Vehicle ────────────────────────────────────────────────────────
  Vehicle: a
    .model({
      ownerId: a.id().required(),
      owner: a.belongsTo("UserProfile", "ownerId"),
      vin: a.string().required(),
      year: a.integer(),
      make: a.string(),
      model: a.string(),
      engine: a.string(),
      plate: a.string(),
      mileage: a.integer(),
      photoKey: a.string(), // S3 key for vehicle photo
      serviceLog: a.hasMany("ServiceLogEntry", "vehicleId"),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.group("admin"),
      allow.group("shop_member").to(["read"]),
    ])
    .secondaryIndexes((index) => [index("vin")]),

  // ── Shop (multi-tenant) ────────────────────────────────────────────
  Shop: a
    .model({
      name: a.string().required(),
      neighborhood: a.string(),
      address: a.string(),
      lat: a.float(),
      lng: a.float(),
      hours: a.string(),
      specialties: a.string().array(),
      logoKey: a.string(),
      logoColor: a.string(),
      verified: a.boolean().default(false),
      honorRate: a.integer(),
      rating: a.float(),
      reviewsCount: a.integer(),
      members: a.hasMany("ShopMember", "shopId"),
      deals: a.hasMany("Deal", "shopId"),
      appointments: a.hasMany("Appointment", "shopId"),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]), // any signed-in driver can browse
      allow.group("shop_member"),
      allow.group("admin"),
    ]),

  // ── Shop membership (links Cognito identities to Shops) ────────────
  ShopMember: a
    .model({
      shopId: a.id().required(),
      shop: a.belongsTo("Shop", "shopId"),
      userSub: a.string().required(), // Cognito sub
      role: a.enum(["owner", "advisor", "tech"]),
    })
    .authorization((allow) => [
      allow.group("shop_member"),
      allow.group("admin"),
    ])
    .secondaryIndexes((index) => [index("userSub")]),

  // ── Deal (offer published by a Shop) ───────────────────────────────
  Deal: a
    .model({
      shopId: a.id().required(),
      shop: a.belongsTo("Shop", "shopId"),
      category: a.enum(["oil", "brake", "tire", "ac", "insp", "detail", "other"]),
      categoryLabel: a.string(),
      offer: a.string().required(),
      priceNow: a.float(),
      priceWas: a.float(),
      pct: a.integer(),
      expiresAt: a.datetime(),
      active: a.boolean().default(true),
      claims: a.hasMany("Claim", "dealId"),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.group("shop_member"),
      allow.group("admin"),
    ]),

  // ── Claim (driver claims a Deal; shop has 24h to respond) ──────────
  Claim: a
    .model({
      ownerId: a.id().required(),
      owner: a.belongsTo("UserProfile", "ownerId"),
      dealId: a.id().required(),
      deal: a.belongsTo("Deal", "dealId"),
      shopId: a.id(),
      status: a.enum(["awaiting", "contacted", "confirmed", "expired", "cancelled"]),
      claimedAt: a.datetime().required(),
      contactedAt: a.datetime(),
      confirmedAt: a.datetime(),
      expiredAt: a.datetime(),
      cancelledAt: a.datetime(),
      notes: a.string(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.group("shop_member").to(["read", "update"]), // shop responds
      allow.group("admin"),
    ])
    .secondaryIndexes((index) => [
      index("shopId").sortKeys(["status"]),
      index("dealId").sortKeys(["claimedAt"]),
    ]),

  // ── Appointment (booked time slot at a Shop) ───────────────────────
  Appointment: a
    .model({
      ownerId: a.id().required(),
      owner: a.belongsTo("UserProfile", "ownerId"),
      shopId: a.id().required(),
      shop: a.belongsTo("Shop", "shopId"),
      vehicleId: a.id(),
      service: a.string().required(),
      date: a.date().required(),
      time: a.string().required(), // HH:mm or "9:30 am"
      notes: a.string(),
      status: a.enum(["pending", "confirmed", "completed", "cancelled", "no_show"]),
      bookedAt: a.datetime().required(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.group("shop_member").to(["read", "update"]),
      allow.group("admin"),
    ])
    .secondaryIndexes((index) => [
      index("shopId").sortKeys(["date"]),
    ]),

  // ── Service log (per Vehicle) ──────────────────────────────────────
  ServiceLogEntry: a
    .model({
      vehicleId: a.id().required(),
      vehicle: a.belongsTo("Vehicle", "vehicleId"),
      shopId: a.id(), // null when self-logged
      date: a.date().required(),
      mileage: a.integer(),
      what: a.string().required(),
      cost: a.float(),
      category: a.string(),
      notes: a.string(),
      via: a.enum(["auto", "manual"]),
      receiptKey: a.string(), // S3 key for receipt photo/PDF
    })
    .authorization((allow) => [
      allow.owner().to(["create", "read", "update", "delete"]),
      allow.group("shop_member").to(["create", "read"]),
      allow.group("admin"),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
