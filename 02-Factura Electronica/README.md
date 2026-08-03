# Factura electrónica (research)

Documentación de referencia para integrar facturación electrónica de Costa Rica (XML v4.4) vía **Facturaencr**, orientada a pruebas / proyecto personal de Platform.

**Estado:** solo investigación. No hay integración en el código todavía.

---

## Fuentes

| Recurso | URL |
|---------|-----|
| Guía + referencia API (emisión de comprobantes) | https://facturaencr.com/docs#tag/emisi%C3%B3n-de-comprobantes |
| Cliente Scalar (overview / OpenAPI interactivo) | https://client.scalar.com/@local/default/document/facturaencr-api-de-facturaci%C3%B3n-electr%C3%B3nica-costa-rica/overview |
| Docs en vivo (probar requests) | https://facturaencr.com/docs |
| OpenAPI JSON (fuente) | https://api.facturaencr.com/v2/efactura/docs/openapi.json |
| OpenAPI YAML | https://api.facturaencr.com/v2/efactura/docs/openapi.yaml |
| Guía Markdown | https://api.facturaencr.com/v2/efactura/docs/guia.md |
| Postman | https://api.facturaencr.com/v2/efactura/docs/postman.json |
| Bundle ZIP | https://api.facturaencr.com/v2/efactura/docs/bundle.zip |

Descargado: **2026-08-02** desde los endpoints oficiales anteriores.

---

## Contenido de esta carpeta

| Archivo | Descripción |
|---------|-------------|
| `guia.md` | Guía de integración (primeros pasos, auth, emisión, impuestos, catálogos, errores). |
| `openapi.json` | Spec OpenAPI 3.1 (35 paths). |
| `openapi.yaml` | Misma spec en YAML. |
| `postman.json` | Colección Postman (variables `baseUrl`, `apiKey`, `apiSecret`). Carpetas alineadas a tags OpenAPI: Cuenta, Certificados, Emisión (Emitir + Consulta), Emisores, CABYS, Webhooks. |
| `bundle.zip` | Paquete oficial (guia + openapi + postman + README del vendor). |
| `_bundle-README.md` | README incluido en el ZIP del vendor. |

---

## Resumen rápido (para Platform)

- **Base URL:** `https://api.facturaencr.com/v2/efactura`
- **Auth:** headers `X-API-Key` + `X-API-Secret` (no Bearer).
- **Sandbox vs producción:** misma URL; lo decide el `environment` de la API key / certificado.
- **Emisión:** `POST /documents/{tipo}` → `202` con `clave` + `consecutivo`; veredicto fiscal luego (`accepted` / `rejected`) por webhook o `GET /documents/{id}`.
- **Tipos:** factura `01`, ND `02`, NC `03`, tiquete `04`, mensaje receptor `05/06/07`, compra `08`, exportación `09`, recibo pago `10`.
- Para testing personal: cuenta trial + sandbox; no hace falta estar en Hacienda como proveedor de sistemas mientras no cobrés / no emitas en producción para terceros.

Sección clave en la guía: **Emisión de comprobantes** (`guia.md`, desde el heading homónimo). En la UI Scalar/docs: tag *Emisión de comprobantes*.
