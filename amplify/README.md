# Amplify Gen 2 backend

Cognito + AppSync (GraphQL) + DynamoDB + S3 for the Revv platform.

## Run a personal sandbox

```bash
cd amplify
npx ampx sandbox
```

This provisions a personal stack in your AWS account and writes
`amplify_outputs.json` to the repo root, which all apps (`apps/driver`,
`apps/shop`, `apps/admin`) read at startup to discover the endpoints.

Stop the sandbox with Ctrl+C; resources are torn down automatically.

## Deploy to staging / prod

Wired through Amplify Hosting in `DEPLOY.md`. The hosting build runs
`ampx pipeline-deploy --branch <branch> --app-id <app>` and deploys backend
+ frontend together.

## Layout

```
amplify/
├── backend.ts          # entrypoint — composes auth + data + storage
├── auth/resource.ts    # Cognito user pool with driver/shop_member/admin groups
├── data/resource.ts    # GraphQL schema + AppSync config
└── storage/resource.ts # S3 bucket with per-entity ACLs
```

## Coming next (Phase 2)

- `functions/notifications/` — Lambda subscribed to Claim mutations; fans out via Twilio + Pinpoint
- `functions/vin-decode/` — wraps NHTSA's free VIN decoder
- `functions/honor-rate/` — periodic Lambda updating Shop.honorRate from Claim history
