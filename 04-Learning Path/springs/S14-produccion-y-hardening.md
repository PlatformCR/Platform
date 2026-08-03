# S14 — Producción y hardening

**Objetivo:** cerrar el ciclo de aprendizaje llevando el diseño a un checklist de **live mode** seguro. No implica cobrar dinero real el mismo día — implica saber qué falta.

**Conceptos nuevos:** secrets en hosting, fail-fast prod, observabilidad mínima, rotación de keys, checklist go-live.

**Prerequisitos:** S07 done (membresías) como mínimo; ideal S10–S11.

---

## Sesiones (~2 h)

| # | Meta | Al cerrar… |
|---|------|------------|
| **1/2** | Checklist go-live + env prod documentados | Lista tachada en papel/notes |
| **2/2** | Hardening client + runbook 1 página | Sabés rotar keys si se filtran |
| **3/2** *(opcional)* | Retrospectiva del path | 3 aprendizajes + 1 hábito a mantener |

**Base:** sesiones 1–2 + DoD.  
**Reto:** feature flag `billing.enabled` esbozado.  
**Boss:** un cobro live mínimo + refund (solo si merchant live listo).

---

## 1. Requirements

- Documentar variables prod:

```text
ONVO_SECRET_KEY=onvo_live_secret_key_...
ONVO_WEBHOOK_SECRET=...
VITE_ONVO_PUBLIC_KEY=onvo_live_publishable_key_...
```

- `application-prod.yml`: sin defaults inseguros; app no arranca sin secret si billing enabled.
- Webhook endpoint HTTPS público verificado.
- Checklist go-live (abajo) completada en papel.
- Revisar logs: no secrets, no PAN.
- Plan de rollback: desactivar planes / feature flag billing.

**Fuera de alcance obligatorio:** deploy real el mismo spring (si deployás, mejor).

## 2. Checklist go-live

- [ ] Onboarding merchant ONVO live completo
- [ ] Keys live solo en env del host (Render/Vercel)
- [ ] Webhook live URL + secreto distinto al test
- [ ] Probar 1 cobro real de monto mínimo y refund
- [ ] Monitoreo: alertas 5xx en `/api/webhooks/onvo`
- [ ] Soporte: proceso manual si webhook falla
- [ ] Legal/ToS / facturación fiscal (pregunta abierta del planning)

## 3. Hardening técnico

- Timeouts y retries idempotentes en `OnvoClient`
- Rate-limit webhook abuse (opcional básico)
- Feature flag `app.billing.enabled`
- Revisar CORS prod
- Backup de `webhook_events` / auditoría

## 4. Test / DoD

- [ ] Documento “Runbook billing” en `04-Learning Path/` o `01-Project Instructions/` (1 página)
- [ ] Grep: no live keys en git
- [ ] Explicás el camino test→live sin leer notes

## 5. Cierre del Learning Path

Felicitaciones si llegaste acá con S00–S07 sólidos. Los springs S08–S13 son amplitud; S14 es madurez.

Actualizá [progress.md](../progress.md) y escribí una retrospectiva:

1. Qué te costó más
2. Qué repetirías igual
3. Qué automatizarías después (CI tests, Testcontainers)

## 6. Lecturas finales

- [07-payments-memberships](../../00-Planning/07-payments-memberships.md) open questions
- [03-security](../../00-Planning/03-security.md)
- ONVO live dashboard

---

**Fin del curriculum.** Volvé al [README](../README.md) cuando quieras reimplementar un spring desde cero como práctica.
