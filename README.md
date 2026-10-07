# Yo ❤ La Empanada al Horno · Campaña Congelados (octubre 2026)

Todo lo necesario para lanzar la campaña de **lasañas y empanadas congeladas listas para hornear**: 8 contenidos orgánicos, 2 carruseles de Ads y el kit para montar las campañas (audiencias, estructura de cuenta, copys, medición, B2B y pendientes).

> **Ver la parrilla:** https://werockagencia.github.io/yo-amo-la-empanada-contenidos-octubre/ (carruseles, captions con botón "Copiar", calendario y pendientes). En local: abrir `index.html` (versión liviana en `web/`) o `completo.html` (PNG a tamaño completo).

## Idea
**"Del congelador al horno. Con amor."** Tres capítulos que llevan al cliente de conocer el producto a pedirlo:

| Capítulo | Para qué sirve | Piezas |
|---|---|---|
| **I · Conócelas** | Qué hacemos y por qué es distinto (al horno, bajas en grasa, 9 sabores) | Nº 01, 02 |
| **II · El congelador** | El producto de la campaña: bandejas x5, lasaña, precios | Nº 03, 04, 05 |
| **III · Para todos** | Eventos, tiendas y prueba social | Nº 06, 07, 08 |

## Calendario (martes y jueves)
| Nº | Pieza | Formato | Fecha |
|---|---|---|---|
| 01 | No las freímos. Las horneamos. | Carrusel · 5 | Mar 13 oct · 12:30 p. m. |
| 02 | 9 sabores, 9 corazones | Carrusel · 5 | Jue 15 oct · 12:30 p. m. |
| 03 | Del congelador al horno | Carrusel · 6 | Mar 20 oct · 12:30 p. m. |
| 04 | La lasaña que se estira | Post · 3 + Historias · 3 | Jue 22 oct · 7:00 p. m. |
| 05 | La cuenta de la bandeja | Carrusel · 5 | Mar 27 oct · 12:30 p. m. |
| 06 | Para tu próxima reunión | Carrusel · 6 | Jue 29 oct · 12:30 p. m. |
| 07 | Tu vitrina también las quiere | Carrusel · 5 | Mar 3 nov · 9:00 a. m. |
| 08 | Lo que dicen de nosotros | Carrusel · 6 | Jue 5 nov · 12:30 p. m. |

La única fuente del calendario es `scripts/plan.mjs`. Los captions listos para copiar están en **`CAPTIONS.md`**.

## Anuncios (`ads/`)
| Anuncio | Ángulo | Estado |
|---|---|---|
| **Carrusel A** · La bandeja del congelador | Racional: producto, precio, cómo pedir | Listo (4:5 y 1:1) |
| **Carrusel B** · Se estira | Antojo: queso estirado de la lasaña | Listo (4:5 y 1:1) |
| Reel 1 y Reel 2 | Los edita producción audiovisual | Kit de carga en `ads/README.md` |

Además, las piezas Nº 05, 06, 07 y 08 se reutilizan como anuncios de retargeting y B2B.

## Kit de campaña (`campana/`)
| Archivo | Qué contiene |
|---|---|
| `00-brief.md` | Cliente, objetivo, productos y precios, propuesta de valor, voz, líneas rojas, línea de tiempo |
| `01-audiencias.md` | Geografía, audiencias B2C, retargeting, lookalike, B2B y eventos |
| `02-estructura-meta-ads.md` | Campañas, conjuntos, anuncios, nomenclatura, presupuesto (propuesta) |
| `04-tracking-utm-whatsapp.md` | UTMs, eventos del pixel, Click-to-WhatsApp, registro de pedidos, cálculos |
| `05-checklist-lanzamiento.md` | Lista de verificación antes del primer peso |
| `06-medicion-y-optimizacion.md` | KPIs, plan de pruebas, reglas de optimización, reporte semanal |
| `07-b2b-prospeccion.md` | Tiendas, supermercados y eventos: prospección, mensajes y objeciones |
| `08-pendientes-cliente.md` | Lo que falta validar con el cliente |
| `estructura-ads.csv` | Campañas/conjuntos/anuncios con nombres y UTMs para copiar |
| `registro-pedidos.csv` | Plantilla para registrar cada pedido y su origen |

## Estructura del repo
```
index.html · web/             página de revisión liviana para el cliente (se genera; GitHub Pages)
completo.html                 misma página con los PNG a tamaño completo (se genera)
CAPTIONS.md                   captions en orden de publicación (se genera)
piezas/NN-slug/               slides.html · copy.md · export/*.png   (8 contenidos)
ads/                          carrusel-a-… · carrusel-b-… (slides.html · copy.md · export/ 4:5 y 1:1)
campana/                      kit de montaje (documentos y CSV)
assets/
  css/yale.css                sistema visual
  js/slide.js                 masthead, folio, iconos y grano de cada slide
  brand/fonts/                Russo One + Poppins
  photos/                     fotos listas para usar (+ src/ con los originales)
scripts/                      plan · prep-assets · render · preview · captions · site
preview/                      hojas de contacto por pieza y cuadrícula del perfil
```

## Sistema visual
- **Tipografía de marca:** Russo One (títulos, como el sitio) + Poppins (texto y UI, manual de marca).
- **Paleta:** rojo `#E41E13` · negro cálido `#14100d` · crema `#F8F3E7` · arena `#E8E4D9` · tan `#DACCAC` · dorado `#B68D2C`.
- **Recursos:** masthead con logo y **Nº** de edición, folio `02 / 06`, cinta roja de precio (como el flyer), corazones numerados (como la carta), patrón de corazones (como la banda Mayoristas del sitio), grano de película y gradación cálida común a todas las fotos.
- **Lienzos:** feed 1080×1350 · historias 1080×1920 · ads 1080×1350 + 1080×1080 (todo el contenido en la zona segura 1:1).

## Cómo re-exportar
```bash
npm install            # una sola vez
npm run build          # fotos → PNG → previews → captions → páginas (completo.html, web/)
npm run render -- 03   # solo las carpetas que contienen "03"
npm run render -- ads  # solo los anuncios (genera 4:5 y 1:1)
```
Requiere Chrome o Edge instalado. Para cambiar un precio o texto: editar el `slides.html` de la pieza (y su `copy.md`) y volver a exportar.

## Honestidad y derechos
- **Nada inventado:** los claims salen del flyer, la etiqueta y la carta del cliente; las reseñas son las del sitio actual, palabra por palabra. Lo que no se pudo confirmar está en `campana/08-pendientes-cliente.md` y en las notas de cada `copy.md`.
- **Fotos de stock** (lasaña): Pexels, uso comercial gratuito, sin atribución obligatoria (créditos en `assets/photos/src/CREDITOS-PEXELS.txt`). En las piezas llevan la etiqueta **"Foto referencial"**; reemplazar por fotos reales apenas existan.
- **Retoque de empaque:** la etiqueta impresa de la bandeja aún dice 301 477 0177. En las fotos de este repo (`bandeja-etiqueta.jpg`, `bandeja-precios.jpg`, `bandeja-solo.jpg`) el número está **corregido digitalmente** a 300 516 2421 (`scripts/prep-assets.mjs`). Reimprimir la etiqueta real antes de entregar producto a tiendas. Los originales sin retocar están en `assets/photos/src/`.
- Las fotos de estudio y los flyers son del cliente (sitio anterior y carpeta de cliente).

## Referencias
- Guiones de los 12 reels y mapa estratégico: artifact https://claude.ai/artifact/F5WL4X31jYNHeBRojU61TC
- Sitio web / toma-pedidos (WhatsApp checkout): carpeta `Desarrollos Wordpress\Yo Amo la Empanada` (wireframe en localhost, pendiente de aprobación y de pasar a WordPress + WooCommerce).
