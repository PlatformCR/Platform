# Glosario

Términos que vas a ver una y otra vez. Si no entendés una palabra en un spring, volvé acá.

## ONVO / pagos

| Término | Significado simple |
|---------|-------------------|
| **Customer (Cliente)** | Quién paga en ONVO (persona/empresa). Tiene email, métodos de pago, intents, suscripciones. |
| **Payment Method** | Instrumento tokenizado (tarjeta, cuenta bancaria). **No** es el número de tarjeta en tu DB. |
| **Payment Intent** | Un intento de cobro por un monto. Ciclo: crear → confirmar → (capturar) → éxito/fallo. |
| **Checkout Session** | Página/link de pago hospedado por ONVO (delegás la UX de cobro). |
| **Product** | Qué vendés en el catálogo ONVO (ej. “Membresía Platform”). |
| **Price** | Cuánto cuesta un Product: monto, moneda, one-time o recurring. |
| **Subscription / Cargo recurrente** | Cobro periódico atado a un customer + price + payment method. |
| **Renovación (Invoice)** | Un período de cobro de una suscripción (cada mes/año genera una). |
| **Refund** | Devolver total o parcialmente un cobro exitoso. |
| **Webhook** | HTTP POST que ONVO te manda cuando algo pasó (pagó, falló, renovó). |
| **Publishable key** | Llave pública (`onvo_test_publishable_key_…`). Segura para el browser / SDK. |
| **Secret key** | Llave secreta (`onvo_test_secret_key_…`). **Solo servidor.** |
| **Webhook secret** | Secreto para validar que el webhook viene de ONVO (`X-Webhook-Secret`). |
| **Test mode / Live mode** | Ambiente de prueba vs dinero real. La key define el modo. |
| **3DS** | Autenticación extra del banco (challenge) en algunos cobros con tarjeta. |
| **SINPE** | Sistema de pagos interbancarios de Costa Rica (Móvil / PIN). |
| **Marketplace / Connected account** | Cobrar en nombre de vendedores (cuenta primaria + cuentas conectadas). |
| **PCI** | Normas de seguridad de tarjetas. Por eso **no** guardás PAN en Platform. |

## Spring Boot / backend

| Término | Significado simple |
|---------|-------------------|
| **Bean** | Objeto que Spring crea y gestiona (inyectable). |
| **DI (Dependency Injection)** | Spring te pasa dependencias por el constructor en vez de hacer `new` vos. |
| **Controller** | Capa HTTP: recibe request, llama al Service, devuelve response. |
| **Service** | Lógica de negocio / orquestación. |
| **Repository** | Acceso a base de datos (JPA). |
| **Entity** | Clase Java mapeada a una tabla. |
| **DTO / Record** | Objeto que viaja por la API (no expongas Entities). |
| **Flyway** | Migraciones versionadas de SQL (`V1__…`, `V2__…`). |
| **Profile** | Config por ambiente (`local`, `prod`). |
| **RestClient / WebClient** | Clientes HTTP de Spring para llamar APIs externas (ONVO). |
| **@Transactional** | Marca un bloque que debe ser atómico en DB. No lo abras alrededor de HTTP externo largo. |
| **Problem Details** | Formato estándar de errores HTTP (RFC 7807) que usa Platform. |
| **Filter (Security)** | Intercepta requests antes del controller (ej. validar Bearer token). |
| **Opaque token** | Token random (no JWT self-contained). El server guarda el hash y puede revocarlo. |
| **token_hash** | SHA-256 del access token en la tabla `sessions`. Nunca el token crudo en DB. |
| **issueSession** | Método de `AuthService` que revoca otras sesiones, crea una nueva y devuelve el token. |
| **GIS** | Google Identity Services: botón / One Tap que entrega un ID token al front. |

## Frontend

| Término | Significado simple |
|---------|-------------------|
| **Vite** | Bundler/dev server del front. |
| **React Context** | Estado compartido (ej. usuario logueado). |
| **AuthProvider** | Context que guarda user + token y hace bootstrap con `/me`. |
| **ProtectedRoute** | Ruta que exige sesión. |
| **SDK ONVO** | Librería JS que tokeniza/cobrá en el browser con publishable key. |
| **Env `VITE_*`** | Variables expuestas al front en build time. **Nunca** pongas secrets ahí. |
| **Bearer (sesión)** | Header `Authorization: Bearer <accessToken>` de Platform — distinto a la secret key de ONVO. |

## Proceso

| Término | Significado simple |
|---------|-------------------|
| **SDLC** | Ciclo de vida de software: requisitos → diseño → implementar → test → review → docs → demo. |
| **DoD (Definition of Done)** | Checklist que cierra el spring. |
| **Vertical slice** | Una funcionalidad completa de punta a punta, no “solo backend”. |
| **Idempotencia** | Procesar el mismo evento dos veces no duplica el efecto (crítico en webhooks). |
