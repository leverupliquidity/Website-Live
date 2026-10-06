// Shared upload rules for /apply (bank statements) and /apply/confirmation (documents).
// Web3Forms' default limit is 5 MB per file.
export const MAX_FILE_MB = 5;
export const MAX_TOTAL_MB = 25;
export const MAX_FILES = 12;
export const ACCEPT = '.pdf,.jpg,.jpeg,.png,.heic,.heif,.webp,application/pdf,image/jpeg,image/png,image/heic,image/heif,image/webp';
export const HINT = `PDF, JPG, PNG, HEIC or WEBP · up to ${MAX_FILE_MB} MB per file · ${MAX_TOTAL_MB} MB total · ${MAX_FILES} files max`;

const OK_EXT = ['pdf', 'jpg', 'jpeg', 'png', 'heic', 'heif', 'webp'];
const MB = 1024 * 1024;

export const ext = (f: File) => (f.name.split('.').pop() || '').toLowerCase();
export const typeLabel = (f: File) => {
  const e = ext(f);
  return e === 'jpeg' ? 'JPG' : e === 'heif' ? 'HEIC' : e.toUpperCase() || 'File';
};
export const mb = (bytes: number) => (bytes / MB).toFixed(1);

/** Adds `incoming` to `current` within the limits. Returns accepted files and error messages for the rest. */
export function addFiles(current: File[], incoming: File[]): { files: File[]; errors: string[] } {
  const files = [...current];
  const errors: string[] = [];
  let total = files.reduce((s, f) => s + f.size, 0);
  for (const f of incoming) {
    if (!OK_EXT.includes(ext(f))) { errors.push(`“${f.name}” isn't a PDF, JPG, PNG, HEIC or WEBP file.`); continue; }
    if (f.size > MAX_FILE_MB * MB) { errors.push(`“${f.name}” is over ${MAX_FILE_MB} MB.`); continue; }
    if (files.length >= MAX_FILES) { errors.push(`You can attach up to ${MAX_FILES} files.`); break; }
    if (total + f.size > MAX_TOTAL_MB * MB) { errors.push(`“${f.name}” would take the total over ${MAX_TOTAL_MB} MB.`); continue; }
    if (files.some((x) => x.name === f.name && x.size === f.size)) continue; // same file twice
    files.push(f); total += f.size;
  }
  return { files, errors };
}

export const totalLine = (files: File[]) => {
  const n = files.length;
  return `${n} ${n === 1 ? 'file' : 'files'} attached, ${mb(files.reduce((s, f) => s + f.size, 0))} MB total.`;
};

/** Wires drag-and-drop on a zone. */
export function bindDrop(zone: HTMLElement, onFiles: (files: File[]) => void) {
  const on = (e: DragEvent) => { e.preventDefault(); zone.classList.add('is-over'); };
  const off = () => zone.classList.remove('is-over');
  zone.addEventListener('dragenter', on);
  zone.addEventListener('dragover', on);
  zone.addEventListener('dragleave', (e) => { if (!zone.contains(e.relatedTarget as Node)) off(); });
  zone.addEventListener('drop', (e) => { e.preventDefault(); off(); onFiles([...(e.dataTransfer?.files || [])]); });
}
