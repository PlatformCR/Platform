# ONVO Pay — documentation (cached)

Official human docs: **[https://docs.onvopay.com/](https://docs.onvopay.com/)**

This folder holds ONVO’s AI-oriented Markdown dumps so agents and the team can implement payments/memberships without depending on a live fetch.

## How to use these files

1. Start with **[llms.txt](llms.txt)** — short index of guides and API pages (what to read for a given task).
2. For full detail, use **[llms-full.md](llms-full.md)** — concatenated docs (auth, payment intents, subscriptions, SDK, webhooks, OpenAPI summary, etc.).
3. Prefer live pages when something may have changed: [docs.onvopay.com](https://docs.onvopay.com/), [llms.txt](https://docs.onvopay.com/llms.txt), [llms-full.txt](https://docs.onvopay.com/llms-full.txt), [openapi.yaml](https://docs.onvopay.com/openapi.yaml).
4. Import **[postman.json](postman.json)** into Postman to try the API. Set collection variables `secretApiKey` / `publishableApiKey`. Regenerate with `python generate_postman.py` after refreshing `openapi.yaml`.

## Relation to Platform

- Planning / provider choice: [../00-Planning/07-payments-memberships.md](../00-Planning/07-payments-memberships.md)
- MVP3: [../00-Planning/MVP3.md](../00-Planning/MVP3.md)

## Secrets

Do **not** put API keys here. Use env vars only (`onvo_test_…` / `onvo_live_…` public + secret + webhook secret). See Platform `.env.example` patterns when wiring phase B.
