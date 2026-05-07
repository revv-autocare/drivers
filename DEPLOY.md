# Deployment

How to run this stack locally and deploy each surface to AWS.

## Prerequisites

- Node.js 20.x (`nvm use` reads `.nvmrc`)
- pnpm 9.x — `npm install -g pnpm`
- AWS account with admin or AmplifyAdminAccess
- AWS CLI configured (`aws configure --profile revv`)
- Amplify CLI Gen 2: `npm install -g @aws-amplify/backend-cli`
- A Twilio account with a verified BC number (for SMS)
- A Twilio WhatsApp Business sender (request through Twilio console)

## Local dev

From the repo root:

```bash
pnpm install                # install all workspaces
pnpm dev:driver             # run driver PWA on http://localhost:5173
pnpm dev:shop               # run shop on http://localhost:3000
pnpm dev:admin              # run admin on http://localhost:3001
```

Backend (sandbox stack — your personal cloud env, isolated from prod):

```bash
cd amplify
npx ampx sandbox            # provisions a personal AWS sandbox; outputs amplify_outputs.json
```

Each app reads `amplify_outputs.json` from the repo root and connects to your sandbox automatically.

## Environments

| Env | Branch | AWS | Notes |
|---|---|---|---|
| `sandbox` | per-developer | personal AWS profile | `npx ampx sandbox` |
| `staging` | `staging` | shared AWS account | auto-deployed on push |
| `production` | `main` | prod AWS account | auto-deployed on push |

## Deploy: backend (Amplify Gen 2)

Connect the repo to Amplify Hosting once per environment:

1. AWS Console → Amplify → Create new app → Host web app → GitHub → pick `revv-autocare/drivers`
2. Pick branch (`main` for prod, `staging` for staging)
3. Amplify auto-detects `amplify/` and provisions: Cognito, AppSync, DynamoDB, S3
4. After first deploy, the build step writes `amplify_outputs.json` into the per-app `dist/`
5. Add secrets via Amplify Console → Backend env → Secret manager:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_FROM_NUMBER` (e.g. `+16045550199`)
   - `TWILIO_WA_FROM` (e.g. `whatsapp:+14155238886`)

## Deploy: driver PWA

Amplify Hosting builds `apps/driver/` automatically once configured:

- Build command: `pnpm install --frozen-lockfile && pnpm --filter driver build`
- Output dir: `apps/driver/dist`
- Headers: add `Service-Worker-Allowed: /` for PWA scope
- Custom domain: `app.revv.ca` (or whichever)

## Deploy: shop & admin

Each as a separate Amplify Hosting app pointing at the same repo, with build commands:

- Shop: `pnpm --filter shop build` → `apps/shop/.next`
- Admin: `pnpm --filter admin build` → `apps/admin/.next`

## Deploy: driver-prototype (legacy reference)

The original Claude Design mock continues to live on Netlify at `myvehicu.netlify.app`.

**After the move to `apps/driver-prototype/`, update Netlify base directory** in the site's Build & deploy settings:
- Base directory: `apps/driver-prototype`
- Publish directory: `apps/driver-prototype`

Otherwise the next build will fail with "publish directory not found".

## Domains

| Surface | Suggested host | Notes |
|---|---|---|
| Driver PWA | `app.revv.ca` | install-to-home-screen target |
| Shop | `shop.revv.ca` | service-advisor login |
| Admin | `admin.revv.ca` | Revv staff only; consider IP-allowlist or VPN |
| Marketing | `revv.ca` | not in scope of this repo |

## Secrets

Never commit secrets. Use:

- **Amplify**: secret manager per branch (above)
- **Local dev**: `.env.local` per app, gitignored. Template files: `apps/*/env.example`
- **CI**: GitHub Actions secrets, surfaced as env vars in workflows

## Rollback

Amplify keeps a deploy history per branch. Roll back via Console → Amplify → app → Hosting → pick a prior deploy → Redeploy this version.

For backend rollback (schema changes that broke prod), revert the offending commit on `main` and let Amplify re-deploy. Data migrations need a separate forward-only plan — never ship a destructive schema change without a migration Lambda.
