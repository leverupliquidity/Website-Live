// Screenshot built pages (dist/) at desktop 1440 and mobile 390, full page.
// Usage: node tools/shot.mjs /route [/route2 ...] [--out dir] [--only desktop|mobile]
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const out = outIdx >= 0 ? args[outIdx + 1] : 'tools/shots';
const onlyIdx = args.indexOf('--only');
const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
const skip = new Set([outIdx >= 0 ? outIdx + 1 : -9, onlyIdx >= 0 ? onlyIdx + 1 : -9]);
const routes = args.filter((a, i) => !a.startsWith('--') && !skip.has(i));
fs.mkdirSync(out, { recursive: true });

const root = path.resolve('dist');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(root, p);
  if (p === '/') f = path.join(root, 'index.html');
  else if (!path.extname(f)) f = fs.existsSync(f + '.html') ? f + '.html' : path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.statusCode = 404; f = path.join(root, '404.html'); if (!fs.existsSync(f)) return res.end('404'); }
  res.setHeader('Content-Type', types[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(res);
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium' });
const sizes = [['desktop', 1440, 900, 1], ['mobile', 390, 844, 1]].filter(([n]) => !only || n === only);
for (const r of routes) {
  for (const [name, w, h, dpr] of sizes) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
    await page.goto(`http://localhost:${port}${r}`, { waitUntil: 'networkidle' }).catch(() => {});
    await page.evaluate(async () => {
      // trigger lazy images
      for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      await new Promise((r) => setTimeout(r, 400));
      window.scrollTo(0, 0);
      await document.fonts.ready;
    });
    await page.waitForTimeout(300);
    const file = path.join(out, `${(r.replace(/\//g, '_') || '_home').replace(/^_$/, '_home')}-${name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(file);
    await page.close();
  }
}
await browser.close();
server.close();
