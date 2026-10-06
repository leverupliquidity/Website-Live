// Small helpers shared by the Guides pages.

/** Guide dates: shown as in the design (10/1/26), ISO for <time datetime>. Dates are calendar dates (UTC). */
export function guideDate(d: Date) {
  const m = d.getUTCMonth() + 1, day = d.getUTCDate(), y = d.getUTCFullYear();
  return {
    display: `${m}/${day}/${String(y).slice(-2)}`,
    iso: `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  };
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Escape for HTML and join the last two words with a non-breaking space (no one-word last line). */
export function noWidow(s: string) {
  return esc(s).replace(/ (\S+)$/, '&nbsp;$1');
}
