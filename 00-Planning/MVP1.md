# MVP1

Folder: [`00-Planning/`](../00-Planning/) (first in the repo). Topic details live in `01`–`06`.

**GitHub:** [Project board](https://github.com/users/PlatformCR/projects/1) · [Milestone MVP1](https://github.com/PlatformCR/Platform/milestone/1)

**How to read this file (top → bottom):**

1. Scope — what MVP1 includes / excludes  
2. Work order — steps in sequence  
3. Checklist — same order; mark done as we go  
4. What Flyway is  
5. Link to how to run (Project Instructions)  
6. Topic docs  
7. Next steps — moved to [MVP2.md](MVP2.md)

---

## 1. Scope

### In

- Monorepo `api/` + `web/` + local Postgres Docker; cloud targets Neon / Render / Vercel
- User: `personal_id`, `email`, `password`
- Login with personal ID or email + password
- Tokens + DB sessions (one per user, 24h or logout)
- RBAC: roles/permissions + Spring authorities; seed `ADMIN` / `USER`; `/me` returns roles + permissions
- springdoc OpenAPI / Swagger (Postman via `/v3/api-docs`)
- Responsive web: header + sidebar (drawer mobile) + footer (Platform + client)
- Protected blank `/home`; English UI
- Local media: `data/uploads/` + `ObjectStorage` (Cloudflare R2 later)

### Out (see [MVP2.md](MVP2.md))

- SSO, public registration, forgot password
- Admin GUI for roles/permissions
- i18n, rich homepage, landing kit implementation
- Cloudflare R2 + presigned uploads in cloud
- HttpOnly cookies / refresh-token hardening

---

## 2. Work order

| Step | What | Status |
|------|------|--------|
| 1 | Repo structure + `docker-compose.yml` + README + `data/uploads` gitignore | **done** |
| 2 | API skeleton: Maven, profiles `local`/`prod`, health, Swagger on local | **done** |
| 3 | Flyway migrations: `users`, `sessions`, roles/permissions + seed | **done** |
| 4 | Login / logout / me + single session + authorities | **done** |
| 5 | Local `ObjectStorage` + minimal media endpoints (dev) | **done** |
| 6 | Web: login + app shell + blank home | **done** |
| 7 | Wire protected routes end-to-end | **done** |

---

## 3. Checklist (same order as work order)

### Step 1 — Repo / infra
- [x] Folders `api/`, `web/` + root README
- [x] `docker-compose.yml` (Postgres 16)
- [x] `data/uploads/` + gitignore for local media
- [x] Topic plans `01`–`06` + this MVP1 file
- [x] Local media approach documented

### Step 2 — API skeleton
- [x] Maven `api/` project (Spring Boot 3.4, Java 17)
- [x] Dependencies in `pom.xml`
- [x] Profiles `local` / `prod`
- [x] Actuator health
- [x] Security filter chain
- [x] Swagger / OpenAPI on `local` only
- [x] CORS to Vite `http://localhost:5173`

### Step 3 — Database (Flyway)
- [x] Table `users`
- [x] Table `sessions`
- [x] Tables `roles`, `permissions`, `role_permissions`, `user_roles`
- [x] Seed roles/permissions + admin user via `DataSeeder` (BCrypt)
- [x] Table `assets`
- [x] DataSource / JPA / Flyway enabled on `local`

### Step 4 — Auth API
- [x] `POST /api/auth/login`
- [x] `POST /api/auth/logout`
- [x] `GET /api/auth/me` (user + roles + permissions)
- [x] Single session, 24h, opaque token + `token_hash` (SHA-256)
- [x] Spring Security + DB authorities

### Step 5 — Local media
- [x] `ObjectStorage` local + upload/serve for dev
- [x] Table `assets` (metadata)

### Steps 6–7 — Web
- [x] `/login` + Bearer auth client
- [x] Shell: header + sidebar (drawer) + footer
- [x] `/home` blank protected
- [x] Protected routes / redirects

---

## 4. What is Flyway?

**Flyway** versions the database schema with SQL scripts under `api/src/main/resources/db/migration/`. On startup it applies new scripts and records them in `flyway_schema_history`.

---

## 5. How to run

See **[01-Project Instructions/HOW-TO-RUN.md](../01-Project%20Instructions/HOW-TO-RUN.md)** (not documented here).

### Key paths

| Area | Path |
|------|------|
| Migrations | `api/src/main/resources/db/migration/` |
| Auth API | `api/src/main/java/com/platform/api/auth/` |
| Security | `api/src/main/java/com/platform/api/security/` |
| Media | `api/src/main/java/com/platform/api/media/` |
| Web app | `web/src/` |

---

## 6. Topic docs

[01-general.md](01-general.md) · [02-springboot.md](02-springboot.md) · [03-security.md](03-security.md) · [04-frontend.md](04-frontend.md) · [05-landing-pages.md](05-landing-pages.md) · [06-api-optimization.md](06-api-optimization.md)

---

## 7. Next steps

Moved to **[MVP2.md](MVP2.md)**.

- **Phase A (start now):** user registration + Google SSO  
- **Backlog:** remaining items (email verify, forgot password, roles GUI, theme, i18n, R2, …) live in MVP2 §6
