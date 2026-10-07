// Genera CAPTIONS.md con todos los captions en orden de publicación, tomados de piezas/*/copy.md
// (sección "## Caption", "## Versión corta" y "## Hashtags"). Fuente única: copy.md + scripts/plan.mjs.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { plan } from './plan.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const section = (md, name) => {
  const start = md.indexOf(`\n## ${name}\n`);
  if (start < 0) return '';
  const from = start + `\n## ${name}\n`.length;
  const end = md.indexOf('\n## ', from);
  return md.slice(from, end < 0 ? undefined : end).trim();
};

let out = `# Captions en orden de publicación\n\n> Generado con \`npm run captions\` desde \`piezas/*/copy.md\`. Para editar un caption, cambiar su \`copy.md\` y volver a generar.\n> Cada bloque trae: fecha, caption completo (listo para copiar), versión corta y hashtags.\n\n`;
for (const p of plan) {
  const md = (await readFile(path.join(ROOT, 'piezas', p.dir, 'copy.md'), 'utf8')).replaceAll('\r\n', '\n');
  out += `---\n\n## Nº ${p.n} · ${p.title}\n**${p.date} · ${p.time}** · ${p.kind} · Capítulo ${p.cap}\n\n`;
  out += `### Caption\n\n${section(md, 'Caption')}\n\n`;
  out += `### Versión corta\n\n${section(md, 'Versión corta')}\n\n`;
  out += `### Hashtags\n\n${section(md, 'Hashtags')}\n\n`;
}
await writeFile(path.join(ROOT, 'CAPTIONS.md'), out);
console.log('CAPTIONS.md');
