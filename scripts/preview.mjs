// Genera previews para revisión:
//  - preview/<pieza>.jpg  -> hoja de contacto de cada pieza / carrusel de Ads
//  - preview/feed-grid.jpg -> cómo se ve el perfil con las 8 piezas orgánicas (la más reciente arriba a la izquierda)
// Uso: npm run preview            -> todo
//      npm run preview -- 03      -> solo carpetas que contienen "03"
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { plan } from './plan.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'preview');
const filter = process.argv[2] ?? '';
const BG = { r: 248, g: 243, b: 231 };
await mkdir(OUT, { recursive: true });

const exportsOf = async (dir) => (await readdir(dir).catch(() => []))
  .filter((f) => f.endsWith('.png') && !f.includes('-1x1')).sort();

// 1) Hojas de contacto
for (const base of ['piezas', 'ads']) {
  const root = path.join(ROOT, base);
  if (!existsSync(root)) continue;
  for (const name of (await readdir(root)).sort()) {
    if (!`${base}/${name}`.includes(filter)) continue;
    const exp = path.join(root, name, 'export');
    const files = await exportsOf(exp);
    if (!files.length) continue;
    const W = 360, G = 16, cols = Math.min(files.length, 6);
    const items = await Promise.all(files.map(async (f) => {
      const buf = await sharp(path.join(exp, f)).resize({ width: W }).toBuffer();
      return { buf, h: (await sharp(buf).metadata()).height };
    }));
    const rowH = Math.max(...items.map((x) => x.h));
    const rows = Math.ceil(items.length / cols);
    const composite = items.map((x, i) => ({ input: x.buf, left: G + (i % cols) * (W + G), top: G + Math.floor(i / cols) * (rowH + G) }));
    await sharp({ create: { width: G + cols * (W + G), height: G + rows * (rowH + G), channels: 3, background: BG } })
      .composite(composite).jpeg({ quality: 86 }).toFile(path.join(OUT, `${base === 'ads' ? 'ad-' : ''}${name}.jpg`));
    console.log(`preview/${base === 'ads' ? 'ad-' : ''}${name}.jpg`);
  }
}

// 2) Grid del perfil (portadas en orden de publicación; lo último arriba a la izquierda)
if (!filter) {
  const covers = plan.map((p) => path.join(ROOT, 'piezas', p.dir, 'export', p.cover)).filter(existsSync).reverse();
  const TW = 360, TH = 450, GAP = 6, ROWS = Math.ceil(covers.length / 3);
  const tiles = await Promise.all(covers.map(async (src, i) => ({
    input: await sharp(src).resize(TW, TH).toBuffer(), left: GAP + (i % 3) * (TW + GAP), top: GAP + Math.floor(i / 3) * (TH + GAP),
  })));
  await sharp({ create: { width: GAP + 3 * (TW + GAP), height: GAP + ROWS * (TH + GAP), channels: 3, background: { r: 255, g: 255, b: 255 } } })
    .composite(tiles).jpeg({ quality: 88 }).toFile(path.join(OUT, 'feed-grid.jpg'));
  console.log('preview/feed-grid.jpg');
}
