# Anuncios de la campaña (4 + refuerzos)

La campaña lanza con **4 anuncios**: 2 carruseles (diseñados aquí) y 2 reels (en edición por producción audiovisual). Además hay piezas orgánicas que se reutilizan como anuncios de retargeting y B2B.

| Anuncio | Formato | Ángulo | Estado | Carpeta |
|---|---|---|---|---|
| **Carrusel A** · La bandeja del congelador | 6 tarjetas, 4:5 y 1:1 | Racional / oferta | Listo | `carrusel-a-bandeja-del-congelador/` |
| **Carrusel B** · Se estira | 6 tarjetas, 4:5 y 1:1 | Antojo / emocional | Listo | `carrusel-b-se-estira/` |
| **Reel 1** (en edición) | Video 9:16 | Por definir con producción | Pendiente | — |
| **Reel 2** (en edición) | Video 9:16 | Por definir con producción | Pendiente | — |

## Cómo se usan los dos carruseles
Son **dos hipótesis distintas** para la misma venta. En la primera semana corren juntos, con el mismo público y presupuesto parejo, para saber cuál mueve más pedidos (ver `campana/06-medicion-y-optimizacion.md`):
- **A (oferta):** quien compara precio y quiere tener comida guardada.
- **B (antojo):** quien decide con el estómago. Apuesta por el queso estirado, el recurso visual más fuerte del video del local.

## Los 2 reels: qué necesita producción de nosotros
Cuando entreguen los videos, solo falta cargarlos con este kit:
- **Texto principal** (elegir uno según el reel):
  - *Reel de lasaña:* "Mira cómo se estira. 🧀 Lasaña de res o pechuga: lista para hornear ($19.900) o al horno ($23.900). Pídela por WhatsApp. 📍 Cajicá"
  - *Reel de empanadas:* "No las freímos. Las horneamos. 🔥 9 sabores, bajas en grasa. Bandejas x5 listas para hornear desde $12.900. Pide por WhatsApp. 📍 Cajicá"
- **Titular:** "Pide por WhatsApp" · **CTA:** "Enviar mensaje de WhatsApp" o "Pedir ahora".
- **Especificaciones:** 9:16, 1080×1920, subtítulos incrustados (se ve sin sonido), gancho en los primeros 3 segundos, texto importante fuera de las zonas de interfaz (arriba ~250 px, abajo ~340 px). Portada 4:5 centrada para la cuadrícula del perfil.
- **Nombres:** `AD_Reel-1_[tema]_V1`, `AD_Reel-2_[tema]_V1`.
- Guiones de referencia: artifact "Yo Amo la Empanada — mapa estratégico y 12 reels" (ver `README.md` raíz).

## Refuerzos (piezas orgánicas que también sirven como anuncio)
| Pieza | Uso en pauta | Campaña |
|---|---|---|
| Nº 08 · Lo que dicen de nosotros | Retargeting (prueba social) | Retargeting |
| Nº 05 · La cuenta de la bandeja | Retargeting (cierre racional) | Retargeting |
| Nº 07 · Tu vitrina también las quiere | Prospección de tiendas, CTA "Enviar mensaje" | B2B |
| Nº 06 · Para tu próxima reunión | Eventos y oficinas, CTA "Enviar mensaje" | B2B |

## Reglas de los anuncios con carrusel
- Máximo **20 % de texto** como guía de legibilidad; aquí el texto es parte del diseño, por eso la prueba de A/B es importante.
- Todo el contenido está en la **zona segura 1:1** (y 135–1215 en el 4:5) para que no se corte.
- Las fotos de stock llevan la etiqueta **"Foto referencial"**. No quitarla hasta tener foto propia.
- Para exportar de nuevo: `npm run render -- ads` (genera 4:5 y 1:1).
