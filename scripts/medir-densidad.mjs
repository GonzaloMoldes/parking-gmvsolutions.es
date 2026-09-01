// Mide la densidad editorial de las paginas comerciales sobre el HTML ya
// construido. Ejecutar despues de `npm run build`:
//
//   node scripts/medir-densidad.mjs
//
// Referencia: PLAN_SIMPLIFICACION_EDITORIAL_WEB_2026-08.md (Anexo III).
import fs from 'fs';

const ROOT = 'dist/client';
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = d + '/' + e.name;
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
})(ROOT);

const strip = (s) => s
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ');

const wc = (s) => {
  const t = s.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ')
             .replace(/\s+/g, ' ').trim();
  return t ? t.split(' ').length : 0;
};

const rows = [];
let glued = 0;

for (const f of files) {
  const url = '/' + f.replace(ROOT + '/', '').replace(/index\.html$/, '');
  if ((url.startsWith('/blog/') && url !== '/blog/') || url.includes('/legal/') || url.includes('404')) continue;

  const html = fs.readFileSync(f, 'utf8');
  const m = html.match(/<main[\s\S]*?<\/main>/i);
  if (!m) continue;
  const main = strip(m[0]);

  // Defecto A1: <br> que pega palabras al extraer texto.
  glued += (main.match(/(\S)<br\b[^>]*>(\S)/gi) || []).length;

  // La FAQ se separa del resto. Va plegada en <details> y la plantilla la deja
  // FUERA del presupuesto visible, asi que no puede entrar en el denominador:
  // si entra, ninguna pagina llega nunca al 40 % del bloque mayor, porque la
  // propia FAQ pasa a ser el bloque mayor.
  const secs = [...main.matchAll(/<section\b[^>]*>([\s\S]*?)<\/section>/gi)]
    .map((x) => ({ w: wc(x[1]), faq: /faq-section|faq-item/.test(x[1]) }))
    .filter((s) => s.w > 0);

  const presu = secs.filter((s) => !s.faq);
  const budget = presu.length ? presu.reduce((a, s) => a + s.w, 0) : wc(main);
  const max = presu.length ? Math.max(...presu.map((s) => s.w)) : wc(main);

  rows.push({
    url,
    dom: wc(main),
    presupuesto: budget,
    secciones: presu.length,
    mayorPct: budget ? Math.round((max / budget) * 100) : 0,
    h3: (main.match(/<h3\b/gi) || []).length,
  });
}

const med = (a) => { const v = [...a].sort((x, y) => x - y); return v[Math.floor(v.length / 2)]; };

rows.sort((a, b) => b.presupuesto - a.presupuesto);
console.table(rows);

console.log('');
console.log('-- Criterios de aceptacion -----------------------');
console.log('Paginas comerciales .............', rows.length);
console.log('Presupuesto visible, mediana ....', med(rows.map((r) => r.presupuesto)), '  (objetivo < 500)');
console.log('Secciones, mediana ..............', med(rows.map((r) => r.secciones)), '  (objetivo 4-5, sin contar FAQ)');
console.log('% bloque mayor, mediana .........', med(rows.map((r) => r.mayorPct)) + ' %', '(objetivo > 40 %)');
console.log('Texto pegado por <br> ...........', glued, '  (objetivo 0)');
console.log('');
console.log('`dom` es todo el texto indexable, e incluye las respuestas de FAQ plegadas.');
console.log('`presupuesto` es lo que ve el lector sin desplegar nada: la base sobre la');
console.log('que esta definida la plantilla de PLANTILLA_PAGINA_COMERCIAL.md.');
