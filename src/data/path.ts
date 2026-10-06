// Normalise Astro.url.pathname: build.format 'file' yields '/guides.html' and '/index.html'.
export const cleanPath = (p: string) => {
  let s = p.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/\/$/, '');
  return s || '/';
};
