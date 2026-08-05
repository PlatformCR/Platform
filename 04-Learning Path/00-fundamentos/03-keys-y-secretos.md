# 03 — Keys y secretos (la forma correcta)

Si solo aprendés una cosa de seguridad de pagos, que sea esta página.

## Tipos de llaves ONVO


| Llave              | Prefijo típico                | Dónde vive                          | Uso                                                         |
| ------------------ | ----------------------------- | ----------------------------------- | ----------------------------------------------------------- |
| Secret (test)      | `onvo_test_secret_key_…`      | Solo `api/.env`                     | Crear customers, intents, subscriptions, refunds, products… |
| Secret (live)      | `onvo_live_secret_key_…`      | Solo servidor / env de prod         | Igual, con dinero real                                      |
| Publishable (test) | `onvo_test_publishable_key_…` | `web/.env` → `VITE_ONVO_PUBLIC_KEY` | SDK / tokenizar métodos de pago en browser                  |
| Publishable (live) | `onvo_live_publishable_key_…` | Front de producción                 | Igual en live                                               |
| Webhook secret     | (dashboard ONVO)              | Solo `api/.env`                     | Validar header `X-Webhook-Secret`                           |


Auth HTTP hacia ONVO:

```http
Authorization: Bearer onvo_test_secret_key_...
```



## Dónde configurarlas en Platform



### Backend (`api/`)

1. Copiá `api/.env.example` → `api/.env` (gitignored).
2. Agregá:

```env
ONVO_SECRET_KEY=onvo_test_secret_key_...
ONVO_WEBHOOK_SECRET=whsec_or_dashboard_value_...
```

1. En Spring (lo harás en S01): `@ConfigurationProperties` tipo `app.onvo.secret-key` leyendo esas env vars.
2. En **prod** (Render u otro): variables de entorno del hosting, **nunca** en el repo.



### Frontend (`web/`)

```env
VITE_ONVO_PUBLIC_KEY=onvo_test_publishable_key_...
```

Todo lo que empiece con `VITE_` es **visible en el bundle del browser**. Por eso solo publishable.

## Reglas

1. **Nunca** commits de `.env` con keys reales.
2. **Nunca** secret key en React, mobile, Capturas de pantalla de Discord, issues públicos.
3. No mezcles objetos **test** con keys **live** (ni al revés).
4. Rotá keys si se filtraron (dashboard ONVO → regenerar + actualizar env).
5. En logs: no imprimas la key completa (máximo últimos 4 chars para debug).



## Anti-patrones (y por qué duelen)


| Anti-patrón                             | Riesgo                                                     |
| --------------------------------------- | ---------------------------------------------------------- |
| Secret en `VITE_*`                      | Cualquiera la roba del JS y cobra / reembolsa en tu nombre |
| Secret en repo git                      | Historia permanente; hay que rotar + limpiar               |
| Confiar solo en redirect `?paid=1`      | El usuario puede falsificar la URL                         |
| Misma key en laptop de todos en un chat | Filtración + sin auditoría                                 |




## Flujo mental “¿qué key uso?”

```mermaid
flowchart TB
  Q{"¿Dónde corre<br/>este código?"}

  Q -->|Browser / Vite| Pub["Publishable key<br/>VITE_ONVO_PUBLIC_KEY"]
  Q -->|Spring Boot| Sec["Secret key<br/>ONVO_SECRET_KEY"]
  Q -->|Webhook endpoint| Wh["Webhook secret<br/>ONVO_WEBHOOK_SECRET"]

  Pub --> A["Tokenizar tarjeta · SDK"]
  Sec --> B["Customers · Intents · Subs · Refunds"]
  Wh --> C["Validar X-Webhook-Secret"]

  classDef ok fill:#e6ffed,stroke:#2f855a,color:#22543d
  classDef secret fill:#fff5f5,stroke:#c53030,color:#742a2a
  classDef mid fill:#fefcbf,stroke:#b7791f,color:#744210
  class Pub,A ok
  class Sec,Wh secret
  class B,C mid
```



**Nota:** el Bearer de sesión de Platform (`Authorization: Bearer <accessToken>`) **no** es una key ONVO. Es tu sesión de usuario. Ver [09-auth-y-sesiones](09-auth-y-sesiones.md).

## Checklist S00

- [x] Cuenta ONVO sandbox creada
- [x] Keys test copiadas a `api/.env` y `web/.env`
- [x] Verificado que `.env` está en `.gitignore`
- [x] Postman usa `{{secretApiKey}}` de colección, no hardcode en requests compartidos

Siguiente: [04-spring-boot-para-novatos.md](04-spring-boot-para-novatos.md).