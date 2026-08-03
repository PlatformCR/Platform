# S12 — SINPE Móvil y SINPE PIN

**Objetivo:** conocer rails locales de Costa Rica vía ONVO (además de tarjetas).

**Conceptos nuevos:** pagos diferidos / async (`payment-intent.deferred`), UX distinta a tarjeta inmediata.

**Prerequisitos:** S04 + S05.

---

## 1. Requirements

- Leer docs [SINPE Móvil](https://docs.onvopay.com/payments/sinpe-mobile) y [SINPE PIN](https://docs.onvopay.com/payments/sinpe-pin).
- Extender create PaymentIntent (o flujo docs) para un método SINPE de prueba si está disponible en sandbox.
- UI: seleccionar método “Tarjeta” vs “SINPE” (aunque SINPE sea stub si sandbox limitado).
- Webhook: manejar `payment-intent.deferred` → UI “pendiente de aprobación”.
- Postman: folder **SINPE Móvil** (listar transferencias) — endpoint de consulta en backend opcional `GET /api/billing/sinpe/transfers` (proxy).

Si el sandbox no permite cobro real SINPE: DoD documental + client methods + UI estados deferred **simulado** con fixture de webhook — anotalo honestamente.

## 2. Design

Estados locales: `pending` → `deferred` → `succeeded`/`failed`.

## 3. Test / DoD

- [ ] Docs leídas y resumen 10 líneas en notes
- [ ] Código preparado para deferred
- [ ] No cumplir acceso en deferred

## 4. Demo

Mostrar UI de estado diferido + handler webhook.

---

**Siguiente:** [S13 — Marketplaces](S13-marketplaces.md)
