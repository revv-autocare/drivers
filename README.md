# Revv

Auto-care platform for British Columbia. Driver companion + shop product + internal admin, on AWS.

```
.
├── apps/
│   ├── driver-prototype/   # frozen Claude Design mock — visual reference
│   ├── driver/             # PWA (Vite + React + TS)
│   ├── shop/               # Next.js — workbay, claims inbox, customers
│   └── admin/              # Next.js — internal staff console
├── packages/
│   └── design-system/      # tokens, icons, shared primitives
├── amplify/                # Amplify Gen 2 backend (auth, data, storage)
├── ARCHITECTURE.md         # stack + data model + phasing
└── DEPLOY.md               # how to run and deploy
```

## Quick start

```bash
nvm use                  # node 20
pnpm install
pnpm amplify:sandbox     # one-time: provisions your personal AWS sandbox
pnpm dev:driver          # http://localhost:5173
```

See `DEPLOY.md` for full setup, environments, and secrets.
See `ARCHITECTURE.md` for stack rationale, data model, and phase plan.

## Status

Phase 1 (foundation) is scaffolded. The driver PWA boots with Cognito auth; backend models for Vehicles, Shops, Deals, Claims, Appointments, and ServiceLog are defined. Next: port the prototype's screens into `apps/driver/` against the real data layer.

## The original handoff

The Claude Design handoff that started this project lives under `apps/driver-prototype/` — the working prototype hosted at https://myvehicu.netlify.app. It's frozen as a visual reference; all new work goes in the production apps.
