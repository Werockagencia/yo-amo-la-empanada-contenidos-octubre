// Genera web/ : versión liviana de la página de revisión para publicar como Artifact (o en cualquier hosting estático).
//  - web/img/*.jpg  : todas las piezas comprimidas (900 px de ancho)
//  - web/artifact.html : fragmento de página (sin <html>/<head>), con tema claro y oscuro
// Fuente: scripts/plan.mjs + piezas|ads/*/copy.md + export/*.png
import { readFile, writeFile, readdir, mkdir, rm } from 'node:fs/promises';
import sharp from 'sharp';
import path from 'node:path';
import { plan } from './plan.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const WEB = path.join(ROOT, 'web');
const IMG = path.join(WEB, 'img');
await rm(IMG, { recursive: true, force: true });
await mkdir(IMG, { recursive: true });

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const section = (md, name) => {
  const key = `\n## ${name}\n`;
  const start = md.indexOf(key);
  if (start < 0) return '';
  const from = start + key.length;
  const end = md.indexOf('\n## ', from);
  return md.slice(from, end < 0 ? undefined : end).trim();
};
const md2html = (s) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/`(.+?)`/g, '<code>$1</code>')
  .split('\n').map((l) => (l.startsWith('- ') ? `<li>${l.slice(2)}</li>` : l.trim() ? `<p>${l}</p>` : '')).join('')
  .replace(/(<li>.*?<\/li>)+/g, (m) => `<ul>${m}</ul>`);

// Comprime las exportaciones a JPG y devuelve las rutas relativas
async function images(dir, prefix) {
  const exp = path.join(ROOT, dir, 'export');
  const files = (await readdir(exp).catch(() => [])).filter((f) => f.endsWith('.png') && !f.includes('-1x1')).sort();
  const out = [];
  for (const f of files) {
    const name = `${prefix}-${f.replace(/\.png$/, '.jpg')}`;
    await sharp(path.join(exp, f)).resize({ width: 900 }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(IMG, name));
    out.push(`img/${name}`);
  }
  return out;
}

let pieces = '';
for (const p of plan) {
  const dir = `piezas/${p.dir}`;
  const md = (await readFile(path.join(ROOT, dir, 'copy.md'), 'utf8')).replaceAll('\r\n', '\n');
  const imgs = await images(dir, `n${p.n}`);
  const header = md.split('\n').slice(1, 5).join('\n').replace(/^\*\*Capítulo.*\n?/m, '');
  pieces += `
  <article class="piece" id="n${p.n}">
    <div class="meta"><span class="no">Nº ${p.n}</span><span>${esc(p.cap)}</span><span>${esc(p.date)} · ${esc(p.time)}</span><span>${esc(p.kind)}</span></div>
    <h3>${esc(p.title)}</h3>
    <div class="strip">${imgs.map((f, i) => `<a href="${f}" target="_blank" rel="noopener"><img loading="lazy" src="${f}" alt="Slide ${i + 1} de ${imgs.length}"></a>`).join('')}</div>
    <div class="cols">
      <div>
        <h4>Caption <button class="copy" type="button" data-t="cap-${p.n}">Copiar</button></h4>
        <pre id="cap-${p.n}">${esc(section(md, 'Caption'))}</pre>
        <h4>Versión corta <button class="copy" type="button" data-t="sh-${p.n}">Copiar</button></h4>
        <pre id="sh-${p.n}">${esc(section(md, 'Versión corta'))}</pre>
        <h4>Hashtags <button class="copy" type="button" data-t="ht-${p.n}">Copiar</button></h4>
        <pre id="ht-${p.n}">${esc(section(md, 'Hashtags'))}</pre>
      </div>
      <div class="notes">
        <h4>Rol y audiencia</h4>${md2html(header)}
        <h4>Notas y validaciones</h4>${md2html(section(md, 'Notas'))}
      </div>
    </div>
  </article>`;
}

const adDefs = [
  ['ads/carrusel-a-bandeja-del-congelador', 'adA', 'A', 'La bandeja del congelador', 'Ángulo racional: producto, precio y cómo pedir. Bandejas x5 y lasaña lista para hornear.', ['3 textos principales por carrusel', 'Titular y descripción por tarjeta', 'Mensaje de WhatsApp prellenado']],
  ['ads/carrusel-b-se-estira', 'adB', 'B', 'Se estira', 'Ángulo antojo: el queso estirado de la lasaña, con una tarjeta real del local y las empanadas como extra.', ['3 textos principales por carrusel', 'Titular y descripción por tarjeta', 'Mensaje de WhatsApp prellenado']],
];
let ads = '';
for (const [dir, pre, letter, title, desc] of adDefs) {
  const imgs = await images(dir, pre);
  ads += `
  <article class="piece">
    <div class="meta"><span class="no">Ad ${letter}</span><span>6 tarjetas</span><span>4:5 y 1:1</span></div>
    <h3>${esc(title)}</h3><p class="lead">${esc(desc)}</p>
    <div class="strip">${imgs.map((f, i) => `<a href="${f}" target="_blank" rel="noopener"><img loading="lazy" src="${f}" alt="Tarjeta ${i + 1}"></a>`).join('')}</div>
  </article>`;
}

await sharp(path.join(ROOT, 'preview/feed-grid.jpg')).resize({ width: 900 }).jpeg({ quality: 84 }).toFile(path.join(IMG, 'feed-grid.jpg'));

const html = `<title>Parrilla Yo Amo la Empanada</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Russo+One&display=swap">
<style>
/* Concepto: carpeta de revisión editorial; bloques claros con corazón rojo de marca, miniaturas en tira horizontal. */
:root{
  --bg:#F8F3E7; --surface:#FFFFFF; --fg:#14100d; --muted:#5a4c3b; --line:#E8E4D9; --chip:#F1EADA;
  --accent:#E41E13; --gold:#86610d; --ink:#14100d; --ok:#1faa4b;
  --display:'Russo One','Arial Black',sans-serif; --sans:'Poppins',system-ui,sans-serif;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --bg:#14100d; --surface:#201915; --fg:#f4ede0; --muted:#b9ab94; --line:#3a3026; --chip:#2b221c; --accent:#ff4a3d; --gold:#e3b95a; color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#14100d; --surface:#201915; --fg:#f4ede0; --muted:#b9ab94; --line:#3a3026; --chip:#2b221c; --accent:#ff4a3d; --gold:#e3b95a; color-scheme:dark}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--fg);font:400 16px/1.6 var(--sans);margin:0;padding-inline:0}
.hero{background:linear-gradient(150deg,#E41E13,#7E0A05);color:#fff;padding:56px 16px 48px}
.in{max-width:1180px;margin-inline:auto;padding-inline:16px}
.hero .in{padding-inline:0}
.hero .k{font:600 12px/1 var(--sans);letter-spacing:.24em;text-transform:uppercase;color:#f3d58a}
.hero h1{font:400 clamp(34px,6.5vw,72px)/.98 var(--display);margin:18px 0 14px;letter-spacing:-.01em;text-wrap:balance}
.hero p{max-width:620px;margin:0;opacity:.94}
nav{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
nav .in{display:flex;gap:6px;overflow-x:auto;padding-block:10px}
nav a{white-space:nowrap;padding:8px 16px;border-radius:999px;font:600 14px/1 var(--sans);color:var(--fg);text-decoration:none}
nav a:hover,nav a:focus-visible{background:var(--chip);outline:none}
section.blk{padding-block:52px 4px}
h2{font:400 clamp(28px,4vw,44px)/1.05 var(--display);margin:0 0 8px;text-wrap:balance}
.sub{color:var(--muted);margin:0 0 26px;max-width:720px}
.tbl{overflow-x:auto;border-radius:16px;border:1px solid var(--line);background:var(--surface)}
table{width:100%;border-collapse:collapse;font-size:15px;min-width:560px}
th,td{text-align:left;padding:12px 16px;border-bottom:1px solid var(--line);vertical-align:top}
tr:last-child td{border-bottom:0}
th{font:600 12px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
td a{color:var(--fg);font-weight:600}
.piece{background:var(--surface);border:1px solid var(--line);border-radius:24px;padding:24px;margin:0 0 32px;min-width:0}
.meta{display:flex;flex-wrap:wrap;gap:8px;font:600 11.5px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}
.meta span{padding:7px 12px;border-radius:999px;background:var(--chip)}
.meta .no{background:var(--accent);color:#fff}
.piece h3{font:400 clamp(24px,3.4vw,36px)/1.05 var(--display);margin:14px 0 16px;text-wrap:balance}
.lead{margin:-6px 0 16px;color:var(--muted);max-width:720px}
.strip{display:flex;gap:14px;overflow-x:auto;padding:4px 2px 16px;scroll-snap-type:x proximity}
.strip a{flex:0 0 auto;scroll-snap-align:start}
.strip img{height:400px;width:auto;max-width:none;border-radius:14px;display:block;box-shadow:0 8px 22px rgba(20,16,13,.22)}
.cols{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:28px;margin-top:8px}
@media(max-width:860px){.cols{grid-template-columns:minmax(0,1fr)}.strip img{height:320px}.piece{padding:18px}}
h4{font:600 12px/1 var(--sans);letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:18px 0 8px;display:flex;align-items:center;gap:10px}
pre{white-space:pre-wrap;overflow-wrap:anywhere;font:400 15px/1.55 var(--sans);background:var(--chip);border-radius:14px;padding:14px 16px;margin:0}
.copy{font:600 12px/1 var(--sans);border:0;background:var(--fg);color:var(--bg);border-radius:999px;padding:8px 14px;cursor:pointer}
.copy:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.copy.ok{background:var(--ok);color:#fff}
.notes{min-width:0}.notes ul{padding-left:18px;margin:0}.notes p{margin:0 0 8px}.notes li{margin-bottom:6px}
code{background:var(--chip);padding:1px 6px;border-radius:6px;font-size:13px;overflow-wrap:anywhere}
.grid{display:block;width:100%;max-width:420px;border-radius:16px;box-shadow:0 10px 26px rgba(20,16,13,.22)}
footer{padding-block:36px 56px;color:var(--muted);font-size:14px}
</style>
<div class="hero"><div class="in"><div class="k">We Rock · Yo ❤ La Empanada al Horno</div><h1>Campaña Congelados<br>octubre 2026</h1><p>8 contenidos para Instagram y Facebook, 2 carruseles de Ads y el kit para montar las campañas. Revisa cada pieza, copia su caption y valida lo pendiente.</p></div></div>
<nav><div class="in"><a href="#calendario">Calendario</a><a href="#parrilla">Parrilla</a><a href="#ads">Anuncios</a><a href="#perfil">Perfil</a><a href="#pendientes">Por validar</a></div></nav>
<div class="in">
<section class="blk" id="calendario"><h2>Calendario</h2><p class="sub">Dos publicaciones por semana, martes y jueves. Si cambia el arranque, se mueven todas las fechas.</p>
<div class="tbl"><table><tr><th>Nº</th><th>Pieza</th><th>Capítulo</th><th>Formato</th><th>Fecha</th></tr>
${plan.map((p) => `<tr><td>${p.n}</td><td><a href="#n${p.n}">${esc(p.title)}</a></td><td>${esc(p.cap)}</td><td>${esc(p.kind)}</td><td>${esc(p.date)} · ${esc(p.time)}</td></tr>`).join('')}
</table></div></section>
<section class="blk" id="parrilla"><h2>Parrilla de contenidos</h2><p class="sub">Tres capítulos: <b>I · Conócelas</b> (qué hacemos y por qué es distinto), <b>II · El congelador</b> (el producto de la campaña) y <b>III · Para todos</b> (eventos, tiendas y prueba social). Toca una imagen para verla grande.</p>${pieces}</section>
<section class="blk" id="ads"><h2>Anuncios</h2><p class="sub">Dos carruseles que compiten entre sí: oferta contra antojo. Los 2 reels llegan de producción audiovisual y se cargan con el mismo kit. Textos, titulares y configuración completos en el repositorio.</p>${ads}</section>
<section class="blk" id="perfil"><h2>Cómo se ve el perfil</h2><p class="sub">Las 8 portadas, la más reciente arriba a la izquierda.</p><img class="grid" src="img/feed-grid.jpg" alt="Cuadrícula del perfil con las 8 portadas"></section>
<section class="blk" id="pendientes"><h2>Por validar con el cliente</h2><p class="sub">Lo que no se puede afirmar todavía y por eso no aparece en las piezas.</p>
<div class="tbl"><table><tr><th>Tema</th><th>Qué necesitamos</th></tr>
<tr><td>Etiqueta de la bandeja</td><td>Reimprimir con 300 516 2421. Hoy dice 301 477 0177; en las fotos de las piezas está corregido digitalmente.</td></tr>
<tr><td>Precios y ahorro</td><td>Confirmar el flyer y que se muestre "$3.980 / $2.580 cada una" y "Ahorras $5.100 / $4.600".</td></tr>
<tr><td>Domicilio y pagos</td><td>Zonas, costo, horario y formas de pago.</td></tr>
<tr><td>Horneado</td><td>Temperatura y tiempo para empanadas y lasaña congeladas.</td></tr>
<tr><td>Fotos y video</td><td>Foto real de la lasaña, video original del queso estirado y foto de cada sabor.</td></tr>
<tr><td>Reseñas</td><td>Permiso de las personas citadas en el Nº 08.</td></tr>
<tr><td>Canal tiendas</td><td>Lista de precios al por mayor, pedido mínimo, vida útil y registros sanitarios.</td></tr>
</table></div></section>
<footer>Piezas diseñadas con la tipografía y los colores de la marca. Las fotos marcadas "Foto referencial" son de stock (Pexels, uso comercial gratuito).</footer>
</div>
<script>
document.querySelectorAll('.copy').forEach(function(b){
  b.addEventListener('click',function(){
    var el=document.getElementById(b.dataset.t);
    function done(){b.textContent='Copiado';b.classList.add('ok');setTimeout(function(){b.textContent='Copiar';b.classList.remove('ok')},1600)}
    function pick(){var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selecciona y copia'}
    try{navigator.clipboard.writeText(el.innerText).then(done,pick)}catch(e){pick()}
  })
});
</script>
`;
await writeFile(path.join(WEB, 'artifact.html'), html);
// Página completa para hosting estático (GitHub Pages): web/index.html + redirección desde la raíz
const head = '<!doctype html>\n<html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n';
await writeFile(path.join(WEB, 'index.html'), head + html + '</html>\n');
await writeFile(path.join(ROOT, 'index.html'), '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=web/"><title>Parrilla Yo Amo la Empanada</title><a href="web/">Abrir la parrilla</a>\n');
const all = await readdir(IMG);
console.log(`web/artifact.html + ${all.length} imágenes`);
