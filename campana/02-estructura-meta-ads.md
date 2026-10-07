# 02 · Estructura de la cuenta de anuncios (Meta: Facebook + Instagram)

**Principio:** un objetivo por campaña, pocos conjuntos, varios anuncios por conjunto. Con presupuesto pequeño, **menos conjuntos = el algoritmo aprende más rápido**.

**Nomenclatura:** `META_[Objetivo]_[Público]_[Oferta]_[AAAA-MM]` · conjuntos `AS_[Público]_[Zona]` · anuncios `AD_[Pieza]_[Versión]`.

```
Cuenta de anuncios Yo Amo la Empanada
├── C1 · META_Ventas-Web_Prospecting_Congelados_2026-10   (70 % del presupuesto)
│    └── AS_Abierto-B2C_Sabana-Cercana (25–55)
│         ├── AD_Carrusel-A_Bandeja-Congelador_V1/V2/V3
│         ├── AD_Carrusel-B_Se-Estira_V1/V2/V3
│         ├── AD_Reel-1_[tema]_V1        (cuando producción entregue)
│         └── AD_Reel-2_[tema]_V1
├── C2 · META_Ventas-Web_Retargeting_Congelados_2026-10   (20 %)   ← se enciende en semana 3
│    └── AS_Retargeting_Interaccion-y-Visitantes (excluye compradores)
│         ├── AD_Resenas_Nº08
│         ├── AD_Cuenta-Clara_Nº05
│         └── AD_Carrusel-A_Bandeja-Congelador_V2
└── C3 · META_Mensajes-WA_B2B_Tiendas-y-Eventos_2026-10   (10 %)   ← se enciende en semana 4
     ├── AS_Tiendas_Sabana  → AD_Tienda_Nº07
     └── AS_Eventos_Sabana  → AD_Reunion_Nº06
```

## C1 · Prospección (ventas por sitio web)
- **Objetivo:** Ventas · **Ubicación de conversión:** sitio web.
- **Evento de optimización (en orden de preferencia):**
  1. `Contact` (clic en "Enviar pedido por WhatsApp" del sitio) — es el evento más cercano al pedido.
  2. Si en 10–14 días no llegan ~50 eventos por semana (lo normal con presupuesto bajo), cambiar a **Vistas de página de destino** (o a Tráfico con "Vistas de página de destino") y medir el pedido real por WhatsApp.
- **Público:** abierto (Advantage+) con la ubicación de `01-audiencias.md`. Edades 25–55.
- **Ubicaciones:** automáticas.
- **Presupuesto:** a nivel de conjunto, diario, sin cambios durante los primeros 3–4 días (fase de aprendizaje).
- **Variante Click-to-WhatsApp (opcional, para probar):** duplicar C1 como `META_Mensajes-WA_Prospecting_...` con la misma creatividad y mensaje prellenado. Útil si el cliente prefiere recibir el chat directo sin pasar por el sitio, o mientras el sitio nuevo no esté en línea.

## C2 · Retargeting
- Mismo objetivo/evento que C1. Público: audiencias de `01-audiencias.md` con exclusión de compradores.
- Máximo 3 anuncios; tope de frecuencia razonable (< 3 a la semana, ver `06-medicion-y-optimizacion.md`).

## C3 · B2B (conversaciones)
- **Objetivo:** Interacción / Mensajes → **WhatsApp** (anuncios que hacen clic para enviar mensaje).
- Un conjunto por mercado para poder separar resultados y mensajes de bienvenida.
- Mensajes prellenados:
  - Tiendas: "Hola, tengo una tienda y quiero información de precios al por mayor."
  - Eventos: "Hola, quiero cotizar empanadas para un evento."

## Presupuesto (propuesta: **validar con el cliente**)
Con una inversión total de ejemplo para el mes, la distribución sugerida es:
| Campaña | % | Ejemplo con COP 1.500.000 | Diario aprox. |
|---|---|---|---|
| C1 Prospección | 70 % | COP 1.050.000 | ≈ COP 37.500 |
| C2 Retargeting | 20 % | COP 300.000 | ≈ COP 15.000 (desde la semana 3) |
| C3 B2B | 10 % | COP 150.000 | ≈ COP 7.500 (desde la semana 4) |

> El monto es un **ejemplo**, no una recomendación de inversión: el cliente define el tope. Regla práctica: el presupuesto diario de un conjunto debería permitir al menos 1–2 pedidos al día al costo objetivo (ver `06-medicion-y-optimizacion.md`); si el diario es menor, concentrar en menos anuncios.

## Archivo para armar rápido
`campana/estructura-ads.csv` lista campañas, conjuntos, anuncios, nombres y UTMs listos para copiar.
