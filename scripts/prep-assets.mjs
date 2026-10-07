// Prepara las fotos que usan las piezas: recortes, cortes de los flyers y limpieza del fondo blanco del plato.
// Fuente: assets/photos/src (originales del cliente + stock Pexels). Salida: assets/photos/*.jpg|png
import sharp from 'sharp';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { writeFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = (f) => path.join(ROOT, 'assets/photos/src', f);
const OUT = (f) => path.join(ROOT, 'assets/photos', f);

// Recorta por fracciones del alto/ancho original (x, y, w, h entre 0 y 1)
async function crop(file, out, [fx, fy, fw, fh], { width, q = 90 } = {}) {
  const meta = await sharp(SRC(file)).metadata();
  let img = sharp(SRC(file)).extract({
    left: Math.round(meta.width * fx), top: Math.round(meta.height * fy),
    width: Math.round(meta.width * fw), height: Math.round(meta.height * fh),
  });
  if (width) img = img.resize({ width });
  await img.jpeg({ quality: q }).toFile(OUT(out));
  console.log('photos/' + out);
}
async function copy(file, out, { width, q = 90 } = {}) {
  let img = sharp(SRC(file));
  if (width) img = img.resize({ width });
  await img.jpeg({ quality: q }).toFile(OUT(out));
  console.log('photos/' + out);
}

// --- Empanadas: cortes de los flyers del cliente (se ve el relleno) ---
await crop('al-horno-cortes-queso-y-pechuga.webp', 'emp-corte-queso.jpg', [0, 0, 1, 0.43]);
await crop('al-horno-cortes-queso-y-pechuga.webp', 'emp-corte-pechuga.jpg', [0, 0.57, 1, 0.43]);
await crop('bajas-en-grasa-cortes-res-y-queso.webp', 'emp-corte-res.jpg', [0, 0, 1, 0.41]);
await crop('bajas-en-grasa-cortes-res-y-queso.webp', 'emp-corte-res-queso.jpg', [0, 0.60, 1, 0.40]);
// --- Estudio (sitio anterior) ---
await copy('DSC01066-jamon-queso.jpg', 'estudio-jamon-queso.jpg');
await copy('DSC01068-hawaiana.jpg', 'estudio-hawaiana.jpg');
await copy('DSC01094-pechuga.jpg', 'estudio-pechuga.jpg');
// --- Empaque ---
// La etiqueta impresa de la bandeja aún muestra el WhatsApp viejo (301 477 0177). Para que ninguna pieza lo promocione,
// se retoca solo ese número y se escribe el oficial (300 516 2421). Hasta reimprimir la etiqueta, usar estas versiones.
// Muestra el color del papel junto al número, tapa el número viejo y escribe el nuevo con Poppins ExtraBold.
const NEW_NUMBER = '300 516 2421';
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find(existsSync);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
async function numberPng(targetW) {
  const pg = await browser.newPage();
  await pg.setViewport({ width: 800, height: 200, deviceScaleFactor: 4 });
  const font = pathToFileURL(path.join(ROOT, 'assets/brand/fonts/poppins-800.woff2')).href;
  const tmp = path.join(ROOT, 'assets/photos/.tmp-number.html');
  await writeFile(tmp, '<meta charset=utf-8><style>@font-face{font-family:P;src:url(' + font + ');font-weight:800}body{margin:0;background:transparent}span{font:800 100px/1 P;color:#1b1918;white-space:nowrap;position:absolute;left:10px;top:10px}</style><span id=n>' + NEW_NUMBER + '</span>');
  await pg.goto(pathToFileURL(tmp).href);
  await pg.evaluate(() => document.fonts.ready);
  const box = await (await pg.$('#n')).boundingBox();
  const buf = await pg.screenshot({ omitBackground: true, clip: { x: box.x, y: box.y, width: box.width, height: box.height } });
  await pg.close();
  return sharp(buf).trim().resize({ width: targetW }).png().toBuffer();
}
async function patchPhone(file, out, r) {
  const base = sharp(SRC(file));
  const pts = [r.x + 12, r.x + Math.round(r.w / 2), r.x + r.w - 12];
  const data = Buffer.concat(await Promise.all(pts.map(async (x) => (await sharp(SRC(file)).extract({ left: x, top: r.y - 4, width: 4, height: 3 }).raw().toBuffer()))));
  let R = 0, G = 0, B = 0; for (let i = 0; i < data.length; i += 3) { R += data[i]; G += data[i + 1]; B += data[i + 2]; }
  const n = data.length / 3, col = { r: Math.round(R / n), g: Math.round(G / n), b: Math.round(B / n) };
  const mask = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + r.w + '" height="' + r.h + '"><filter id="b"><feGaussianBlur stdDeviation="3"/></filter><rect x="6" y="6" width="' + (r.w - 12) + '" height="' + (r.h - 12) + '" fill="#fff" filter="url(#b)"/></svg>');
  const patch = await sharp({ create: { width: r.w, height: r.h, channels: 4, background: { ...col, alpha: 1 } } }).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  const num = await numberPng(r.tw);
  const nh = (await sharp(num).metadata()).height;
  const img = await base.composite([{ input: patch, left: r.x, top: r.y }, { input: num, left: r.tx, top: r.ty - Math.round(nh / 2) }]).png().toBuffer();
  await sharp(img).jpeg({ quality: 92 }).toFile(OUT(out));
  console.log('photos/' + out + ' (WhatsApp retocado)');
}
await patchPhone('bandeja-empaque-etiqueta.webp', 'bandeja-etiqueta.jpg', { x: 558, y: 1214, w: 236, h: 50, tx: 566, ty: 1239, tw: 212 });
await patchPhone('bandeja-lista-para-hornear-con-precios.webp', 'bandeja-precios.jpg', { x: 570, y: 1096, w: 222, h: 50, tx: 578, ty: 1122, tw: 190 });
await browser.close();
await rm(path.join(ROOT, 'assets/photos/.tmp-number.html'), { force: true });
// Bandeja sin textos del flyer: recorta solo la bolsa (con el número ya corregido)
{
  const m = await sharp(OUT('bandeja-precios.jpg')).metadata();
  await sharp(OUT('bandeja-precios.jpg')).extract({ left: 0, top: Math.round(m.height * 0.22), width: m.width, height: Math.round(m.height * 0.60) }).jpeg({ quality: 92 }).toFile(OUT('bandeja-solo.jpg'));
  console.log('photos/bandeja-solo.jpg');
}
// --- Plato con empanadas: fondo blanco -> transparente (alpha por luminosidad) ---
{
  const { data, info } = await sharp(SRC('plato-empanadas-al-horno-logo.png')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  // recorta el logo (parte alta) y deja solo el plato
  const W = info.width, H = info.height, top = Math.round(H * 0.40);
  const out = Buffer.alloc(W * (H - top) * 4);
  for (let y = top; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 3, o = ((y - top) * W + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const min = Math.min(r, g, b);
    const a = min >= 246 ? 0 : min >= 226 ? Math.round((246 - min) / 20 * 255) : 255;
    out[o] = r; out[o + 1] = g; out[o + 2] = b; out[o + 3] = a;
  }
  await sharp(out, { raw: { width: W, height: H - top, channels: 4 } }).trim().png().toFile(OUT('plato-corte.png'));
  console.log('photos/plato-corte.png');
}
// --- Lasaña ---
await copy('pexels-34474026-queso-estirado.jpg', 'lasana-queso.jpg', { width: 1600 });          // stock: foto referencial
await copy('lasana-bandeja-aluminio-pexels-5724557.jpg', 'lasana-bandeja.jpg');                  // stock: foto referencial
await copy('lasana-capas-pexels-13823542.jpg', 'lasana-capas.jpg');                              // stock: foto referencial
await copy('frame-lasana-hero.webp', 'lasana-local-1.jpg');                                      // frame real del local
await copy('frame-lasana-a.webp', 'lasana-local-2.jpg');
await copy('frame-lasana-b.webp', 'lasana-local-3.jpg');
// La lasaña real del flyer (bandeja de aluminio gratinada)
await crop('flyer-lista-de-precios.webp', 'lasana-flyer.jpg', [0.305, 0.655, 0.22, 0.235]);
// Logo del cliente (plato con logo) para referencia
await copy('plato-empanadas-al-horno-logo.png', 'logo-plato.jpg');
