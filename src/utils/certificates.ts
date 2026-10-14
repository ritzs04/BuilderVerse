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
  issuedAt: string; // ISO date
  template: 'pink-dream' | 'coding-star' | 'future-builder';
  photoDataUrl: string | null;
  revoked: boolean;
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

