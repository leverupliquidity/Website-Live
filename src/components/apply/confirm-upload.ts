// /apply/confirmation: reference number + document upload.
// Each batch of chosen files is sent straight to Ryan's inbox through Web3Forms (same key as the forms).
import { integrations } from '../../data/site';
import { addFiles, bindDrop, typeLabel, mb } from './files';

const ENDPOINT = 'https://api.web3forms.com/submit';
const tpl = (id: string) => (document.getElementById(id) as HTMLTemplateElement | null)?.innerHTML ?? '';

export function initConfirmation() {
  // Reference number (set by the Apply form on submit)
  let ref = '';
  try { ref = sessionStorage.getItem('lv_ref') || ''; } catch {}
  const box = document.querySelector<HTMLElement>('[data-ref-box]');
  if (box && ref) {
    box.hidden = false;
    box.querySelector('[data-ref]')!.textContent = ref;
    const status = box.querySelector<HTMLElement>('[data-copy-status]')!;
    box.querySelector('[data-copy-ref]')!.addEventListener('click', async (e) => {
      const btn = e.currentTarget as HTMLButtonElement;
      try { await navigator.clipboard.writeText(ref); btn.textContent = 'Copied'; status.textContent = 'Reference number copied.'; }
      catch { status.textContent = ref; }
      setTimeout(() => { btn.textContent = 'Copy reference'; }, 2000);
    });
  }

  const zone = document.querySelector<HTMLElement>('[data-drop]');
  if (!zone) return;
  const input = document.getElementById('cf-files') as HTMLInputElement;
  const errBox = document.querySelector<HTMLElement>('[data-err]')!;
  const recWrap = document.querySelector<HTMLElement>('[data-received-wrap]')!;
  const recList = document.querySelector<HTMLElement>('[data-received]')!;
  const fileIcon = tpl('cf-tpl-file'), okIcon = tpl('cf-tpl-ok'), errIcon = tpl('cf-tpl-err');
  let sent: File[] = [];      // counts toward the per-page limits
  let docType = '';           // set when an "Upload" link for a needed item is used

  const badge = (kind: 'ok' | 'busy' | 'fail', text: string) =>
    `<span class="cf-badge cf-badge--${kind}">${kind === 'ok' ? okIcon : kind === 'fail' ? errIcon : ''}<span>${text}</span></span>`;

  function showErrors(errors: string[]) {
    errBox.hidden = !errors.length;
    errBox.innerHTML = errors.map(() => `<span class="cf-err-line">${errIcon}<span></span></span>`).join('');
    errBox.querySelectorAll('.cf-err-line > span').forEach((s, i) => { s.textContent = errors[i]; });
  }

  async function send(batch: File[], type: string) {
    const rows = batch.map((f) => {
      const li = document.createElement('li'); li.className = 'cf-item';
      li.innerHTML = `<span class="cf-item__icon">${fileIcon}</span><span class="cf-item__info"><span class="cf-item__name"></span><span class="cf-item__meta"></span></span><span data-badge>${badge('busy', 'Sending…')}</span>`;
      li.querySelector('.cf-item__name')!.textContent = f.name;
      li.querySelector('.cf-item__meta')!.textContent = `${typeLabel(f)} · ${mb(f.size)} MB`;
      recList.appendChild(li); return li;
    });
    recWrap.hidden = false;
    const fd = new FormData();
    fd.set('access_key', integrations.web3formsKey);
    fd.set('subject', `Documents for ${ref || 'an application'}`);
    fd.set('from_name', 'Leverup Liquidity website');
    fd.set('page', location.pathname);
    fd.set('Reference number', ref || 'Not available');
    fd.set('Document type', type || 'Not specified');
    batch.forEach((f, i) => fd.append(i === 0 ? 'attachment' : `attachment_${i + 1}`, f, f.name));
    try {
      if (!integrations.web3formsKey) throw new Error('Upload is not connected yet.');
      const res = await fetch(ENDPOINT, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || 'Something went wrong.');
      rows.forEach((li) => { li.querySelector('[data-badge]')!.innerHTML = badge('ok', 'Received'); });
      if (type) {
        const need = document.querySelector<HTMLElement>(`[data-need="${CSS.escape(type)}"]`);
        if (need) {
          need.querySelector('[data-badge]')!.outerHTML = badge('ok', 'Received');
          need.querySelector('[data-upload-for]')?.remove();
        }
      }
      window.lvTrack?.('documents_upload', { files: batch.length });
    } catch (err) {
      sent = sent.filter((f) => !batch.includes(f));
      rows.forEach((li) => { li.querySelector('[data-badge]')!.innerHTML = badge('fail', 'Not sent'); });
      showErrors([`We couldn't send ${batch.length === 1 ? 'that file' : 'those files'}. Please try again, or email them to info@leverupliquidity.com. (${(err as Error).message})`]);
    }
  }

  function take(incoming: File[]) {
    const r = addFiles(sent, incoming);
    const batch = r.files.slice(sent.length);
    sent = r.files;
    showErrors(r.errors);
    const type = docType; docType = '';
    if (batch.length) send(batch, type);
  }

  zone.querySelector('[data-choose]')!.addEventListener('click', () => { docType = ''; input.click(); });
  document.querySelectorAll<HTMLButtonElement>('[data-upload-for]').forEach((b) =>
    b.addEventListener('click', () => { docType = b.dataset.uploadFor || ''; input.click(); }));
  input.addEventListener('change', () => { take([...(input.files || [])]); input.value = ''; });
  bindDrop(zone, (f) => { docType = ''; take(f); });
}
