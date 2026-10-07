// Renderiza cada pieza (piezas/*/slides.html y ads/*/slides.html) a PNG con Chrome headless.
// Cada <section class="slide" data-file="nombre.png"> se exporta a <carpeta>/export/.
// En ads/ también se genera la variante 1:1 (1080×1080, zona segura central) como <nombre>-1x1.png.
// Uso: npm run render            -> todo
//      npm run render -- 03      -> solo las carpetas cuyo nombre contiene "03"
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { readdir, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const filter = process.argv[2] ?? '';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find(existsSync);
if (!CHROME) throw new Error('No se encontró Chrome/Edge instalado.');

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files', '--font-render-hinting=none'] });
const page = await browser.newPage();

const targets = [];
for (const base of ['piezas', 'ads']) {
  const dir = path.join(ROOT, base);
  if (!existsSync(dir)) continue;
  for (const d of await readdir(dir, { withFileTypes: true })) {
    if (d.isDirectory() && `${base}/${d.name}`.includes(filter)) targets.push({ base, name: d.name, dir: path.join(dir, d.name) });
  }
}
targets.sort((a, b) => (a.base + a.name).localeCompare(b.base + b.name));

for (const t of targets) {
  const html = path.join(t.dir, 'slides.html');
  if (!existsSync(html)) continue;
  const out = path.join(t.dir, 'export');
  await mkdir(out, { recursive: true });
  for (const f of await readdir(out)) if (f.endsWith('.png')) await rm(path.join(out, f));

  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(html).href, { waitUntil: 'networkidle0' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; }))));
  });

  const slides = await page.$$('section.slide');
  for (const slide of slides) {
    const { file } = await slide.evaluate((el) => ({ file: el.dataset.file }));
    const dest = path.join(out, file);
    await slide.screenshot({ path: dest, type: 'png' });
    console.log(`${t.base}/${t.name}/export/${file}`);
    if (t.base === 'ads') {
      const meta = await sharp(dest).metadata();
      if (meta.height === 1350) {
        const sq = file.replace(/\.png$/, '-1x1.png');
        await sharp(dest).extract({ left: 0, top: 135, width: 1080, height: 1080 }).toFile(path.join(out, sq));
      }
    }
  }
}

await browser.close();
