# Platform

Base for web systems: **Java / Spring Boot** (`api/`) + **React** (`web/`) + **H2 locally** / **PostgreSQL** in cloud.

## How to run

**→ [01-Project Instructions/HOW-TO-RUN.md](01-Project%20Instructions/HOW-TO-RUN.md)**

Google SSO (Cloud Console): **[GOOGLE-SSO-SETUP.md](01-Project%20Instructions/GOOGLE-SSO-SETUP.md)**

Local default: **H2** (no Docker). Then `api` + `web`.

## Docs / plans

- [`00-Planning/`](00-Planning/) — plans ([MVP1.md](00-Planning/MVP1.md), [MVP2.md](00-Planning/MVP2.md), [MVP3.md](00-Planning/MVP3.md), [MVP3-IMPLEMENTATION.md](00-Planning/MVP3-IMPLEMENTATION.md), [07-payments-memberships.md](00-Planning/07-payments-memberships.md))
- [`01-Project Instructions/`](01-Project%20Instructions/) — how to run
- [`03-ONVO Pay/`](03-ONVO%20Pay/) — ONVO docs cache ([llms.txt](03-ONVO%20Pay/llms.txt), [llms-full.md](03-ONVO%20Pay/llms-full.md)); live: [docs.onvopay.com](https://docs.onvopay.com/)

## Layout

```
Platform/
  00-Planning/
  01-Project Instructions/
  03-ONVO Pay/             # ONVO Pay official docs (cached)
  api/
  web/
  data/uploads/
  data/h2/                 # local H2 (gitignored)
  docker-compose.yml       # optional Postgres
  README.md
```

## Status

**MVP1 complete.** Local runs on H2 by default.  
**MVP2 phase A complete:** registration + Google SSO — [MVP2.md](00-Planning/MVP2.md).  
**MVP3 (planning):** payments provider + memberships design; backlog moved from MVP2 — [MVP3.md](00-Planning/MVP3.md).
