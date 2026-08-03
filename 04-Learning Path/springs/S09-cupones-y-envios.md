# S09 — Cupones y tarifas de envío

**Objetivo:** extender Checkout con descuentos (cupones/BIN rules) y shipping rates.

**Conceptos nuevos:** recursos auxiliares del checkout, validación de moneda/alcance del cupón.

**Prerequisitos:** S08.

---

## Sesiones (~2 h)

| # | Meta | Al cerrar… |
|---|------|------------|
| **1/2** | Crear cupón + shipping rate (API/Postman/client) | Objetos visibles en ONVO |
| **2/2** | Session con discount + verificación | Sabés qué es `binRules` en 1 frase |

**Base:** DoD.  
**Reto:** cupón % vs fixed_amount — tabla comparativa tuya.  
**Boss:** endpoint lista cupones en UI admin mínima.

---

## 1. Requirements

- Admin o seeder: crear 1 cupón test vía API ONVO (`percentage` simple).
- Crear 1 shipping rate test.
- Al crear Checkout session, permitir `discounts` y/o shipping según docs.
- UI opcional: campo “aplicar cupón” solo si el flujo lo soporta en tu diseño (si one-time links aplican cupón desde backend, hacelo server-side).
- Listar cupones en una página admin simple **o** solo vía Postman + documentado (mínimo: backend endpoints + Postman verify).

Para aprendizaje full-stack mínimo:  
`GET /api/billing/coupons` (proxy lista) + usar cupón en create session.

## 2. Design

- Postman: **Cupones**, **Tarifas de envío**
- Docs one-time links + coupons en `03-ONVO Pay`

## 3. Implement

1. `OnvoClient` CRUD cupones / shipping rates (los métodos que uses).
2. Checkout create acepta `couponId` opcional.
3. Test: session con cupón reduce monto esperado (assert en respuesta ONVO si expone totals).

## 4. Test / DoD

- [ ] Cupón creado en ONVO test
- [ ] Session con discount
- [ ] Shipping rate creado y referenciable
- [ ] Sabés explicar `binRules` en una frase

## 5. Demo

Checkout con 10% off visible en UI ONVO.

---

**Siguiente:** [S10 — Reembolsos y cancelaciones](S10-reembolsos-y-cancelaciones.md)
