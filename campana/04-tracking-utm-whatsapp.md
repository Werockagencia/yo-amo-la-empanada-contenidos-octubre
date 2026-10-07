# 04 · Medición: UTMs, pixel y pedidos por WhatsApp

El pedido termina en WhatsApp, así que hay que medir **en dos lugares**: (1) lo que Meta ve (clics, vistas, eventos del sitio) y (2) lo que pasa en el chat (pedidos reales). Sin lo segundo no se sabe cuánto cuesta un pedido.

## 1. UTMs (para todos los anuncios que van al sitio)
Plantilla:
```
https://yoamolaempanada.com/?utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign=cong-oct26_[objetivo]&utm_content=[pieza]_{{ad.name}}
```
| Parámetro | Valor | Ejemplo |
|---|---|---|
| `utm_source` | `{{site_source_name}}` (Meta lo llena: `fb` / `ig`) | `ig` |
| `utm_medium` | `paid_social` (anuncios) · `social` (orgánico) · `link_in_bio` | `paid_social` |
| `utm_campaign` | `cong-oct26_ventas-web` · `cong-oct26_retargeting` · `cong-oct26_b2b` | `cong-oct26_ventas-web` |
| `utm_content` | `carrusel-a`, `carrusel-b`, `reel-1`, `reel-2`, `resenas`, `cuenta` + `{{ad.name}}` | `carrusel-a_AD_Carrusel-A_V1` |

**Enlaces orgánicos:** el link de la biografía de Instagram: `https://yoamolaempanada.com/?utm_source=instagram&utm_medium=link_in_bio&utm_campaign=cong-oct26_organico`.

## 2. Pixel de Meta en el sitio nuevo (se implementa en la fase WordPress)
Eventos a registrar (alineados con el flujo del toma-pedidos):

| Momento en el sitio | Evento Meta | Parámetros |
|---|---|---|
| Entra a cualquier página | `PageView` | — |
| Abre la ficha de un producto | `ViewContent` | `content_name`, `value` |
| Agrega al carrito | `AddToCart` | `content_name`, `value`, `currency: 'COP'` |
| Abre "Tu pedido" (carrito) | `InitiateCheckout` | `value`, `num_items` |
| **Presiona "Enviar pedido por WhatsApp"** | **`Contact`** + evento personalizado `PedidoWhatsApp` | `value` (total estimado), `currency: 'COP'`, `tipo: domicilio\|recoger` |

Fragmento de referencia (agregar donde hoy se arma el mensaje, en `buildMessage`/envío):
```js
// Después de abrir WhatsApp con el pedido
if (window.fbq) {
  fbq('track', 'Contact', { value: total, currency: 'COP' });
  fbq('trackCustom', 'PedidoWhatsApp', { value: total, currency: 'COP', tipo: entrega });
}
```
- **Prioridad de eventos (Medición agregada de eventos):** 1 `Contact` · 2 `InitiateCheckout` · 3 `AddToCart` · 4 `ViewContent` · 5 `PageView`.
- **API de Conversiones:** el cliente no tiene pagos en línea, así que el valor de un `Contact` es **estimado**; usarlo como señal de intención y reconciliar con pedidos reales (sección 4). Configurar CAPI a través del plugin de Meta para WordPress cuando se publique el sitio.
- **Verificar** con la extensión "Meta Pixel Helper" y el probador de eventos antes de gastar un peso.
- **Dominio:** verificar `yoamolaempanada.com` en el Administrador comercial.

## 3. Click-to-WhatsApp (anuncios que abren el chat directo)
Mensajes de bienvenida prellenados por anuncio, para saber **qué anuncio trajo a cada persona** sin depender del pixel:

| Anuncio | Mensaje prellenado |
|---|---|
| Carrusel A | `¡Hola! Vengo del anuncio de las bandejas. Quiero pedir:` |
| Carrusel B | `¡Hola! Vi la lasaña en Instagram. Quiero pedir:` |
| Reel 1 / Reel 2 | `¡Hola! Vi el reel de [tema]. Quiero pedir:` |
| B2B tiendas | `Hola, tengo una tienda y quiero información de precios al por mayor.` |
| B2B eventos | `Hola, quiero cotizar empanadas para un evento.` |

Enlace directo de prueba (orgánico/historias): `https://wa.me/573005162421?text=Hola%2C%20quiero%20pedir`

## 4. Registro de pedidos (lo que de verdad cuenta)
Quien atiende el WhatsApp registra **cada pedido** en la hoja `campana/registro-pedidos.csv` (o una hoja de Google con las mismas columnas):

| Columna | Qué poner |
|---|---|
| `fecha` | AAAA-MM-DD |
| `origen` | `anuncio-a`, `anuncio-b`, `reel-1`, `reel-2`, `organico`, `boca-a-boca`, `b2b`, `no-sabe` |
| `canal` | `web` (pedido armado en el sitio) o `chat` |
| `tipo_cliente` | `consumidor`, `evento`, `tienda` |
| `producto` | Resumen corto |
| `valor_cop` | Total del pedido |
| `entrega` | `domicilio` o `recoger` |
| `cliente_nuevo` | `si` / `no` |

**Pregunta de oro** (si el origen no es claro): "¿Cómo nos conociste?". Opciones: Instagram, Facebook, anuncio, un amigo, pasé por el local, otra.

## 5. Cálculos que se hacen cada semana
- **Costo por contacto** = gasto / eventos `Contact`.
- **Costo por pedido real** (CPA) = gasto / pedidos registrados con origen de pauta.
- **ROAS real** = ventas de pedidos con origen de pauta / gasto.
- **Tasa de cierre** = pedidos / contactos (si es baja, el problema está en la atención o la oferta, no en el anuncio).
