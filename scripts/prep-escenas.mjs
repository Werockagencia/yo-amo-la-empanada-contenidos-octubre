// Escenas fotográficas a pantalla completa para los carruseles de Ads (1080×1350 a 1.5x).
// El producto (recorte de la sesión de octubre 2026) va grande sobre un fondo de estudio con luz, sombra de contacto y grano.
// Salida: assets/photos/escena-*.jpg · Corre después de prep-fotos-nuevas.mjs
import sharp from 'sharp';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = (f) => path.join(ROOT, 'assets/photos/src/nuevas', f + '.png');
const OUT = (f) => path.join(ROOT, 'assets/photos', f);
const W = 1620, H = 2025, S = 1.5; // trabajamos en coordenadas de 1080×1350 y se escalan

const BG = {
  brasa: ['#7a4420', '#34190b', '#0b0705'],
  rojo: ['#e0301f', '#9a1209', '#3a0603'],
  crema: ['#fffaf0', '#efe1c3', '#cdb98f'],
};
const bg = (kind, lx = 0.5, ly = 0.5) => {
  const [a, b, c] = BG[kind];
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>
    <radialGradient id="g" cx="${lx * 100}%" cy="${ly * 100}%" r="78%"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/><rect width="${W}" height="${H}" filter="url(#n)" opacity="${kind === 'crema' ? 0.06 : 0.09}"/></svg>`);
};
const shadow = (cx, by, w, kind) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><filter id="b"><feGaussianBlur stdDeviation="${Math.round(w * 0.035)}"/></filter></defs>
  <ellipse cx="${cx}" cy="${by}" rx="${w * 0.47}" ry="${w * 0.055}" fill="#000" opacity="${kind === 'crema' ? 0.28 : 0.6}" filter="url(#b)"/></svg>`);

async function scene(out, kind, items, light = [0.5, 0.5]) {
  const layers = [];
  for (const it of items) {
    const w = Math.round(it.w * S);
    let img = sharp(SRC(it.name)).resize({ width: w });
    const meta = await sharp(await img.toBuffer()).metadata();
    let buf = await img.toBuffer();
    let bw = meta.width, bh = meta.height;
    if (it.rot) {
      const r = await sharp(buf).rotate(it.rot, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer({ resolveWithObject: true });
      buf = r.data; bw = r.info.width; bh = r.info.height;
    }
    const left = Math.round(it.cx * S - bw / 2), top = Math.round(it.cy * S - bh / 2);
    layers.push({ input: shadow(it.cx * S, top + bh * 0.97, bw, kind), left: 0, top: 0 });
    layers.push({ input: buf, left, top });
  }
  await sharp(bg(kind, light[0], light[1])).composite(layers).jpeg({ quality: 90, mingen: 0 }).toFile(OUT(out));
  console.log('photos/' + out);
}

// Carrusel A (producto arriba y grande; el texto va abajo)
await scene('escena-a1.jpg', 'brasa', [{ name: 'empanadas-congeladas', cx: 320, cy: 540, w: 470, rot: -9 }, { name: 'empanadas-horneadas', cx: 770, cy: 520, w: 500, rot: 7 }]);
await scene('escena-a2.jpg', 'brasa', [{ name: 'empanadas-congeladas', cx: 540, cy: 540, w: 560 }]);
await scene('escena-a3.jpg', 'brasa', [{ name: 'empanadas-horneadas', cx: 540, cy: 540, w: 570 }]);
await scene('escena-a4.jpg', 'brasa', [{ name: 'lasana-con-tapa', cx: 540, cy: 530, w: 1000 }]);
await scene('escena-a5.jpg', 'rojo', [{ name: 'tapa-etiqueta', cx: 560, cy: 400, w: 440, rot: 5 }], [0.5, 0.35]);
await scene('escena-a6.jpg', 'brasa', [{ name: 'lasana-queso-estirado', cx: 540, cy: 530, w: 640 }]);
// Carrusel B
await scene('escena-b1.jpg', 'brasa', [{ name: 'lasana-queso-estirado', cx: 540, cy: 530, w: 650 }]);
await scene('escena-b2.jpg', 'crema', [{ name: 'lasana-horneada', cx: 560, cy: 570, w: 850 }]);
await scene('escena-b3.jpg', 'rojo', [{ name: 'lasana-con-tapa', cx: 540, cy: 540, w: 1000 }]);
await scene('escena-b4.jpg', 'brasa', [{ name: 'empanadas-congeladas', cx: 330, cy: 545, w: 460, rot: -8 }, { name: 'empanadas-horneadas', cx: 770, cy: 520, w: 490, rot: 6 }]);
await scene('escena-b5.jpg', 'brasa', [{ name: 'lasana-con-tapa', cx: 400, cy: 500, w: 640, rot: -3 }, { name: 'lasana-horneada', cx: 770, cy: 650, w: 500, rot: 4 }]);
await scene('escena-b6.jpg', 'rojo', [{ name: 'lasana-queso-estirado', cx: 540, cy: 520, w: 640 }]);
