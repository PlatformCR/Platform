# Web (React + Vite + TypeScript)

## Prerequisites

- API running on http://localhost:8080 (see [`../api/README.md`](../api/README.md))
- Node.js 20+ and npm

## Run (local)

```bash
cd web
npm install
npm run dev
```

App: **http://localhost:5173**

API URL is set in `.env`:

```env
VITE_API_URL=http://localhost:8080
```

Vite also proxies `/api` to the backend when you use relative paths.

## Routes

| Path | Description |
|------|-------------|
| `/login` | Sign in (Personal ID or email + password) |
| `/home` | Protected blank home inside app shell |
| `/` | Redirects to `/home` or `/login` by token |

## Seed credentials

Use the same admin as the API: `platformadmin` / `platformadmin`

## Build

```bash
npm run build
```
