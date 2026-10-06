// Sends one event to every analytics tool that is loaded (GA4, Umami, Clarity).
// Usage in pages: window.lvTrack('apply_step', { step: 2 }) or add data-track="event_name" to a link/button.
type Props = Record<string, string | number | boolean | undefined>;
declare global {
  interface Window {
    lvTrack: (name: string, props?: Props) => void;
    gtag?: (...args: unknown[]) => void;
    umami?: { track: (name: string, data?: Props) => void };
    clarity?: (...args: unknown[]) => void;
  }
}

window.lvTrack = (name, props = {}) => {
  try { window.gtag?.('event', name, props); } catch {}
  try { window.umami?.track(name, props); } catch {}
  try { window.clarity?.('event', name); } catch {}
};

const infer = (a: HTMLAnchorElement): string | null => {
  const h = a.getAttribute('href') || '';
  if (h.startsWith('tel:')) return 'tel_click';
  if (h.startsWith('sms:')) return 'sms_click';
  if (h.startsWith('mailto:')) return 'email_click';
  if (h.includes('bookings.cloud.microsoft') || h.includes('outlook.office365.com/book')) return 'book_call_click';
  return null;
};

document.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-track], a[href]');
  if (!el) return;
  const name = el.dataset.track || (el instanceof HTMLAnchorElement ? infer(el) : null);
  if (!name) return;
  window.lvTrack(name, {
    location: el.dataset.trackLocation || el.closest('[data-section]')?.getAttribute('data-section') || undefined,
    page: location.pathname,
  });
}, { capture: true });

export {};
