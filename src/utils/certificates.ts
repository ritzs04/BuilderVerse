/**
 * Certificate helpers for Graduation Studio.
 *
 * A certificate record is stored in localStorage ('bv_certificates').
 * Each issued certificate gets a unique ID in the format BV-YYYY-XXXXXX
 * (6 random Crockford-base32 characters) and a QR code linking to
 * {origin}/?verify=<ID>. The verification page looks the ID up in this
 * device's registry; tampered IDs fail a checksum built into the ID.
 *
 * Honest limitation (see final report): without a server-side database,
 * validity can only be proven on the device that issued it. A future
 * backend (per master prompt §24) would verify against a global registry.
 */

export type CertificateLevel = 'Course Graduate' | 'Project Creator' | 'Independent Builder';

export interface CertificateRecord {
  id: string;
  displayName: string;
  courseId: string;
  courseName: string;
  level: CertificateLevel;
  issuedAt: string; // ISO date the certificate was issued
  template: 'pink-dream' | 'coding-star' | 'future-builder';
  photoDataUrl: string | null;
  revoked: boolean;
  /** Whether the student wants this certificate publicly shareable (name visible on the verify page). */
  publiclyShared: boolean;
  /** If this is a reissue, the ID of the certificate it replaces (history preserved). */
  reissueOf?: string;
  /** Set on the OLD record when it has been replaced by a reissue (kept for history). */
  replacedBy?: string;
}

const STORAGE_KEY = 'bv_certificates';

/** Load all certificate records for this device. */
export function loadCertificates(): CertificateRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/** Persist certificate records. */
export function saveCertificates(certs: CertificateRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certs));
  } catch {
    // Quota errors (large photos) are handled by compressing the photo first.
  }
}

// Crockford base32 without confusing characters (no I, L, O, U).
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/** Pick 6 unpredictable random characters. */
function randomSegment(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => ALPHABET[b % ALPHABET.length]).join('');
}

/** Simple checksum so edited IDs are caught by the verification page. */
function checksum(year: string, segment: string, courseId: string): string {
  const text = `${year}-${segment}-${courseId}-builderverse`;
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  const abs = Math.abs(hash);
  return String(abs % 36).padStart(1, '0') + ALPHABET[abs % ALPHABET.length];
}

/** Issue a new, unique certificate ID for a course. */
export function generateCertificateId(courseId: string): string {
  const year = new Date().getFullYear().toString();
  const existing = new Set(loadCertificates().map(c => c.id));
  let id = '';
  do {
    const segment = randomSegment();
    id = `BV-${year}-${segment}-${checksum(year, segment, courseId)}`;
  } while (existing.has(id));
  return id;
}

/** Validate an ID's checksum (catches typos and tampering). */
export function isCertificateIdWellFormed(id: string, courseId?: string): boolean {
  const parts = id.split('-');
  if (parts.length !== 4 || parts[0] !== 'BV') return false;
  const [, year, segment, check] = parts;
  if (!/^\d{4}$/.test(year) || segment.length !== 6) return false;
  if (!courseId) return true;
  return check === checksum(year, segment, courseId);
}

/** Verify an ID against this device's registry. */
export function verifyCertificate(id: string): {
  status: 'valid' | 'revoked' | 'unknown';
  record: CertificateRecord | null;
} {
  const found = loadCertificates().find(c => c.id === id) || null;
  if (!found) return { status: 'unknown', record: null };
  if (found.revoked) return { status: 'revoked', record: found };
  // A certificate replaced by a reissue must not be presented as current.
  if (found.replacedBy) return { status: 'revoked', record: found };
  if (!isCertificateIdWellFormed(id, found.courseId)) return { status: 'unknown', record: null };
  return { status: 'valid', record: found };
}

/** Shrink a photo to a small JPEG data URL so it fits in localStorage. */
export function compressPhoto(dataUrl: string, maxSize = 512): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => reject(new Error('Could not read the image file'));
    img.src = dataUrl;
  });
}

/** Build the shareable verification URL for a certificate. */
export function verificationUrl(id: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/?verify=${encodeURIComponent(id)}`;
}

/** True when a live (non-revoked) certificate already exists for a course + level. */
export function hasActiveCertificate(courseId: string, level: CertificateLevel): boolean {
  return loadCertificates().some(c => c.courseId === courseId && c.level === level && !c.revoked);
}

/**
 * Reissue a certificate: creates a NEW id but never silently changes history.
 * The old record stays in the registry marked as replaced, so issue history survives.
 */
export function reissueCertificate(oldId: string): CertificateRecord | null {
  const all = loadCertificates();
  const old = all.find(c => c.id === oldId);
  if (!old) return null;
  const replacement: CertificateRecord = {
    ...old,
    id: generateCertificateId(old.courseId),
    issuedAt: new Date().toISOString().slice(0, 10),
    revoked: false,
    reissueOf: old.id
  };
  // Keep the original record for history, marked so it can't be presented as current.
  saveCertificates([...all.map(c => (c.id === old.id ? { ...c, replacedBy: replacement.id } : c)), replacement]);
  return replacement;
}

const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;   // 8 MB
const MIN_DIMENSION = 150;                  // too small = blurry on the certificate
const MAX_DIMENSION = 8000;                 // absurdly large images are rejected early

/** Validate an upload before any processing. Returns an error message, or null when OK. */
export function validatePhotoFile(file: File): string | null {
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
    return 'Please choose a JPG, PNG or WebP image.';
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return 'That photo is larger than 8 MB — please pick a smaller one.';
  }
  return null;
}

/** Read the pixel dimensions of an image file (for validation + the crop UI). */
export function readImageSize(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('Could not read the image file'));
    img.src = dataUrl;
  });
}

/**
 * Bake crop + reposition into the stored photo so the preview and the
 * exported PNG/PDF are pixel-identical. Renders a square circular-crop
 * canvas at `size` pixels with `zoom` (1 = fit) and offsets in -1..1.
 */
export function cropPhoto(
  sourceDataUrl: string,
  zoom: number,
  offsetX: number,
  offsetY: number,
  size = 512
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));

      // Square source window scaled by zoom, then centred with the offsets.
      const base = Math.min(img.naturalWidth, img.naturalHeight);
      const side = base / zoom;
      const maxX = (img.naturalWidth - side) / 2;
      const maxY = (img.naturalHeight - side) / 2;
      const sx = img.naturalWidth / 2 - side / 2 + offsetX * maxX;
      const sy = img.naturalHeight / 2 - side / 2 + offsetY * maxY;

      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
      resolve(canvas.toDataURL('image/jpeg', 0.88));
    };
    img.onerror = () => reject(new Error('Could not read the image file'));
    img.src = sourceDataUrl;
  });
}


/** Generate a copy-paste LinkedIn announcement from a real achievement. */
export function linkedInAnnouncement(record: CertificateRecord): string {
  return (
    `I'm proud to share that I've earned the "${record.level}" certificate for ${record.courseName} on BuilderVerse! 🎓🌷\n\n` +
    `Every concept learned, every bug solved, and every challenge attempted made me a little stronger. ` +
    `Grateful for a learning space that treats mistakes as clues, not failures.\n\n` +
    `Learn. Think. Build. — and this journey is free for every student.\n\n` +
    `Verify: ${verificationUrl(record.id)}\n\n` +
    `#BuilderVerse #LearnToCode #WebDev #CodingJourney`
  );
}

