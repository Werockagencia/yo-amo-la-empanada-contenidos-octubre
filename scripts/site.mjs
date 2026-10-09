// Genera completo.html: página para revisar la parrilla y los anuncios con el cliente
// (carruseles, captions con botón "Copiar", calendario y pendientes). Rutas relativas: funciona abriendo el archivo
// o publicado en GitHub Pages. Fuente: scripts/plan.mjs + piezas/*/copy.md + piezas|ads/*/export/*.png
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { plan } from './plan.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
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
const exportsOf = async (dir) => (await readdir(path.join(ROOT, dir, 'export')).catch(() => []))
  .filter((f) => f.endsWith('.png') && !f.includes('-1x1')).sort();

let pieces = '';
for (const p of plan) {
  const dir = `piezas/${p.dir}`;
  const md = (await readFile(path.join(ROOT, dir, 'copy.md'), 'utf8')).replaceAll('\r\n', '\n');
  const files = await exportsOf(dir);
  const caption = section(md, 'Caption');
  const short = section(md, 'Versión corta');
  const tags = section(md, 'Hashtags');
  const notes = section(md, 'Notas');
  const header = md.split('\n').slice(1, 5).join('\n');
  pieces += `
  <article class="piece" id="n${p.n}">
    <header>
      <div class="meta"><span class="no">Nº ${p.n}</span><span>${esc(p.cap)}</span><span>${esc(p.date)} · ${esc(p.time)}</span><span>${esc(p.kind)}</span></div>
      <h3>${esc(p.title)}</h3>
    </header>
    <div class="strip">${files.map((f, i) => `<a href="${dir}/export/${f}" target="_blank"><img loading="lazy" src="${dir}/export/${f}" alt="Slide ${i + 1} de ${files.length}"></a>`).join('')}</div>
    <div class="cols">
      <div>
        <h4>Caption <button class="copy" data-t="cap-${p.n}">Copiar</button></h4>
        <pre id="cap-${p.n}">${esc(caption)}</pre>
        <h4>Versión corta <button class="copy" data-t="sh-${p.n}">Copiar</button></h4>
        <pre id="sh-${p.n}">${esc(short)}</pre>
        <h4>Hashtags <button class="copy" data-t="ht-${p.n}">Copiar</button></h4>
        <pre id="ht-${p.n}">${esc(tags)}</pre>
      </div>
      <div class="notes">
        <h4>Rol y audiencia</h4>${md2html(header.replace(/^\*\*Capítulo.*\n?/m, ''))}
        <h4>Notas y validaciones</h4>${md2html(notes)}
      </div>
    </div>
  </article>`;
}

const adDirs = [
  ['ads/carrusel-a-bandeja-del-congelador', 'Carrusel A · La bandeja del congelador', 'Ángulo racional: producto, precio y cómo pedir.'],
  ['ads/carrusel-b-se-estira', 'Carrusel B · Se estira', 'Ángulo antojo: el queso estirado de la lasaña.'],
];
let ads = '';
for (const [dir, title, desc] of adDirs) {
  const files = await exportsOf(dir);
  ads += `
  <article class="piece ad">
    <header><div class="meta"><span class="no">Ad</span><span>4:5 y 1:1 incluidas</span></div><h3>${esc(title)}</h3><p class="lead">${esc(desc)}</p></header>
    <div class="strip">${files.map((f, i) => `<a href="${dir}/export/${f}" target="_blank"><img loading="lazy" src="${dir}/export/${f}" alt="Tarjeta ${i + 1}"></a>`).join('')}</div>
    <p><a class="btn" href="${dir}/copy.md">Ver textos, titulares y configuración (copy.md)</a></p>
  </article>`;
}

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Yo Amo la Empanada · Campaña Congelados · octubre 2026</title>
<style>
@font-face{font-family:'Russo One';src:url(assets/brand/fonts/russo-one.woff2) format('woff2')}
@font-face{font-family:Poppins;src:url(assets/brand/fonts/poppins-400.woff2) format('woff2');font-weight:400}
@font-face{font-family:Poppins;src:url(assets/brand/fonts/poppins-600.woff2) format('woff2');font-weight:600}
@font-face{font-family:Poppins;src:url(assets/brand/fonts/poppins-700.woff2) format('woff2');font-weight:700}
:root{--red:#E41E13;--ink:#14100d;--cream:#F8F3E7;--sand:#E8E4D9;--tan:#DACCAC;--gold:#86610d}
*{box-sizing:border-box}body{margin:0;background:var(--cream);color:var(--ink);font:400 16px/1.6 Poppins,system-ui,sans-serif}
.wrap{max-width:1240px;margin:0 auto;padding:0 24px}
.hero{background:linear-gradient(150deg,#E41E13,#7E0A05);color:#fff;padding:64px 0 56px}
.hero .k{font:600 13px/1 Poppins;letter-spacing:.24em;text-transform:uppercase;color:#f3d58a}
.hero h1{font:400 clamp(36px,6vw,72px)/.98 'Russo One';margin:18px 0 14px;letter-spacing:-.01em}.hero p{max-width:640px;opacity:.92;margin:0}
nav{position:sticky;top:0;z-index:5;background:rgba(248,243,231,.92);backdrop-filter:blur(8px);border-bottom:1px solid rgba(20,16,13,.12)}
nav .wrap{display:flex;gap:6px;overflow:auto;padding:10px 24px}nav a{white-space:nowrap;padding:8px 16px;border-radius:999px;font:600 14px/1 Poppins;color:var(--ink);text-decoration:none}nav a:hover{background:var(--sand)}
section.blk{padding:56px 0 8px}h2{font:400 clamp(28px,4vw,44px)/1.05 'Russo One';margin:0 0 8px}.sub{color:#5a4c3b;margin:0 0 28px;max-width:720px}
table{display:block;overflow-x:auto;width:100%;border-collapse:collapse;background:#fff;border-radius:18px;overflow:hidden;font-size:15px}th,td{text-align:left;padding:12px 16px;border-bottom:1px solid var(--sand)}th{background:var(--ink);color:#fff;font-weight:600}
.piece{background:#fff;border-radius:28px;padding:28px;margin:0 0 36px;box-shadow:0 14px 34px rgba(20,16,13,.08)}
.meta{display:flex;flex-wrap:wrap;gap:8px;font:600 12px/1 Poppins;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}.meta span{padding:7px 12px;border-radius:999px;background:var(--cream)}.meta .no{background:var(--red);color:#fff}
.piece h3{font:400 clamp(26px,3.4vw,38px)/1.05 'Russo One';margin:14px 0 18px}.lead{margin:-6px 0 16px;color:#5a4c3b}
.strip{display:flex;gap:14px;overflow-x:auto;padding:4px 2px 18px;scroll-snap-type:x mandatory}.strip a{flex:0 0 auto;scroll-snap-align:start}.strip img{height:420px;width:auto;border-radius:16px;display:block;box-shadow:0 8px 22px rgba(20,16,13,.18)}
.cols{display:grid;grid-template-columns:1.2fr 1fr;gap:28px;margin-top:10px}@media(max-width:900px){.cols{grid-template-columns:1fr}.strip img{height:340px}}
h4{font:600 13px/1 Poppins;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:18px 0 8px;display:flex;align-items:center;gap:10px}
.cols>div{min-width:0}pre{overflow-wrap:anywhere;white-space:pre-wrap;font:400 15px/1.55 Poppins;background:var(--cream);border-radius:14px;padding:14px 16px;margin:0}
.copy{font:600 12px/1 Poppins;border:0;background:var(--ink);color:#fff;border-radius:999px;padding:8px 14px;cursor:pointer}.copy.ok{background:#1faa4b}
.notes ul{padding-left:18px;margin:0}.notes p{margin:0 0 8px}.notes li{margin-bottom:6px}code{overflow-wrap:anywhere;background:var(--sand);padding:1px 6px;border-radius:6px;font-size:13px}
.btn{display:inline-block;background:var(--red);color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px}
.grid{display:block;width:100%;max-width:420px;border-radius:18px;box-shadow:0 10px 26px rgba(20,16,13,.18)}
footer{padding:40px 0 64px;color:#5a4c3b;font-size:14px}
</style></head><body>
<div class="hero"><div class="wrap"><div class="k">We Rock · Yo ❤ La Empanada al Horno</div><h1>Campaña Congelados<br>octubre 2026</h1><p>8 contenidos para Instagram y Facebook, 2 carruseles de Ads y el kit para montar las campañas. Todo en un solo lugar para revisar y aprobar.</p></div></div>
<nav><div class="wrap"><a href="#calendario">Calendario</a><a href="#parrilla">Parrilla (8)</a><a href="#ads">Anuncios</a><a href="#grid">Cómo se ve el perfil</a><a href="#pendientes">Por validar</a></div></nav>
<div class="wrap">
<section class="blk" id="calendario"><h2>Calendario</h2><p class="sub">Dos publicaciones por semana, martes y jueves. Si cambia el arranque, se mueven todas las fechas.</p>
<table><tr><th>Nº</th><th>Pieza</th><th>Capítulo</th><th>Formato</th><th>Fecha</th></tr>
${plan.map((p) => `<tr><td>${p.n}</td><td><a href="#n${p.n}">${esc(p.title)}</a></td><td>${esc(p.cap)}</td><td>${esc(p.kind)}</td><td>${esc(p.date)} · ${esc(p.time)}</td></tr>`).join('')}
</table></section>
<section class="blk" id="parrilla"><h2>Parrilla de contenidos</h2><p class="sub">Tres capítulos: <b>I · Conócelas</b> (qué hacemos y por qué es distinto), <b>II · El congelador</b> (el producto de la campaña) y <b>III · Para todos</b> (eventos, tiendas y prueba social). Toca una imagen para verla grande.</p>${pieces}</section>
<section class="blk" id="ads"><h2>Anuncios</h2><p class="sub">Dos carruseles que compiten entre sí (oferta vs antojo). Los 2 reels llegan de producción audiovisual y se cargan con el mismo kit.</p>${ads}</section>
<section class="blk" id="grid"><h2>Cómo se ve el perfil</h2><p class="sub">Las 8 portadas, la más reciente arriba a la izquierda.</p><img class="grid" src="preview/feed-grid.jpg" alt="Cuadrícula del perfil"></section>
<section class="blk" id="pendientes"><h2>Por validar con el cliente</h2><p class="sub">Lo que no podemos afirmar todavía. Está completo en <code>campana/08-pendientes-cliente.md</code>.</p>
<table><tr><th>Tema</th><th>Qué necesitamos</th></tr>
<tr><td>Etiqueta de la bandeja</td><td>Reimprimir con 300 516 2421 (hoy dice 301 477 0177; en las fotos está corregido digitalmente)</td></tr>
<tr><td>Precios y ahorro</td><td>Confirmar el flyer y que se muestre "$3.980 / $2.580 cada una" y "Ahorras $5.100 / $4.600"</td></tr>
<tr><td>Domicilio y pagos</td><td>Zonas, costo, horario y formas de pago</td></tr>
<tr><td>Horneado</td><td>Temperatura y tiempo para hornear las empanadas congeladas (la lasaña ya trae ~5 min de microondas)</td></tr>
<tr><td>Fotos y video</td><td>Foto real de la lasaña, video original del queso estirado y foto de cada sabor</td></tr>
<tr><td>Reseñas</td><td>Permiso de las personas citadas en el Nº 08</td></tr>
<tr><td>Canal tiendas</td><td>Lista de precios mayorista, pedido mínimo, vida útil y registros sanitarios</td></tr>
</table></section>
<footer>Piezas diseñadas en HTML/CSS con la tipografía de la marca y exportadas a PNG. Las fotos marcadas "Foto referencial" son de stock (Pexels, uso comercial gratuito).</footer>
</div>
<script>document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',async()=>{const t=document.getElementById(b.dataset.t).innerText;try{await navigator.clipboard.writeText(t);b.textContent='¡Copiado!';b.classList.add('ok');setTimeout(()=>{b.textContent='Copiar';b.classList.remove('ok')},1600)}catch(e){b.textContent='Selecciona y copia'}}));</script>
</body></html>`;
await writeFile(path.join(ROOT, 'completo.html'), html);
console.log('completo.html');
