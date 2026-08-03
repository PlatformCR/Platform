# S13 — Marketplaces (cuentas conectadas)

**Objetivo:** entender cobros en nombre de vendedores (cuenta primaria + connected accounts). Avanzado.

**Conceptos nuevos:** platform / connected account, onboarding link, application fees, aislamiento test/live.

**Prerequisitos:** S07 recomendado (ya dominás customers/charges). Cuenta ONVO con capacidad marketplace si aplica.

---

## Sesiones (~2 h)

| # | Meta | Al cerrar… |
|---|------|------------|
| **1/3** | Docs + tabla connected_accounts | Primary vs connected en 1 min |
| **2/3** | Create account + onboarding link | Link generado (real o mock justificado) |
| **3/3** | UI admin lista + teach-back | Demo corta |

**Base:** DoD.  
**Reto:** explicar application fee en palabras simples.  
**Boss:** weekly fee endpoint si tu cuenta lo permite.

---

## 1. Requirements

- Leer docs [Marketplaces](https://docs.onvopay.com/payments/marketplaces).
- Backend:
  - `POST /api/marketplaces/connected-accounts` crea cuenta conectada
  - `GET` list/get
  - `POST .../onboarding-link` regenerar link
- UI admin simple: lista connected accounts + botón onboarding.
- Guardar `onvo_connected_account_id` en tabla local `connected_accounts`.
- **No** mezclar keys de otra cuenta primaria.

Si tu cuenta sandbox no habilita marketplaces: implementá client + UI contra mocks + doc “blocked by account capability”.

## 2. Design

- Postman folder: **Marketplaces**
- Fees: `marketplaceAppFee` / weekly fees según docs — implementá solo create + onboarding primero.

## 3. Test / DoD

- [ ] Create connected account (real o mock justificado)
- [ ] Onboarding link generado
- [ ] Sabés explicar primary vs connected en 1 minuto

## 4. Demo

Crear cuenta conectada y abrir link de onboarding (test).

---

**Siguiente:** [S14 — Producción y hardening](S14-produccion-y-hardening.md)
