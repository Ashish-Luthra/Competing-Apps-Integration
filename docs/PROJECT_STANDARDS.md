## UI Specs (Desktop)
- Frame width: `1440px`
- Left nav reserve: `240px` expanded, `80px` collapsed
- Page gutter: `24px`
- Page padding (top/bottom): `32px`
- Content max width: `1120px`

## Env Usage (No hardcoding)
- Do not hardcode API base URLs, paths, or ports in code.
- All API endpoints must be composed from env vars.
- Keep a `.env.example` with required keys and defaults for local use.
- Update `docs/API_SPEC.md` when endpoints change.

## Mock Server
- Use env-driven paths and port.
- Provide `npm run mock:server` in `package.json`.
