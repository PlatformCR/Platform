# How to run the project (local)

Local MVP1 stack: **H2 (default)** + **Spring Boot API** + **React (Vite)**.

Postgres via Docker is **optional** (for later / prod-like testing). You do **not** need Docker to run locally.

## Prerequisites

| Tool | Check |
|------|--------|
| Java 17+ | `java -version` |
| Maven 3.9+ | `mvn -version` |
| Node.js 20+ (npm) | `node -v` / `npm -v` |
| Docker Desktop | Optional (only if you want Postgres instead of H2) |

## Layout (relevant folders)

```
Platform/
  00-Planning/
  01-Project Instructions/  # This guide
  api/
  web/
  data/uploads/             # Local media
  data/h2/                  # Local H2 DB files (gitignored)
  docker-compose.yml        # Optional Postgres
```

---

## Step 1 — Start the API (H2 by default)

No database install required. Profile `local` uses an **H2 file** database under `data/h2/`.

```bash
cd api
mvn spring-boot:run
```

| Check | URL |
|-------|-----|
| Health | http://localhost:8080/actuator/health |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| H2 console | http://localhost:8080/h2-console |

**H2 console JDBC URL** (if you open the console):

```text
jdbc:h2:file:./../data/h2/platform;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DEFAULT_NULL_ORDERING=HIGH;AUTO_SERVER=TRUE
```

User: `sa` · Password: *(empty)*

If **port 8080 is already in use**, stop the other process and start again.

More API detail: [`api/README.md`](../api/README.md).

---

## Step 2 — Start the web app

In a **new** terminal:

```bash
cd web
npm install
npm run dev
```

| Check | URL |
|-------|-----|
| App | http://localhost:5173 |

API base URL: `VITE_API_URL` in `web/.env` (default `http://localhost:8080`).

More web detail: [`web/README.md`](../web/README.md).

---

## Step 3 — Sign in

1. Open http://localhost:5173  
2. Use the login form, **Create account**, or **Continue with Google** (if configured)

| Field | Value |
|-------|--------|
| Personal ID **or** email | `platformadmin` **or** `platformadmin@platform.local` |
| Password | `platformadmin` |

### Google Sign-In (optional)

1. Follow **[GOOGLE-SSO-SETUP.md](GOOGLE-SSO-SETUP.md)** and copy your Client ID.  
2. API (env when starting Maven / IDE):

```bash
export GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

3. Web — copy `web/.env.example` to `web/.env.local` and set:

```bash
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

4. Restart Vite after changing env. Only Google **test users** can sign in while the OAuth app is in Testing.

After sign in you reach **/home** (blank content inside header / sidebar / footer).

---

## Optional — API smoke test (curl)

```bash
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"personalId\":\"platformadmin\",\"password\":\"platformadmin\"}"
```

Register:

```bash
curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"personalId\":\"demo1\",\"email\":\"demo1@example.com\",\"password\":\"Password123!\",\"confirmPassword\":\"Password123!\"}"
```

Useful endpoints after login (Bearer token):

- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/auth/oauth/google` — `{ "idToken": "..." }`
- `POST /api/media/upload` (multipart)

---

## Profiles (API)

| Profile | Database | Notes |
|---------|----------|--------|
| `local` (default) | **H2 file** | Swagger + H2 console on; no Docker |
| `prod` | Postgres (Neon/etc.) | Env vars; Swagger off |

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### Optional: Postgres with Docker

Only if you want Postgres locally instead of H2 (not the default):

```bash
docker compose up -d
```

Then you would need a dedicated profile (e.g. point datasource at `localhost:5432`) — by default **`local` stays on H2**.

---

## Related guides

| Guide | Topic |
|-------|--------|
| [GOOGLE-SSO-SETUP.md](GOOGLE-SSO-SETUP.md) | Google Cloud project, OAuth consent screen, Web client ID (SSO) |

---

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| Port 8080 in use | Stop the old Spring Boot / Java process |
| Web cannot call API | Confirm API is up; check `web/.env`; CORS allows `http://localhost:5173` |
| Login fails | Use seed credentials; check API logs (Flyway + `DataSeeder` on first start) |
| Want a clean local DB | Stop the API, delete `data/h2/`, start again (Flyway + seeder recreate schema/admin) |
