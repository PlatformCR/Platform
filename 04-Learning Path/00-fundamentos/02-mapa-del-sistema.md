# 02 — Mapa del sistema

## Qué es Platform en este aprendizaje

Platform es un monorepo real:

| Carpeta | Rol |
|---------|-----|
| `api/` | Backend Spring Boot (REST, seguridad, DB, llamadas a ONVO) |
| `web/` | Frontend React (UI, SDK ONVO con publishable key) |
| `03-ONVO Pay/` | Docs y Postman de ONVO |
| `04-Learning Path/` | Esta guía |
| `00-Planning/` | Decisiones de producto (MVP3, membresías) |

## Diagrama de actores

```mermaid
flowchart TB
  subgraph Cliente["Cliente"]
    U["Usuario"]
    W["web · React<br/>Vite :5173"]
  end

  subgraph Platform["Platform"]
    A["api · Spring Boot<br/>:8080"]
    DB[("Postgres / H2<br/>users · sessions · …")]
  end

  subgraph Externos["Externos"]
    G["Google<br/>ID token"]
    O["ONVO API"]
  end

  U --> W
  W -->|"Bearer session"| A
  W -.->|"publishable key · SDK"| O
  W -.->|"GIS credential"| G
  G -.->|"verifica en server"| A
  A -->|"secret key"| O
  A --> DB
  O -->|"webhook firmado"| A

  classDef client fill:#e8f4fc,stroke:#2b6cb0,color:#1a365d
  classDef server fill:#e6ffed,stroke:#2f855a,color:#22543d
  classDef ext fill:#fff5e6,stroke:#c05621,color:#7b341e
  classDef db fill:#faf5ff,stroke:#6b46c1,color:#44337a
  class W,U client
  class A server
  class G,O ext
  class DB db
```

## Separación de responsabilidades

| Pregunta | Quién responde |
|----------|----------------|
| ¿El usuario está logueado en Platform? | `api` (sesiones) + `web` (token) — detalle en [09-auth-y-sesiones](09-auth-y-sesiones.md) |
| ¿Cómo se ve el plan de membresía? | `web` UI + catálogo en `api` DB |
| ¿Dónde vive el número de tarjeta? | **Solo en ONVO** (tokenizado) |
| ¿Se puede cobrar? | `api` con secret key → ONVO |
| ¿La membresía está activa? | `api` DB actualizada por **webhooks** |

## Analogía con lo que ya existe

Hoy ya tenés un patrón igual con Google:

| Hoy (auth) | Mañana (ONVO) |
|------------|---------------|
| `AuthService` | `MembershipService` / `PaymentService` |
| `GoogleTokenVerifier` | `OnvoClient` |
| Session en DB | `payment_customers`, `memberships`, etc. |
| Front manda Google ID token | Front manda `paymentMethodId` / usa SDK |

**Idea clave:** el Controller no habla con Google/ONVO directo; un **adaptador** lo hace.

Tour completo del login ya implementado: [09-auth-y-sesiones.md](09-auth-y-sesiones.md).

## Flujo mental de un cobro (vista de capas)

```mermaid
sequenceDiagram
  autonumber
  participant U as Usuario
  participant W as Web
  participant A as PlatformAPI
  participant O as ONVO
  participant D as DB

  U->>W: Quiere pagar
  W->>A: POST checkout autenticado
  A->>D: Crea registro pending
  A->>O: Crea PaymentIntent o Subscription
  A-->>W: Datos para SDK o redirect
  W->>O: Confirma / completa pago
  O-->>A: Webhook succeeded
  A->>D: Marca paid o active
  A-->>U: Acceso concedido
```

## Qué NO hace el frontend

- No guarda `ONVO_SECRET_KEY`.
- No decide solo “el usuario pagó, dale acceso premium”.
- No llama endpoints secretos de ONVO que requieren server key (crear intents, refunds, etc.), salvo lo que el SDK documente con publishable key.

Cuando entiendas este mapa, pasá a [03-keys-y-secretos.md](03-keys-y-secretos.md).
