import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('file:///home/claude/site/dist/index.html');
console.log(await p.evaluate(() => {
  const s = document.querySelector('.swipe'); const cs = getComputedStyle(s);
  const r = s.getBoundingClientRect();
  const wide = [...document.querySelectorAll('*')].map(e => [e, e.scrollWidth]).filter(([e, w]) => w > 400).map(([e, w]) => e.tagName + '.' + e.className.toString().slice(0,40) + ':' + w + ':' + getComputedStyle(e).overflowX).slice(0, 20);
  return { ov: cs.overflowX, disp: cs.display, w: r.width, left: r.left, wide };
}));
await b.close();
