// Inyecta masthead, folio y grano en cada <section class="slide">.
//   data-n="03"      -> "Nº 03" en el masthead (omitir = sin número)
//   data-i / data-of -> folio "02 / 06" + "Desliza" (omitir data-of = sin folio)
//   data-nomast, data-nofolio, data-last (último slide: sin "Desliza")
const HEART = '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
const ARROW = '<svg viewBox="0 0 34 14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1 7h30M25 1l7 6-7 6"/></svg>';
window.HEART = HEART;

const logo = (cls = '') => `<span class="logo ${cls}"><span class="l1"><span>Yo</span>${HEART}<span>La Empanada</span></span><span class="l2">al <b>Horno</b></span></span>`;
window.logo = logo;

document.querySelectorAll('.slide').forEach((s) => {
  const d = s.dataset;
  if (!('nomast' in d)) {
    const m = document.createElement('div');
    m.className = 'mast';
    m.innerHTML = logo() + (d.n ? `<span class="no">Nº <i>${d.n}</i></span>` : '');
    s.appendChild(m);
  }
  if (d.of && !('nofolio' in d)) {
    const f = document.createElement('div');
    f.className = 'folio';
    const pad = (x) => String(x).padStart(2, '0');
    f.innerHTML = `<span>${pad(d.i)} / ${pad(d.of)}</span><span class="line"></span>` + ('last' in d ? '<span>yoamolaempanada</span>' : `<span class="more">Desliza ${ARROW}</span>`);
    s.appendChild(f);
  }
  const g = document.createElement('div');
  g.className = 'grain';
  s.appendChild(g);
});

// Iconos: <i class="ic" data-ic="wa|pin|snow|flame|ig|fb|clock|box|users|store">
const IC = {
  wa: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.8 14.2c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.7.8 1.8.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.1.6.2.3.9 1.4 1.9 2.3 1.3 1.1 2.4 1.5 2.7 1.6.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.2.7-.1.3.1 1.7.8 2 .9.3.2.5.2.6.3.1.2.1.9-.1 1.5Z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-5.6 7-11a7 7 0 0 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  snow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M4.2 7l15.6 10M4.2 17L19.8 7M9 3.8l3 2.4 3-2.4M9 20.2l3-2.4 3 2.4"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".7" fill="currentColor"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.6V3.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.4H7.8V13h2.7v8h3Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17" cy="9" r="2.4"/><path d="M16.5 14.4c2.6 0 4.5 1.7 4.5 4.6"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"><path d="M3 9l1.5-5h15L21 9M3 9c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3M5 12v8h14v-8M10 20v-5h4v5"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
};
document.querySelectorAll('i.ic').forEach((el) => { el.innerHTML = IC[el.dataset.ic] || ''; });

// Corazones numerados <i class="hn" data-n="3"> y corazones sueltos <i class="heart">
document.querySelectorAll('.hn').forEach((h) => { const n = h.dataset.n; h.innerHTML = HEART + `<span>${n}</span>`; });
document.querySelectorAll('.heart').forEach((h) => { h.innerHTML = HEART; });
