// Web3Forms submit handler for every <form data-w3f>.
// Attributes: data-subject, data-event (analytics event), data-redirect (URL on success), data-success (inline message id).
import { integrations } from '../data/site';

const ENDPOINT = 'https://api.web3forms.com/submit';

export function bindForm(form: HTMLFormElement, opts: { beforeSubmit?: (fd: FormData) => boolean | void } = {}) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const status = form.querySelector<HTMLElement>('[data-form-status]');
    const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const fd = new FormData(form);
    if (opts.beforeSubmit && opts.beforeSubmit(fd) === false) return;

    if ((fd.get('botcheck') as string)?.length) return; // honeypot filled → silently drop
    fd.set('access_key', integrations.web3formsKey);
    fd.set('subject', form.dataset.subject || 'New website submission');
    fd.set('from_name', 'Leverup Liquidity website');
    fd.set('page', location.pathname);
    // Drop empty file inputs so Web3Forms doesn't reject the request.
    for (const [k, v] of [...fd.entries()]) if (v instanceof File && !v.name) fd.delete(k);

    btn?.setAttribute('disabled', 'true');
    const original = btn?.textContent;
    if (btn) btn.textContent = 'Sending…';
    try {
      if (!integrations.web3formsKey) throw new Error('Form is not connected yet.');
      const res = await fetch(ENDPOINT, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || 'Something went wrong.');
      window.lvTrack?.(form.dataset.event || 'form_submit', { form: form.id || 'form' });
      if (form.dataset.redirect) { location.href = form.dataset.redirect; return; }
      form.reset();
      if (status) {
        status.hidden = false; status.className = 'form-status form-status--success';
        status.textContent = form.dataset.successText || "Thanks. We got it and we'll be in touch within one business day.";
        status.focus();
      }
    } catch (err) {
      if (status) {
        status.hidden = false; status.className = 'form-status form-status--error';
        status.textContent = `We couldn't send that. Please try again, or call or text (313) 329-7157. (${(err as Error).message})`;
        status.focus();
      }
    } finally {
      btn?.removeAttribute('disabled');
      if (btn && original) btn.textContent = original;
    }
  });
}
