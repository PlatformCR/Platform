# S11 — Autenticación 3DS y monitoreo de fraude

**Objetivo:** entender cobros que requieren autenticación adicional del banco y señales anti-fraude del browser.

**Conceptos nuevos:** flujos async / redirect challenge, `next_action`, fraud signals.

**Prerequisitos:** S04 (intents) + S03 (SDK).

---

## 1. Requirements

- Leer docs [3DS](https://docs.onvopay.com/payments/three-ds) y [fraud monitoring](https://docs.onvopay.com/payments/fraud-monitoring).
- Implementar en el front el manejo de challenge 3DS que indique el SDK/API (redirect o component).
- Backend: no marcar paid hasta webhook `succeeded` (refuerzo de S05).
- Enviar señales de fraude del browser si el SDK lo requiere.
- Documento corto en el spring notes: “qué cambia en UX cuando hay 3DS”.

**Mínimo full-stack:** un pago test que force 3DS (si ONVO test cards lo permiten) + UI no asume éxito prematuro.

## 2. Design

```mermaid
sequenceDiagram
  participant W as Web
  participant O as ONVO
  participant Bank as Banco3DS
  participant A as API

  W->>O: confirm intent
  O-->>W: requires 3DS action
  W->>Bank: challenge
  Bank-->>O: authenticated
  O-->>A: webhook succeeded
  A-->>W: membership_or_payment active
```

## 3. Test / DoD

- [ ] Flujo 3DS de prueba documentado (card / steps)
- [ ] Sin webhook no hay entitlement
- [ ] Fraud signals enviados o N/A justificado

## 4. Lecturas

- Docs 3DS + fraude + testing cards
- OpenAPI tags relacionados

## 5. Demo

Cobro con challenge → éxito solo tras webhook.

---

**Siguiente:** [S12 — SINPE](S12-sinpe-movil-y-pin.md)
