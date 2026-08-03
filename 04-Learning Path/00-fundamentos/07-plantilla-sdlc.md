# 07 — Plantilla SDLC (copiá esto en cada spring)

Cada spring del path ya trae estas secciones rellenadas. Cuando implementes por tu cuenta algo extra, usá esta plantilla.

---

## 1. Requirements (qué y para quién)

- Problema:
- Usuario:
- Fuera de alcance:
- Criterios de aceptación (lista):

## 2. Design (antes de codear)

- Diagrama (mermaid o paper):
- Endpoints Platform nuevos:
- Tablas / migraciones Flyway:
- Llamadas ONVO (método + path):
- Pantallas web:
- Keys involucradas:
- Riesgos de seguridad:

## 3. Implement

Orden sugerido:

1. Flyway
2. Entities + Repositories
3. DTOs
4. OnvoClient methods
5. Service
6. Controller + SecurityConfig
7. Web (API client + página)
8. Config/env examples

## 4. Test

- [ ] Unit service
- [ ] Auth/security smoke
- [ ] Postman ONVO (si aplica)
- [ ] UI manual
- [ ] Webhook (si aplica)

## 5. Review

- [ ] No secrets en git
- [ ] Controllers delgados
- [ ] DTOs, no entities
- [ ] Errores consistentes
- [ ] README / notas del spring actualizadas

## 6. Document

- Qué aprendiste (3 bullets)
- Decisiones tomadas
- Deuda técnica consciente

## 7. Demo

Grabá o anotá los pasos para demostrarlo en 3 minutos (Postman + UI).

---

## Definition of Done (genérico)

Un spring está **done** solo si:

1. Cumple sus criterios de aceptación.
2. Back + front funcionan juntos (cuando el spring lo pide).
3. Hay migración si tocaste schema.
4. Hay al menos los tests mínimos del spring.
5. Actualizaste [progress.md](../progress.md).
6. Podés explicar el flujo sin leer el código línea a línea.

Volvé al [README](../README.md) y empezá por [S00](../springs/S00-laboratorio-y-keys.md).
