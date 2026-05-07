# Revv Architecture

Companion + Shop + Admin platform for the BC auto-care market.
Source of truth for stack choices, repo layout, and the data model.

## System overview

Three client surfaces, one backend, one notifications layer.

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Driver PWA    │  │     Shop SPA    │  │   Admin SPA     │
│  (Vite+React)   │  │   (Next.js)     │  │   (Next.js)     │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         │     AppSync GraphQL (typed)             │
         └─────────────┬──────┴────────────────────┘
                       ▼
         ┌────────────────────────────────┐
         │  Amplify Gen 2 backend         │
         │   • Cognito (auth, groups)     │
         │   • DynamoDB (data store)      │
         │   • Lambda (custom resolvers)  │
         │   • S3 (uploads)               │
         └──┬───────────────┬─────────────┘
            │               │
            ▼               ▼
    ┌──────────────┐  ┌──────────────┐
    │ AWS Pinpoint │  │   Twilio     │
    │  (email)     │  │  (SMS+WA)    │
    └──────────────┘  └──────────────┘
```

## Stack

| Concern | Choice | Why |
|---|---|---|
| Repo layout | pnpm workspaces monorepo | Single source of truth for design system + types |
| Driver mobile | PWA (Vite + React + TypeScript) | Ship beta in days; wrap with Capacitor when App Store needed |
| Shop web | Next.js (App Router) | SSR for SEO on public shop pages; same auth as admin |
| Admin web | Next.js (App Router) | Internal tool; reuses shop component patterns |
| Auth | Cognito (Amplify Gen 2) | AWS-native, Cognito groups for role separation |
| API | AppSync (GraphQL) via Amplify Data | Type-safe end to end via codegen |
| Database | DynamoDB | Serverless, scales without ops; chosen explicitly over RDS |
| File uploads | S3 (Amplify Storage) | Receipts, vehicle photos, shop logos |
| Email | AWS Pinpoint / SES | Transactional and campaign |
| SMS + WhatsApp | Twilio | The handshake's primary channel |
| Hosting | Amplify Hosting (apps), Netlify (driver-prototype only) | Amplify for product apps; prototype stays where it is |
| IaC outside Amplify | AWS CDK | For anything Amplify can't express (custom Lambdas, EventBridge, etc.) |

## Repo layout

```
.
├── apps/
│   ├── driver-prototype/    # frozen reference — the original Claude Design mock
│   ├── driver/              # PWA (Vite + React + TS)
│   ├── shop/                # Next.js
│   └── admin/               # Next.js
├── packages/
│   └── design-system/       # CSS tokens + icon library + shared primitives
├── amplify/                 # Amplify Gen 2 backend (auth, data, storage, functions)
├── infra/                   # CDK stacks for non-Amplify infra
├── .github/workflows/       # CI: lint, typecheck, build per app
├── ARCHITECTURE.md          # this doc
├── DEPLOY.md                # how to deploy each surface
└── pnpm-workspace.yaml
```

## Roles and auth

Cognito User Pool with three groups, set on signup or by an admin:

- **`driver`** — owns Vehicles, claims Deals, books Appointments
- **`shop_member`** — works at one or more Shops (joined via `ShopMember`); creates Deals, responds to Claims
- **`admin`** — Revv staff; onboards Shops, audits behaviour

Every API call is authorized by Cognito identity + group membership. Object-level rules (e.g. "you can only see your own Vehicle") are enforced in AppSync resolver auth rules.

## Data model

Core entities. Detailed schema lives in `amplify/data/resource.ts`.

| Entity | Owner | Notes |
|---|---|---|
| `User` | self | Profile extending Cognito identity (name, phone, neighborhood) |
| `Vehicle` | driver | VIN-decoded; one driver can own many |
| `Shop` | platform | Multi-tenant; has many `ShopMember`s |
| `ShopMember` | shop owner | Links Cognito identities to Shops with a role |
| `Deal` | shop | Time-bounded offer; categorised; visible to drivers in radius |
| `Claim` | driver | Lifecycle: `awaiting → contacted → confirmed` (or `expired`) |
| `Appointment` | driver | Booked at a Shop with a service + time slot |
| `ServiceLogEntry` | driver | Auto-logged from Shops or self-logged; per-Vehicle |

## Notifications

| Event | Channel | Sender |
|---|---|---|
| Driver signup verification | Email | Cognito → Pinpoint/SES |
| Deal claimed → shop notified | SMS / WhatsApp | Twilio |
| Shop responds → driver notified | Push (PWA) + SMS fallback | Web Push + Twilio |
| Claim expiring soon | SMS | Twilio |
| Appointment confirmed/cancelled | Email + SMS | Pinpoint + Twilio |

Implementation: a `notifications` Lambda (in `amplify/functions/`) subscribed to AppSync mutations via EventBridge.

## Phases

| Phase | Scope | Estimate |
|---|---|---|
| **1. Foundation** | Monorepo, Amplify scaffold, auth, driver PWA reads/writes vehicles & deals | ~2 weeks |
| **2. Handshake** | Shop app (workbay + claims inbox), real claim lifecycle, Twilio integration | ~3 weeks |
| **3. Admin** | Shop onboarding, deal moderation, claim audit, manual overrides | ~2 weeks |
| **4. Beta hardening** | Observability (CloudWatch + Sentry), error surfaces, support inbox, on-call runbook | ~1 week |
| **5. Beta launch** | 5–10 Vancouver shops, 50–100 drivers, weekly review cadence | ongoing |
| **6. Production** | App Store / Play Store distribution (Capacitor), payments (Stripe?), scale-out | post-beta |

## Open questions

These are deferred until the relevant phase:

- **Payments** — does Revv take a cut, or is it lead-gen only? Affects Stripe integration timing.
- **VIN decode source** — NHTSA free tier is rate-limited; CarMD or similar paid service may be needed at scale.
- **Geo radius** — start with neighborhood string match; switch to PostGIS or DynamoDB GSIs with geohashing once volume justifies it.
- **Shop verification process** — admin-driven manual review at first; automate later.
- **Honor rate calculation** — placeholder field on Shop; needs a metrics pipeline (probably Lambda + DynamoDB streams) once we have signal.
