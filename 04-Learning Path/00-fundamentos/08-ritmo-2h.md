# 08 — Ritmo: 2 horas por día

Diseñado para **~2 h/día**, cerebro cansado a veces, pero **sin bajar el listón**. Vas despacio en el *cómo* (pasos chicos, una meta por sesión). Vas alto en el *qué* (entendés de verdad, te retás al final de cada bloque).

---

## Contrato contigo

| Sí | No |
|----|----|
| 1 meta clara por sesión de 2 h | “Hoy hago S04 entero sí o sí” |
| Cerrar la sesión con **teach-back** (abajo) | Seguir codeando zombi 40 min más |
| Releer un fundamento si no cerrás la idea | Saltarte springs “porque ya entendí” |
| Pedir ayuda al agente **con el número de sesión** | “Integrá ONVO completo” |
| Tomarte un día buffer si hace falta | Castigarte por ir “lento” |

Lento ≠ tonto. Lento + constante + teach-back = developer sólido.

---

## Anatomía de una sesión (2 h)

```text
0:00–0:10   Abrir spring + releer SOLO la sesión de hoy
0:10–0:55   Bloque A (lectura / diseño / código) — un solo objetivo
0:55–1:05   Pausa (agua, caminar, nada de Discord de tech)
1:05–1:50   Bloque B (implementar / probar / anotar)
1:50–2:00   Teach-back + marcar progress parcial
```

### Teach-back (obligatorio, 3–5 min)

Sin mirar el código, escribí o dictá:

1. ¿Qué hice hoy en una frase?
2. ¿Qué pieza es back / front / DB / ONVO?
3. ¿Qué no entendí todavía?

Si no podés hacer (1) y (2), **no avanzás de sesión**: mañana repetís o achicás el objetivo.

---

## Calendario orientativo (~2 h/día)

Totales reales: **~45–55 sesiones** (~9–11 semanas si no fallás días).  
Hay **buffers** metidos: la vida pasa.

### Fase 0 — Fundamentos (Sesiones F1–F4)

| Sesión | Qué | Meta de cierre |
|--------|-----|----------------|
| **F1** | [01](01-como-aprender.md) + [02](02-mapa-del-sistema.md) | Dibujás de memoria el diagrama actores |
| **F2** | [03](03-keys-y-secretos.md) keys | Decís qué key va dónde sin mirar |
| **F3** | [04](04-spring-boot-para-novatos.md) Spring | Explicás Controller → Service → Repo |
| **F4** | [05](05-http-rest-y-estados.md) + [06](06-testing-en-plataforma.md) + [07](07-plantilla-sdlc.md) | Sabés qué es idempotencia + DoD |

**Reto F:** explicarle a alguien (o a una nota de voz) el mapa del sistema en 90 segundos.

### Fase 1 — Core de pagos (S00–S07) ≈ 28–32 sesiones

| Spring | Sesiones | Semana aprox. |
|--------|----------|---------------|
| S00 Lab | 1 | Semana 1 |
| S01 OnvoClient | 2 | Semana 1 |
| S02 Clientes | 3 | Semana 2 |
| S03 Métodos de pago | 3 | Semana 2–3 |
| S04 Payment Intents | 3 | Semana 3 |
| S05 Webhooks | 4 | Semana 4 |
| S06 Productos/Precios | 2 | Semana 4–5 |
| S07 Membresías | 6 | Semana 5–6 |
| **Buffer core** | 2–3 | cuando te atasques |

**Hito “no negociable”:** al terminar S07 podés demo: plan → pagar test → webhook → ver feature gated.

### Fase 2 — Ampliar ONVO (S08–S13) ≈ 14–16 sesiones

| Spring | Sesiones |
|--------|----------|
| S08 Checkout | 2 |
| S09 Cupones/envíos | 2 |
| S10 Reembolsos/cancel | 3 |
| S11 3DS/fraude | 2 |
| S12 SINPE | 2 |
| S13 Marketplaces | 3 |
| Buffer | 1–2 |

### Fase 3 — Madurez (S14) ≈ 2–3 sesiones

Checklist live + runbook. Sin apuro de cobrar dinero real el mismo día.

---

## Vista por semanas (resumen)

| Semana | Enfoque | Sensación esperada |
|--------|---------|-------------------|
| 0 | Fundamentos F1–F4 | “Entiendo el mapa” |
| 1 | S00 + S01 | “Spring habla con ONVO” |
| 2 | S02 + arranque S03 | “Tengo customer” |
| 3 | S03 fin + S04 | “Cobré una vez” |
| 4 | S05 (+ buffer) | “El webhook manda” |
| 5 | S06 + S07 días 1–3 | “Hay planes” |
| 6 | S07 cierre | **Hito membresía** |
| 7–9 | S08–S13 | Amplitud ONVO |
| 10 | S14 + retrospectiva | Cierre maduro |

Si solo tenés 2 h algunos días de la semana, estirás el calendario: **el orden importa más que la fecha**.

---

## Niveles de reto (en cada spring)

Cada spring tiene (o tendrá) tres capas:

1. **Base** — DoD mínimo del spring. Obligatorio.
2. **Reto** — te estira sin ser otro spring (ej. “explicá el flujo en un diagrama tuyo”, “un test más”, “manejar un error feo de ONVO”).
3. **Boss** — opcional, solo si la Base está sólida y te sobra energía mental. No cuenta como atraso si lo dejás.

Regla: **nunca Boss sin Base.** Preferible Base perfecta + teach-back que Boss a medias.

---

## Si hoy estás “lerdo”

Checklist de sesión light (sigue siendo progreso real):

1. Solo lectura del spring / docs ONVO (45 min).
2. Dibujar el diagrama en papel (20 min).
3. Teach-back + 1 pregunta anotada para mañana (15 min).
4. El resto: descanso sin culpa.

Eso **cuenta** como sesión. Mañana codeás.

Si estás fresco: sesión normal + **Reto**.

---

## Cómo usar el agente con este ritmo

> Estoy en S04 sesión 2/3 (confirmar PaymentIntent). Tengo 2 horas. Ayudame solo con esa sesión: Service + test. No avances a webhooks.

El agente debe respetar el borde de la sesión.

---

## Progreso

Marcá sesiones en [progress.md](../progress.md) (hay checklist por sesión).  
Detalle día-a-día de cada spring: sección **“Sesiones (~2 h)”** dentro de cada archivo `springs/Sxx-*.md`.
