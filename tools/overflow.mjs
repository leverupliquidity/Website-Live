// Find elements wider than the viewport at 390px. Usage: node tools/overflow.mjs /route
import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve('dist');
const server = http.createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); let f = path.join(root, p === '/' ? 'index.html' : p); if (!path.extname(f)) f = fs.existsSync(f + '.html') ? f + '.html' : path.join(f, 'index.html'); if (!fs.existsSync(f)) { res.statusCode = 404; return res.end(); } fs.createReadStream(f).pipe(res); }).listen(0);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const r of process.argv.slice(2)) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(`http://localhost:${server.address().port}${r}`, { waitUntil: 'load' });
  const res = await p.evaluate(() => {
    const out = []; const vw = document.documentElement.clientWidth;
    for (const el of document.querySelectorAll('body *')) {
      const rc = el.getBoundingClientRect();
      if (rc.right > vw + 1 && !el.closest('.swipe > *')) out.push(`${el.tagName}.${el.className}`.slice(0, 80) + ' right=' + Math.round(rc.right));
    }
    const wide = [...document.querySelectorAll('*')].filter(e => e.scrollWidth > vw + 1).map(e => e.tagName + '.' + String(e.className).slice(0, 50) + ' sw=' + e.scrollWidth + ' ov=' + getComputedStyle(e).overflowX).slice(0, 12);
    return { sw: document.documentElement.scrollWidth, out: out.slice(0, 15), wide };
  });
  console.log(r, JSON.stringify(res, null, 1));
}
await b.close(); server.close();
