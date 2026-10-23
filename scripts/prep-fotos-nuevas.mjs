// Fotos propias (sesión de octubre 2026): recortes sin fondo -> fotos de pieza sobre fondos de marca.
// Reemplaza a las fotos de stock "referenciales" de la lasaña y a las de la bandeja. Corre después de prep-assets.mjs.
// Fuente: assets/photos/src/nuevas/*.png (PNG con transparencia). Salida: assets/photos/*.jpg (mismos nombres y proporciones).
import sharp from 'sharp';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = (f) => path.join(ROOT, 'assets/photos/src/nuevas', f + '.png');
const OUT = (f) => path.join(ROOT, 'assets/photos', f);

const BG = {
  cream: { a: '#FBF7EC', b: '#EFE6D2' },
  tan: { a: '#EADFC4', b: '#D9C9A3' },
  ink: { a: '#4a2a14', b: '#14100d' }, // brasa cálida al centro
};

function background(W, H, kind) {
  const { a, b } = BG[kind];
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="g" cx="50%" cy="58%" r="75%"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`);
}

// Sombra suave de contacto bajo el producto (elipse difuminada)
function shadow(W, H, cx, bottom, w, kind) {
  const op = kind === 'ink' ? 0.55 : 0.22;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><filter id="b"><feGaussianBlur stdDeviation="${Math.round(w * 0.035)}"/></filter></defs><ellipse cx="${cx}" cy="${bottom}" rx="${w * 0.46}" ry="${Math.max(16, w * 0.06)}" fill="#14100d" opacity="${op}" filter="url(#b)"/></svg>`);
}

async function compose(name, out, W, H, { bg = 'cream', fit = 0.82, y = 0.5, dx = 0, shade = true, q = 92 } = {}) {
  const meta = await sharp(SRC(name)).metadata();
  const scale = Math.min((W * fit) / meta.width, (H * fit) / meta.height);
  const w = Math.round(meta.width * scale), h = Math.round(meta.height * scale);
  const prod = await sharp(SRC(name)).resize({ width: w, height: h }).toBuffer();
  const left = Math.round((W - w) / 2 + dx), top = Math.round((H - h) * y);
  const layers = [];
  if (shade) layers.push({ input: shadow(W, H, left + w / 2, top + h - h * 0.015, w, bg) });
  layers.push({ input: prod, left, top });
  await sharp(background(W, H, bg)).composite(layers).jpeg({ quality: q }).toFile(OUT(out));
  console.log('photos/' + out);
}

// Lasaña (antes: stock Pexels referencial)
await compose('lasana-queso-estirado', 'lasana-queso.jpg', 1600, 2400, { bg: 'ink', fit: 0.74, y: 0.2 });   // B1 / pieza 04: portada "se estira" (texto arriba)
await compose('lasana-horneada', 'lasana-capas.jpg', 1800, 1200, { bg: 'cream', fit: 0.86 });                  // B2 / pieza 04 / 06
await compose('lasana-con-tapa', 'lasana-bandeja.jpg', 1800, 1200, { bg: 'cream', fit: 0.86 });                // A4 / pieza 03
await compose('lasana-queso-estirado', 'lasana-local-1.jpg', 1100, 1958, { bg: 'tan', fit: 0.9, y: 0.6 });     // B3 / pieza 04: "directo del local"
// Bandeja de empanadas congeladas (foto propia con la etiqueta nueva)
await compose('empanadas-congeladas', 'bandeja-solo.jpg', 1414, 1200, { bg: 'cream', fit: 0.9 });
await compose('empanadas-congeladas', 'bandeja-etiqueta.jpg', 1414, 2000, { bg: 'cream', fit: 0.86 });
// Extras para piezas nuevas
await compose('empanadas-horneadas', 'bandeja-horneada.jpg', 1414, 1200, { bg: 'tan', fit: 0.9 });
await compose('tapa-etiqueta', 'tapa-etiqueta.jpg', 1200, 1200, { bg: 'cream', fit: 0.88 });
