# 01 — Cómo aprender con este path

## Mentalidad

Este no es un tutorial para copiar-pegar. Es un **gimnasio de developer**:

- Vas a leer docs (ONVO + Spring + tu propio código).
- Vas a diseñar antes de codear (aunque sea parte de una sesión).
- Vas a implementar back **y** front, pero **no todo el mismo día**.
- Vas a romper cosas en test mode y a arreglarlas.
- Vas a poder explicar en voz alta qué hace cada capa.

Si solo “seguís pasos” sin entender, estás fallando el objetivo.

**Ritmo real:** ~**2 horas por día**. La guía completa está en [08-ritmo-2h.md](08-ritmo-2h.md). Leela antes del primer spring.

## Ritmo (resumen)

| Idea | Detalle |
|------|---------|
| Sesión | 2 h = 2 bloques de ~50 min + pausa + teach-back |
| Unidad de avance | **Una sesión**, no “un spring entero” |
| Core (S00–S07) | ~6 semanas si venís casi todos los días |
| Path completo | ~9–11 semanas orientativo |
| Buffer | Está contemplado; usalo sin culpa |

No hay premio por terminar rápido. Hay premio por **cerrar teach-backs** y demos.

## Ritual de cada sesión (no de cada spring)

1. Abrí el spring y ubicá **qué sesión de hoy** es (ej. S04 / 2 de 3).
2. Si cita un fundamento, leé solo lo necesario (10–15 min máx).
3. Una meta: diseño **o** Flyway **o** Service **o** UI — no tres a la vez.
4. Probá lo que construiste (aunque sea Postman).
5. Teach-back 3–5 min (ver [08-ritmo-2h](08-ritmo-2h.md)).
6. Marcá la sesión en [progress.md](../progress.md).

Cuando **todas** las sesiones Base del spring están hechas → cerrá el DoD del spring.

## Cómo pedir ayuda al agente (Cursor)

Incluí spring **y** sesión:

> Estoy en S05 sesión 2/4 (verificar secreto + tabla webhook_events). Tengo 2 horas. No pases a memberships.

Mal pedido: “integrá ONVO completo”.

## Anti-patrones de aprendizaje

- Meter la secret key en el frontend “para probar rápido”.
- Marcar el spring done sin terminar sus sesiones Base.
- Sesiones de 4 h “para recuperar” → burnout y cero retención.
- Copiar un client HTTP gigante en el Controller.
- Exponer Entities JPA en el JSON de respuesta.
- Mezclar test keys con live objects.
- Saltar el teach-back porque “ya lo sé”.

## Definición de “sé hacerlo”

Podés explicar sin mirar el código:

1. Qué request entra a Platform.
2. Qué hace el Service.
3. Qué llama a ONVO y con qué key.
4. Qué se guarda en la DB.
5. Qué ve el usuario en la UI.
6. Cómo un webhook podría cambiar el estado después.

## Retarte (sin subestimarte)

Al final de cada spring hay **Base / Reto / Boss**.

- **Base** = el oficio (obligatorio).
- **Reto** = te saca del piloto automático (muy recomendado).
- **Boss** = stretch opcional cuando la Base está limpia.

Si la Base te costó, el Reto puede esperar 1–2 días. No es rendirse: es periodización.
