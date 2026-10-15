// Standalone test of the certificate ID / checksum logic.
// Mirrors src/utils/certificates.ts so the rules are verified independently.
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function randomSegment() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => ALPHABET[b % ALPHABET.length]).join('');
}

function checksum(year, segment, courseId) {
  const text = `${year}-${segment}-${courseId}-builderverse`;
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  const abs = Math.abs(hash);
  return String(abs % 36) + ALPHABET[abs % ALPHABET.length];
}

function generateId(courseId) {
  const year = String(new Date().getFullYear());
  const seg = randomSegment();
  return `BV-${year}-${seg}-${checksum(year, seg, courseId)}`;
}

function wellFormed(id, courseId) {
  const p = id.split('-');
  if (p.length !== 4 || p[0] !== 'BV') return false;
  if (!/^\d{4}$/.test(p[1]) || p[2].length !== 6) return false;
  return p[3] === checksum(p[1], p[2], courseId);
}

let pass = 0;
let fail = 0;
const check = (label, ok) => {
  if (ok) { pass++; console.log('PASS  ' + label); }
  else { fail++; console.log('FAIL  ' + label); }
};

// 1. Uniqueness across many issuances
const ids = new Set();
for (let i = 0; i < 5000; i++) ids.add(generateId('python'));
check('5000 IDs are unique', ids.size === 5000);

// 2. Format is BV-YYYY-XXXXXX-C
const sample = generateId('java');
check('ID matches BV-YYYY-XXXXXX-C', /^BV-\d{4}-[0-9A-Z]{6}-[0-9A-Z]$/.test(sample));

// 3. A genuine ID verifies for its own course
check('valid ID passes for its course', wellFormed(sample, 'java'));

// 4. Wrong-course IDs are rejected (prevents cross-course forgery)
check('wrong-course ID rejected', !wellFormed(sample, 'python'));

// 5. Tampered checksum rejected
const p = sample.split('-');
const tampered = `BV-${p[1]}-${p[2]}-${p[3] === 'A' ? 'B' : 'A'}`;
check('tampered checksum rejected', !wellFormed(tampered, 'java'));

// 6. Truncated / edited segment rejected
check('truncated ID rejected', !wellFormed(sample.slice(0, -3), 'java'));

// 7. Garbage rejected
check('garbage ID rejected', !wellFormed('not-a-certificate', 'java'));

// 8. No confusing characters (I, L, O, U never appear)
const alphabetOk = !/[ILOU]/.test(ALPHABET);
check('alphabet excludes I/L/O/U', alphabetOk);
let confusing = false;
for (const id of ids) if (/[ILOU]/.test(id)) confusing = true;
check('no ID contains I/L/O/U', !confusing);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
