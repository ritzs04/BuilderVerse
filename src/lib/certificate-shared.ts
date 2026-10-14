/**
 * Certificate constants shared by server and client code.
 *
 * Kept separate from `certificates.ts` on purpose: that module reaches the
 * database, so client components must not import runtime values from it.
 */

export const CERTIFICATE_LEVELS = [
  "course-graduate",
  "project-creator",
  "independent-builder",
] as const;
export type CertificateLevel = (typeof CERTIFICATE_LEVELS)[number];

export const LEVEL_LABELS: Record<CertificateLevel, string> = {
  "course-graduate": "Course Graduate",
  "project-creator": "Project Creator",
  "independent-builder": "Independent Builder",
};

export const CERTIFICATE_TEMPLATES = ["classic", "sunrise", "midnight"] as const;
export type CertificateTemplate = (typeof CERTIFICATE_TEMPLATES)[number];

export const TEMPLATE_HINTS: Record<CertificateTemplate, string> = {
  classic: "Soft violet",
  sunrise: "Warm amber",
  midnight: "Deep blue",
};

export function isCertificateLevel(value: string): value is CertificateLevel {
  return (CERTIFICATE_LEVELS as readonly string[]).includes(value);
}

export function isCertificateTemplate(value: string): value is CertificateTemplate {
  return (CERTIFICATE_TEMPLATES as readonly string[]).includes(value);
}
