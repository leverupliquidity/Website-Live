// Apply form: formatting, validation, Yes/No reveal, add/remove owners, bank statement files,
// analytics (apply_start, apply_step) and Web3Forms submit via bindForm.
import { bindForm } from '../../scripts/forms';
import { addFiles, bindDrop, totalLine, typeLabel, mb } from './files';

const MAX_OWNERS = 4;
const digits = (v: string) => v.replace(/\D/g, '');

// ── Formatters ────────────────────────────────────────────────
const fmt: Record<string, (v: string) => string> = {
  phone: (v) => { const d = digits(v).slice(0, 10); if (d.length < 4) return d.length ? `(${d}` : ''; if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`; return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`; },
  ein: (v) => { const d = digits(v).slice(0, 9); return d.length > 2 ? `${d.slice(0, 2)}-${d.slice(2)}` : d; },
  ssn: (v) => { const d = digits(v).slice(0, 9); if (d.length > 5) return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`; if (d.length > 3) return `${d.slice(0, 3)}-${d.slice(3)}`; return d; },
  zip: (v) => digits(v).slice(0, 5),
  int: (v) => digits(v).slice(0, 2),
  pct: (v) => digits(v).slice(0, 3),
  dob: (v) => { const d = digits(v).slice(0, 8); if (d.length > 4) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`; if (d.length > 2) return `${d.slice(0, 2)}/${d.slice(2)}`; return d; },
  month: (v) => { const d = digits(v).slice(0, 6); return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d; },
  money: (v) => { const d = digits(v).replace(/^0+(?=\d)/, '').slice(0, 10); return d ? Number(d).toLocaleString('en-US') : ''; },
};

// ── Validators: return an error message or '' ─────────────────
const now = new Date();
function checkFormat(kind: string, v: string): string {
  const d = digits(v);
  switch (kind) {
    case 'phone': return d.length === 10 ? '' : 'Enter a 10-digit phone number.';
    case 'ein': return d.length === 9 ? '' : 'Enter a 9-digit EIN, like 12-3456789.';
    case 'ssn': return d.length === 9 ? '' : 'Enter a 9-digit Social Security Number.';
    case 'zip': return d.length === 5 ? '' : 'Enter a valid ZIP code.';
    case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address.';
    case 'pct': { const n = Number(d); return n >= 1 && n <= 100 ? '' : 'Enter a percentage from 1 to 100.'; }
    case 'money': return Number(d) > 0 ? '' : 'Enter an amount.';
    case 'dob': {
      const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/); if (!m) return 'Enter a date as mm/dd/yyyy.';
      const [mm, dd, yy] = [+m[1], +m[2], +m[3]]; const dt = new Date(yy, mm - 1, dd);
      if (dt.getMonth() !== mm - 1 || dt.getDate() !== dd || yy < 1900 || dt > now) return 'Enter a valid date of birth.';
      return '';
    }
    case 'month': {
      const p = parseMonth(v); if (!p) return 'Enter the month and year, like 03 / 2021.';
      return '';
    }
  }
  return '';
}
function parseMonth(v: string): { m: number; y: number } | null {
  const mt = v.match(/^(\d{2}) \/ (\d{4})$/); if (!mt) return null;
  const m = +mt[1], y = +mt[2];
  if (m < 1 || m > 12 || y < 1900) return null;
  if (y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth() + 1)) return null;
  return { m, y };
}

export function initApplyForm() {
  const form = document.getElementById('apply-form') as HTMLFormElement | null;
  if (!form) return;
  const errIcon = (document.getElementById('err-icon') as HTMLTemplateElement | null)?.innerHTML ?? '';

  // ── Error display ───────────────────────────────────────────
  const fieldOf = (el: HTMLElement) => (el.closest('.ap-ack-wrap') || el.closest('.field')) as HTMLElement | null;
  function setError(el: HTMLInputElement | HTMLSelectElement, msg: string) {
    const host = fieldOf(el); if (!host) return;
    const errId = `${el.id}-err`;
    let err = document.getElementById(errId);
    const desc = (el.getAttribute('aria-describedby') || '').split(' ').filter((x) => x && x !== errId);
    if (msg) {
      if (!err) { err = document.createElement('p'); err.id = errId; err.className = 'field__error'; host.appendChild(err); }
      err.innerHTML = `${errIcon}<span></span>`; err.querySelector('span')!.textContent = msg;
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', [...desc, errId].join(' '));
    } else {
      err?.remove();
      el.removeAttribute('aria-invalid');
      if (desc.length) el.setAttribute('aria-describedby', desc.join(' ')); else el.removeAttribute('aria-describedby');
    }
  }
  function validate(el: HTMLInputElement | HTMLSelectElement): string {
    if (el.disabled) return '';
    const v = el.value.trim();
    if (el instanceof HTMLInputElement && el.type === 'checkbox') return el.required && !el.checked ? 'Check this box to continue.' : '';
    if (!v) return el.required ? (el instanceof HTMLSelectElement ? 'Choose an option.' : 'This field is required.') : '';
    return el.dataset.fmt ? checkFormat(el.dataset.fmt, v) : '';
  }
  const fields = () => [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input:not([type=hidden]):not([type=file]):not([type=radio]):not([name=botcheck]), select')];

  // ── Live formatting + re-validation of flagged fields ───────
  form.addEventListener('input', (e) => {
    const el = e.target as HTMLInputElement;
    const f = el.dataset?.fmt && fmt[el.dataset.fmt];
    if (f) { const before = el.value; const after = f(before); if (after !== before) el.value = after; }
    if (el.id === 'b-start') updateTib();
    if (el.getAttribute('aria-invalid') === 'true') setError(el, validate(el));
  });
  form.addEventListener('change', (e) => {
    const el = e.target as HTMLInputElement | HTMLSelectElement;
    if (el instanceof HTMLSelectElement) el.classList.toggle('is-empty', !el.value);
    if (el.getAttribute('aria-invalid') === 'true') setError(el, validate(el));
  });
  form.addEventListener('focusout', (e) => {
    const el = e.target as HTMLInputElement;
    if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement) || el.type === 'checkbox' || el.type === 'radio' || el.type === 'file') return;
    if (el.value.trim()) setError(el, validate(el));
  });
  form.querySelectorAll('select').forEach((s) => s.classList.toggle('is-empty', !s.value));

  // ── Time in business ────────────────────────────────────────
  const start = form.querySelector<HTMLInputElement>('#b-start')!;
  const tib = form.querySelector<HTMLElement>('#b-tib')!;
  const tibVal = form.querySelector<HTMLInputElement>('#b-tib-val')!;
  function updateTib() {
    const p = parseMonth(start.value);
    if (!p) { tib.hidden = true; tibVal.value = ''; return; }
    const months = (now.getFullYear() - p.y) * 12 + (now.getMonth() + 1 - p.m);
    const y = Math.floor(months / 12), m = months % 12;
    const text = `${y} ${y === 1 ? 'year' : 'years'}, ${m} ${m === 1 ? 'month' : 'months'}`;
    tib.textContent = `Time in business: ${text}`; tib.hidden = false; tibVal.value = text;
  }

  // ── SSN show / hide ─────────────────────────────────────────
  form.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-ssn-toggle]');
    if (!btn) return;
    const input = document.getElementById(btn.getAttribute('aria-controls')!) as HTMLInputElement;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.setAttribute('aria-pressed', String(show));
    btn.setAttribute('aria-label', show ? 'Hide Social Security Number' : 'Show Social Security Number');
  });

  // ── Existing funding reveal ─────────────────────────────────
  const more = form.querySelector<HTMLElement>('#funding-more')!;
  form.querySelectorAll<HTMLInputElement>('[data-funding]').forEach((r) => r.addEventListener('change', () => {
    const yes = r.checked && r.dataset.funding === 'yes';
    more.hidden = !yes;
    more.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select').forEach((el) => { el.disabled = !yes; if (!yes) setError(el, ''); });
  }));

  // ── Additional owners ───────────────────────────────────────
  const ownersBox = form.querySelector<HTMLElement>('[data-owners]')!;
  const addBtn = form.querySelector<HTMLButtonElement>('[data-add-owner]')!;
  const tpl = document.getElementById('owner-tpl') as HTMLTemplateElement;
  function renumber() {
    [...ownersBox.querySelectorAll<HTMLElement>('.owner')].forEach((o, i) => {
      const n = i + 2; const old = o.dataset.owner!;
      if (old === String(n)) return;
      o.dataset.owner = String(n);
      o.querySelectorAll<HTMLElement>('*').forEach((el) => {
        for (const a of ['id', 'for', 'aria-describedby', 'aria-controls']) {
          const v = el.getAttribute(a); if (v) el.setAttribute(a, v.replace(/\bo\d+-/g, `o${n}-`));
        }
        const name = el.getAttribute('name'); if (name) el.setAttribute('name', name.replace(/^Owner \d+ —/, `Owner ${n} —`));
      });
      o.querySelector('[data-owner-label]')!.textContent = `Owner ${n}`;
      const sr = o.querySelector('[data-owner-label-sr]'); if (sr) sr.textContent = ` ${n}`;
    });
    addBtn.hidden = ownersBox.children.length >= MAX_OWNERS - 1;
  }
  addBtn.addEventListener('click', () => {
    const n = ownersBox.children.length + 2;
    if (n > MAX_OWNERS) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = tpl.innerHTML.replace(/__N__/g, String(n));
    const owner = wrap.firstElementChild as HTMLElement;
    ownersBox.appendChild(owner);
    owner.querySelectorAll('select').forEach((s) => s.classList.add('is-empty'));
    renumber();
    owner.querySelector<HTMLInputElement>('input')?.focus();
  });
  ownersBox.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('[data-remove-owner]');
    if (!btn) return;
    btn.closest('.owner')?.remove();
    renumber();
    addBtn.focus();
  });

  // ── Bank statements ─────────────────────────────────────────
  let files: File[] = [];
  const drop = form.querySelector<HTMLElement>('[data-drop]')!;
  const input = form.querySelector<HTMLInputElement>('#statements')!;
  const list = form.querySelector<HTMLElement>('[data-files]')!;
  const total = form.querySelector<HTMLElement>('[data-files-total]')!;
  const dropErr = form.querySelector<HTMLElement>('#drop-err')!;
  const fileIcon = (document.getElementById('file-icon') as HTMLTemplateElement | null)?.innerHTML ?? '';
  function renderFiles() {
    list.innerHTML = '';
    files.forEach((f, i) => {
      const li = document.createElement('li'); li.className = 'ap-file';
      li.innerHTML = `${fileIcon}<span class="ap-file__info"><span class="ap-file__name"></span><span class="ap-file__meta"></span></span><button type="button" class="ap-textbtn">Remove<span class="visually-hidden"></span></button>`;
      li.querySelector('.ap-file__name')!.textContent = f.name;
      li.querySelector('.ap-file__meta')!.textContent = `${typeLabel(f)} · ${mb(f.size)} MB`;
      li.querySelector('.visually-hidden')!.textContent = ` ${f.name}`;
      li.querySelector('button')!.addEventListener('click', () => {
        files.splice(i, 1); renderFiles();
        (list.querySelector('button') as HTMLElement | null)?.focus() ?? form!.querySelector<HTMLElement>('[data-choose]')!.focus();
      });
      list.appendChild(li);
    });
    list.hidden = total.hidden = files.length === 0;
    total.textContent = files.length ? totalLine(files) : '';
  }
  function take(incoming: File[]) {
    const r = addFiles(files, incoming);
    files = r.files;
    dropErr.hidden = !r.errors.length;
    dropErr.innerHTML = r.errors.map(() => `<span class="ap-err-line">${errIcon}<span></span></span>`).join('');
    dropErr.querySelectorAll('.ap-err-line > span').forEach((s, i) => { s.textContent = r.errors[i]; });
    renderFiles();
  }
  form.querySelector('[data-choose]')!.addEventListener('click', () => input.click());
  input.addEventListener('change', () => { take([...(input.files || [])]); input.value = ''; });
  bindDrop(drop, take);

  // ── Analytics ───────────────────────────────────────────────
  let started = false;
  const seen = new Set<string>();
  form.addEventListener('focusin', (e) => {
    const t = e.target as HTMLElement;
    if (!t.matches('input, select, textarea, button')) return;
    if (!started && t.matches('input, select, textarea')) { started = true; window.lvTrack?.('apply_start'); }
    const step = t.closest<HTMLElement>('[data-step]')?.dataset.step;
    if (step && !seen.has(step)) { seen.add(step); window.lvTrack?.('apply_step', { step: Number(step) }); }
  });

  // ── Submit: validate first (runs before bindForm's handler) ─
  form.addEventListener('submit', (e) => {
    let first: HTMLElement | null = null;
    for (const el of fields()) {
      const msg = validate(el);
      setError(el, msg);
      if (msg && !first) first = el;
    }
    if (first) {
      e.preventDefault(); e.stopImmediatePropagation();
      first.focus();
      first.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  });

  bindForm(form, {
    beforeSubmit: (fd) => {
      const legal = (form.querySelector<HTMLInputElement>('#b-name')!.value || '').trim();
      form.dataset.subject = `New application: ${legal}`;
      const rnd = new Uint32Array(2); crypto.getRandomValues(rnd);
      const ref = `LV-${String(rnd[0] % 10000).padStart(4, '0')}-${String(rnd[1] % 10000).padStart(4, '0')}`;
      fd.set('Reference number', ref);
      fd.set('Owners on application', String(1 + ownersBox.children.length));
      fd.set('Bank statements attached', String(files.length));
      files.forEach((f, i) => fd.append(i === 0 ? 'attachment' : `attachment_${i + 1}`, f, f.name));
      try { sessionStorage.setItem('lv_ref', ref); } catch {}
    },
  });
}
