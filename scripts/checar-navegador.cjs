// Abre todas as páginas por HTTP local e procura: erro JS (pageerror), erro de console,
// transbordo horizontal em 390 px, <html lang> e se o learn.js iniciou (window.INEMA).
// Uso: node scripts/checar-navegador.cjs http://127.0.0.1:PORTA [pt|en|es ...]
const { chromium } = require('/home/nmaldaner/projetos/agent-browser/node_modules/playwright');
const fs = require('fs'), path = require('path');
const base = process.argv[2];
const langs = process.argv.slice(3).length ? process.argv.slice(3) : ['pt'];
const raiz = path.resolve(__dirname, '..');
const paginas = ['index.html'];
for (const t of [1, 2, 3, 4]) {
  paginas.push(`curso/trilha${t}/index.html`);
  for (const m of [1, 2, 3, 4]) paginas.push(`curso/trilha${t}/modulo-${t}-${m}.html`);
}
const LANG = { pt: 'pt-BR', en: 'en', es: 'es' };
(async () => {
  const browser = await chromium.launch({ args: ['--disable-gpu'] });
  let falhas = 0, total = 0;
  for (const lg of langs) {
    for (const vw of [1280, 390]) {
      const ctx = await browser.newContext({ viewport: { width: vw, height: 900 }, reducedMotion: 'reduce' });
      for (const p of paginas) {
        const rel = (lg === 'pt' ? '' : lg + '/') + p;
        if (!fs.existsSync(path.join(raiz, rel))) { console.log('AUSENTE', rel); falhas++; continue; }
        const page = await ctx.newPage();
        const erros = [];
        page.on('pageerror', e => erros.push('pageerror: ' + e.message));
        page.on('console', m => { if (m.type() === 'error' && !/favicon|cdn.tailwindcss.com should not be used/.test(m.text())) erros.push('console: ' + m.text()); });
        await page.goto(`${base}/${rel}`, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(300);
        const r = await page.evaluate(() => ({
          lang: document.documentElement.lang,
          over: document.documentElement.scrollWidth - window.innerWidth,
          inema: !!(window.INEMA && window.INEMA.init),
        }));
        total++;
        const ok = !erros.length && r.lang === LANG[lg] && r.over <= 1 && r.inema;
        if (!ok) { falhas++; console.log('FALHA', vw, rel, JSON.stringify(r), erros.slice(0, 3).join(' | ')); }
        await page.close();
      }
      await ctx.close();
    }
  }
  await browser.close();
  console.log(`${total - falhas}/${total} páginas OK (${langs.join(',')}, 1280 e 390 px)`);
  process.exit(falhas ? 1 : 0);
})();
