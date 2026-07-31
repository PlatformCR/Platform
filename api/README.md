# API (Spring Boot)

Java 17 · Spring Boot 3.4 · profiles `local` (default = **H2**) and `prod` (Postgres).

## Prerequisites

- Java 17+, Maven 3.9+
- **No Docker required** for local (H2)

## Run (local / H2)

```bash
cd api
mvn spring-boot:run
```

| Endpoint | URL |
|----------|-----|
| Health | http://localhost:8080/actuator/health |
| Swagger | http://localhost:8080/swagger-ui.html |
| H2 console | http://localhost:8080/h2-console |
| Login | `POST /api/auth/login` |
| Me | `GET /api/auth/me` (Bearer) |
| Logout | `POST /api/auth/logout` (Bearer) |
| Upload | `POST /api/media/upload` (multipart, Bearer) |

H2 files: `data/h2/` (repo root, gitignored).

### Seed admin

| Field | Value |
|-------|--------|
| Personal ID | `platformadmin` |
| Email | `platformadmin@platform.local` |
| Password | `platformadmin` |

```bash
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"personalId\":\"platformadmin\",\"password\":\"platformadmin\"}"
```

## Profiles

| Profile | Use |
|---------|-----|
| `local` | Default; **H2**; Swagger + H2 console |
| `prod` | Postgres via env; Swagger off |

## Local media

Files under repo `data/uploads/` via `ObjectStorage` (`app.storage.local-path`).
