# Ad · Carrusel A — "La bandeja del congelador"
**Ángulo:** racional / oferta. Muestra el producto, el precio y lo fácil que es pedir.
**Objetivo:** pedidos (bandejas x5 y lasaña lista para hornear).
**Audiencia:** familias y personas ocupadas de Cajicá y la Sabana (ver `campana/01-audiencias.md`, audiencia B2C-1).
**Formato:** carrusel de 6 tarjetas · 4:5 (1080×1350) y 1:1 (1080×1080, ya exportadas como `*-1x1.png`). Todo el contenido está dentro de la zona segura 1:1.

## Tarjetas
| # | Archivo | Mensaje en imagen | Titular (≤ 40) | Descripción (≤ 30) |
|---|---|---|---|---|
| 1 | `A1-gancho` | Tu cena resuelta. Del congelador al horno. · Desde $12.900 | Tu cena resuelta | Bandejas x5 desde $12.900 |
| 2 | `A2-gourmet` | Bandeja Gourmet x5 · $19.900 · $3.980 cada una | Bandeja Gourmet x5 · $19.900 | 7 sabores a elegir |
| 3 | `A3-tradicional` | Bandeja Tradicional x5 · $12.900 · $2.580 cada una | Bandeja Tradicional x5 · $12.900 | Carne o pollo con arroz |
| 4 | `A4-lasana` | Lasaña lista para hornear · $19.900 | Lasaña lista para hornear · $19.900 | De res o de pechuga |
| 5 | `A5-pasos` | Pedir es fácil: Elige · Envía por WhatsApp · Recibe o recoge | Pedir es fácil | Sin escribirlo todo |
| 6 | `A6-pide-hoy` | Pide hoy tu bandeja · 300 516 2421 | Pide hoy por WhatsApp | 300 516 2421 |

## Texto principal (probar las 3 variantes)
**V1 · Directa**
> Tu cena resuelta, del congelador al horno. 🧊➡️🔥
> Bandejas x5 de empanadas al horno desde $12.900 y lasaña lista para hornear. Pídelas por WhatsApp y te confirmamos la entrega. 📍 Cajicá

**V2 · Cuenta clara**
> 5 empanadas gourmet sueltas: $25.000. En Bandeja Gourmet x5: $19.900. ❤️
> Guárdalas en tu congelador y hornéalas cuando quieras. Pide por WhatsApp. 📍 Cajicá

**V3 · Corta**
> Empanadas al horno, bajas en grasa, listas para hornear en tu casa. Desde $12.900 la bandeja x5.

## Configuración
- **CTA:** "Pedir ahora" si va al sitio (destino: menú web con UTMs) · "Enviar mensaje de WhatsApp" si es Click-to-WhatsApp.
- **URL (sitio):** `https://yoamolaempanada.com/?utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign=cong-oct26_ventas-web&utm_content=carrusel-a_{{ad.name}}`
- **Mensaje de bienvenida (Click-to-WhatsApp):** "¡Hola! Vengo del anuncio de las bandejas. Quiero pedir:" (mensaje prellenado; ver `campana/04-tracking-utm-whatsapp.md`)
- **Orden de tarjetas:** dejar el orden manual (1 → 6). Desactivar "optimizar orden" para que el gancho siempre sea la primera tarjeta.
- **Nombre del anuncio:** `AD_Carrusel-A_Bandeja-Congelador_V1` (V2, V3 según texto).
- **Ubicaciones:** automáticas (Advantage+). Las tarjetas 1:1 y 4:5 cubren Feed, Marketplace y Explorar.

## A validar antes de publicar
- Precios vigentes (flyer oct. 2026) y que el "$3.980 / $2.580 cada una" sea aceptable como cálculo.
- Tarjeta 4 usa foto de stock ("Foto referencial"). Reemplazar por foto real de la lasaña apenas exista.
- "Domicilio o recoge en el local" (tarjeta 6) y "te confirmamos la entrega": confirmar zonas y costo de domicilio.
- La etiqueta de la bandeja en las fotos tiene el WhatsApp corregido (retoque digital). Reimprimir la etiqueta real.
