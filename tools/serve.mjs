// Tiny static server for dist/ that serves foo.html for /foo (same rules as tools/shot.mjs).
// Import { start } for scripts, or run `node tools/serve.mjs [port]` to keep it running.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = path.resolve('dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.json': 'application/json' };

export function start(port = 0) {
  const server = http.createServer((req, res) => {
    const p = decodeURIComponent(req.url.split('?')[0]);
    let f = path.join(root, p);
    if (p === '/') f = path.join(root, 'index.html');
    else if (!path.extname(f)) f = fs.existsSync(f + '.html') ? f + '.html' : path.join(f, 'index.html');
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; f = path.join(root, '404.html'); }
    const ext = path.extname(f);
    res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
    if (p.startsWith('/_astro/')) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    // gzip text like Netlify does, so Lighthouse numbers are realistic
    if (/\.(html|css|js|svg|xml|txt|json|webmanifest)$/.test(ext) && /gzip/.test(req.headers['accept-encoding'] || '')) {
      res.setHeader('Content-Encoding', 'gzip');
      return fs.createReadStream(f).pipe(zlib.createGzip()).pipe(res);
    }
    fs.createReadStream(f).pipe(res);
  });
  return new Promise((r) => server.listen(port, () => r(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const s = await start(Number(process.argv[2] || 4321));
  console.log('serving dist on http://localhost:' + s.address().port);
}
