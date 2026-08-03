# 05 — HTTP, REST y estados

## REST en una frase

Exponés **recursos** con URLs y usás verbos HTTP con significado.

| Verbo | Uso típico | Ejemplo Platform |
|-------|------------|------------------|
| `GET` | Leer | `GET /api/auth/me` |
| `POST` | Crear / acción | `POST /api/memberships/checkout` |
| `PATCH`/`PUT` | Actualizar | (cuando toque) |
| `DELETE` | Borrar / cancelar | cancelar suscripción |

## Status codes que vas a usar

| Código | Significado | Cuándo |
|--------|-------------|--------|
| `200` | OK | Lectura / update OK |
| `201` | Created | Recurso nuevo |
| `204` | No Content | Logout / delete sin body |
| `400` | Bad Request | Validación / body inválido |
| `401` | Unauthorized | Sin sesión |
| `403` | Forbidden | Sesión OK pero sin permiso |
| `404` | Not Found | Id inexistente |
| `409` | Conflict | Estado inválido (ej. ya active) |
| `502`/`503` | Upstream | ONVO caído / timeout (decidir mapeo) |

Platform tiende a **Problem Details** (`application/problem+json`). Mantenelo.

## Idempotencia (palabra clave de webhooks)

Una operación es **idempotente** si repetirla no duplica efectos.

Ejemplo malo: cada webhook `payment-intent.succeeded` crea otra membresía active.  
Ejemplo bueno: guardás `event_id` procesado; si llega de nuevo, respondés `200` y no hacés nada.

## Estados de negocio vs estados HTTP

- **HTTP 200** solo dice “tu API respondió bien”.
- El **estado del pago** vive en ONVO + tu DB (`pending`, `active`, `past_due`…).

Nunca confundas “el front recibió 200 al crear el intent” con “el dinero se cobró”.

## Contratos: tu API ≠ API ONVO

El front habla con **Platform**:

```http
POST /api/memberships/checkout
Authorization: Bearer <session>
```

Platform habla con **ONVO**:

```http
POST https://api.onvopay.com/v1/subscriptions
Authorization: Bearer onvo_test_secret_key_...
```

El front **no** necesita conocer todos los campos crudos de ONVO. Traducí a DTOs claros.

## Postman en este path

Colección: [`03-ONVO Pay/postman.json`](../../03-ONVO%20Pay/postman.json).

Usala para:

1. Entender el shape real de ONVO.
2. Comparar lo que tu `OnvoClient` envía.
3. Probar sin UI al principio de un spring.

Cuando implementes Platform, también podés crear requests a `localhost:8080/api/...`.

Siguiente: [06-testing-en-plataforma.md](06-testing-en-plataforma.md).
