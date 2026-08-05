# 09 — Auth y sesiones (lo que ya existe)

Auth de Platform **ya está implementado** (MVP1 + Google SSO). Esta página no te pide codearlo de cero: te pide **entenderlo**, porque es el mismo patrón mental que vas a repetir con ONVO.

Spec canónica (inglés): [00-Planning/03-security.md](../../00-Planning/03-security.md).  
Setup Google: [GOOGLE-SSO-SETUP.md](../../01-Project%20Instructions/GOOGLE-SSO-SETUP.md).

---

## Idea clave

| Hoy (auth) | Mañana (ONVO) |
|------------|---------------|
| `AuthService` | `MembershipService` / `PaymentService` |
| `GoogleTokenVerifier` | `OnvoClient` |
| Session en DB (`sessions`) | `payment_customers`, `memberships`, … |
| Front manda password o Google ID token | Front manda `paymentMethodId` / usa SDK |

**El Controller no habla con Google/ONVO directo; un adaptador lo hace.** El token de sesión de Platform es **opaco** (random bytes), no un JWT “solo client-side”: el servidor guarda el **hash** y puede revocar.

---

## Endpoints

| Método | Path | Auth | Qué hace |
|--------|------|------|----------|
| `POST` | `/api/auth/login` | público | Password → sesión |
| `POST` | `/api/auth/register` | público | Alta USER + auto-login |
| `POST` | `/api/auth/oauth/google` | público | ID token Google → sesión |
| `POST` | `/api/auth/logout` | Bearer | Revoca sesión |
| `GET` | `/api/auth/me` | Bearer | Usuario + roles + permissions |

Respuesta típica de login/register/Google: `{ accessToken, user }`.

---

## Diagrama de capas

```mermaid
flowchart TB
  subgraph Cliente["Cliente"]
    U["Usuario"]
    W["web · LoginPage / RegisterPage<br/>AuthProvider · ProtectedRoute"]
  end

  subgraph API["api Spring Boot"]
    C["AuthController"]
    S["AuthService"]
    G["GoogleTokenVerifier"]
    F["JwtOrSessionAuthenticationFilter"]
    T["TokenService"]
  end

  subgraph Datos["DB"]
    DB[("users · sessions<br/>roles · permissions")]
  end

  subgraph Ext["Externo"]
    GIS["Google Identity Services"]
  end

  U --> W
  W -->|"POST login / register / oauth"| C
  C --> S
  S --> G
  G -.->|"verifica ID token"| GIS
  W -.->|"GIS credential"| GIS
  S --> T
  S --> DB
  W -->|"Bearer en cada request"| F
  F -->|"hash → sesión activa"| DB
  F --> C

  classDef client fill:#e8f4fc,stroke:#2b6cb0,color:#1a365d
  classDef server fill:#e6ffed,stroke:#2f855a,color:#22543d
  classDef db fill:#faf5ff,stroke:#6b46c1,color:#44337a
  classDef ext fill:#fff5e6,stroke:#c05621,color:#7b341e
  class W,U client
  class C,S,G,F,T server
  class DB db
  class GIS ext
```

---

## Flujo password (secuencia)

```mermaid
sequenceDiagram
  autonumber
  actor U as Usuario
  participant W as web
  participant C as AuthController
  participant S as AuthService
  participant DB as DB

  U->>W: personalId/email + password
  W->>C: POST /api/auth/login
  C->>S: login(...)
  S->>DB: buscar user + BCrypt
  S->>DB: revoke otras sesiones del user
  S->>DB: INSERT session token_hash TTL 24h
  S-->>W: accessToken + user
  Note over W: localStorage key platform.accessToken
  W->>C: requests con Authorization Bearer
  Note over C: Filter hashea token y busca sesión activa
```

### Reglas de sesión

1. **Una sesión activa por user** — un login nuevo revoca las anteriores.
2. **TTL 24 h** (`app.session.ttl-hours`) o logout inmediato.
3. En DB solo `token_hash` (SHA-256). El token crudo viaja al cliente una vez.
4. El filtro se llama `JwtOrSessionAuthenticationFilter`, pero hoy valida **tokens opacos de sesión**, no JWT firmados.

---

## Flujo Google SSO

```mermaid
sequenceDiagram
  autonumber
  actor U as Usuario
  participant W as web GIS
  participant C as AuthController
  participant V as GoogleTokenVerifier
  participant S as AuthService
  participant DB as DB

  U->>W: Click / One Tap Google
  W->>C: POST /api/auth/oauth/google idToken
  C->>S: loginWithGoogle
  S->>V: verify audience + email_verified
  V-->>S: email, sub, name, picture
  S->>DB: por google_sub / email / crear user
  S->>DB: issueSession igual que password
  S-->>W: accessToken + user
```

- Cuenta solo-Google: `password_hash` null → no puede usar login password hasta “set password” (aún no implementado).
- Tras logout, el front marca skip de auto-login Google para no reabrir One Tap al toque.

---

## Tour de archivos (leé en este orden)

### Backend (`api/`)

| Orden | Archivo | Qué mirar |
|-------|---------|-----------|
| 1 | `auth/AuthController.java` | Rutas públicas vs Bearer |
| 2 | `auth/AuthService.java` | `login`, `register`, `loginWithGoogle`, **`issueSession`** |
| 3 | `auth/GoogleTokenVerifier.java` | Audience = `GOOGLE_CLIENT_ID` |
| 4 | `auth/Session.java` + `SessionRepository` | `tokenHash`, `expiresAt`, `revokedAt` |
| 5 | `security/JwtOrSessionAuthenticationFilter.java` | Bearer → hash → SecurityContext |
| 6 | `security/TokenService.java` | Generar opaco + SHA-256 |
| 7 | `config/SecurityConfig.java` | Allowlist: login, register, oauth, health, swagger… |

Migraciones útiles: `V1__init_schema.sql` (users/sessions), `V3__google_sso.sql`.

### Frontend (`web/`)

| Orden | Archivo | Qué mirar |
|-------|---------|-----------|
| 1 | `pages/LoginPage.tsx` / `RegisterPage.tsx` | Form + Google button |
| 2 | `auth/AuthContext.tsx` | Bootstrap con `/me`, store token |
| 3 | `api/client.ts` | `platform.accessToken`, `apiFetch` + Bearer |
| 4 | `auth/ProtectedRoute.tsx` | Sin token → `/login` |
| 5 | `ui/GoogleSignInButton.tsx` + `ui/googleIdentity.ts` | GIS |

Env: `VITE_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_ID` (api), `VITE_API_URL`.

---

## Qué falta (no lo inventés en S00)

Planeado / fuera de alcance actual:

- Email verification, forgot/reset password, set-password para Google-only
- HttpOnly cookies / refresh tokens
- Rate limit en endpoints públicos de auth
- Otros IdPs

Cuando cobres membresías, vas a **extender** `/me` (ej. bloque `membership` en S07), no reemplazar este modelo.

---

## Teach-back (cerrá esta lectura)

Sin mirar el código, respondé:

1. ¿Por qué guardamos `token_hash` y no el token crudo en DB?
2. ¿Quién valida el Google ID token: el browser o Spring?
3. ¿Qué pasa con las otras sesiones cuando hacés login de nuevo?
4. Analogía: `GoogleTokenVerifier` es a Google lo que `OnvoClient` será a ONVO — ¿dónde vive cada uno?

Si fallás 2+, releé `AuthService.issueSession` y el Filter. Luego S00 sesión 2/2 te pide caminar el flujo en runtime.

**Siguiente en fundamentos:** [05-http-rest-y-estados.md](05-http-rest-y-estados.md) (si venís de Spring) o [S00](../springs/S00-laboratorio-y-keys.md) cuando Fase 0 esté lista.
