# Platform

Base for web systems: **Java / Spring Boot** (`api/`) + **React** (`web/`) + **H2 locally** / **PostgreSQL** in cloud.

## How to run

**→ [01-Project Instructions/HOW-TO-RUN.md](01-Project%20Instructions/HOW-TO-RUN.md)**

Google SSO (Cloud Console): **[GOOGLE-SSO-SETUP.md](01-Project%20Instructions/GOOGLE-SSO-SETUP.md)**

Local default: **H2** (no Docker). Then `api` + `web`.

## Docs / plans

- [`00-Planning/`](00-Planning/) — plans ([MVP1.md](00-Planning/MVP1.md), [MVP2.md](00-Planning/MVP2.md))
- [`01-Project Instructions/`](01-Project%20Instructions/) — how to run

## Layout

```
Platform/
  00-Planning/
  01-Project Instructions/
  api/
  web/
  data/uploads/
  data/h2/                 # local H2 (gitignored)
  docker-compose.yml       # optional Postgres
  README.md
```

## Status

**MVP1 complete.** Local runs on H2 by default.  
**MVP2 phase A (planned):** user registration + Google SSO — [MVP2.md](00-Planning/MVP2.md).
