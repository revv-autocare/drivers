# Driver PWA

Vite + React + TypeScript. Port target for the screens currently mocked in `apps/driver-prototype/`.

## Run

```bash
# from repo root, after `pnpm install`:
pnpm dev:driver
```

Requires `amplify_outputs.json` at the repo root — generate it by running `pnpm amplify:sandbox` once. Without it, the app will fail to start.

## Status

Phase 1 placeholder. Currently shows the Amplify Authenticator and a stub home screen.

Roadmap (this app):

- [x] Auth gate via Cognito (Amplify Authenticator)
- [ ] Port `WelcomeScreen` and `VinOnboardingScreen` from prototype
- [ ] Wire VIN decode to NHTSA API via Amplify function
- [ ] Port `HomeScreen`, `DealsScreen`, `ClaimsScreen`, `ProfileScreen`
- [ ] Real-time claim status updates (AppSync subscriptions)
- [ ] Service worker / offline support audit
