# 01 — Cómo aprender con este path

## Mentalidad

Este no es un tutorial para copiar-pegar. Es un **gimnasio de developer**:

- Vas a leer docs (ONVO + Spring + tu propio código).
- Vas a diseñar antes de codear (aunque sea 15 minutos).
- Vas a implementar back **y** front juntos.
- Vas a romper cosas en test mode y a arreglarlas.
- Vas a poder explicar en voz alta qué hace cada capa.

Si solo “seguís pasos” sin entender, estás fallando el objetivo.

## Ritmo sugerido

| Tipo de spring | Tiempo orientativo |
|----------------|--------------------|
| S00–S01 (lab / cliente HTTP) | 0.5–1 día |
| S02–S06 (recursos base) | 1–2 días c/u |
| S07 (membresías) | 2–4 días |
| S08–S13 (ampliaciones) | 1–3 días c/u |
| S14 (live) | 1–2 días + checklist |

No hay prisa. Mejor un spring bien cerrado que tres a medias.

## Ritual de cada spring

1. Leé el spring completo.
2. Leé los fundamentos/links que cita.
3. Completá la sección **Diseño** (aunque sea un mermaid + lista de endpoints).
4. Implementá en este orden cuando aplique: **Flyway → entities/repos → OnvoClient methods → Service → Controller → Security → Web UI → Tests**.
5. Probá con Postman **y** con la UI.
6. Marcá [progress.md](../progress.md).
7. Escribí 3–5 líneas de “qué aprendí” en tus notas.

## Cómo pedir ayuda al agente (Cursor)

Pedí ayuda **por spring**, con contexto:

> Estoy en S04. Ya tengo OnvoClient y Customers. Quiero implementar create+confirm PaymentIntent siguiendo el learning path. No saltees tests ni Flyway.

Mal pedido: “integrá ONVO completo”.

## Anti-patrones de aprendizaje

- Meter la secret key en el frontend “para probar rápido”.
- Marcar el spring done sin webhook cuando el spring lo exige.
- Copiar un `RestTemplate` gigante en el Controller.
- Exponer Entities JPA en el JSON de respuesta.
- Mezclar test keys con live objects.

## Definición de “sé hacerlo”

Podés explicar sin mirar el código:

1. Qué request entra a Platform.
2. Qué hace el Service.
3. Qué llama a ONVO y con qué key.
4. Qué se guarda en la DB.
5. Qué ve el usuario en la UI.
6. Cómo un webhook podría cambiar el estado después.
