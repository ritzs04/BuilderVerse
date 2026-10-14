import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { learningPaths } from "@/content";
import {
  CERTIFICATE_LEVELS,
  LEVEL_LABELS,
  eligibility,
  findActiveCertificate,
  listCertificates,
} from "@/lib/certificates";
import { GraduationStudio } from "@/components/certificates/graduation-studio";
import { Pill, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Graduation Studio",
  description:
    "Claim certificates for the learning paths you have genuinely finished, export them as PNG or PDF, and let anyone verify them.",
};

export default async function GraduatePage() {
  const user = await requireUser();
  const issued = listCertificates(user.id);

  const levels = learningPaths.flatMap((path) =>
    CERTIFICATE_LEVELS.map((level) => {
      const check = eligibility(user.id, path.slug, level);
      return {
        pathSlug: path.slug,
        level,
        label: LEVEL_LABELS[level],
        eligible: check.eligible,
        reason: check.reason,
        progress: check.progress,
        hasActive: Boolean(findActiveCertificate(user.id, path.slug, level)),
      };
    }),
  );

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          level="h1"
          eyebrow="Prove the work"
          title="Graduation Studio"
          sub="Certificates are issued only when your finished lessons and projects prove the achievement. Every certificate carries a verification ID and a QR code, and can be revoked at any time."
        />
        <Pill tone="accent">🎓 {issued.filter((c) => c.revoked === 0 && !c.replaced_by).length} active</Pill>
      </section>

      <GraduationStudio
        paths={learningPaths.map((p) => ({ slug: p.slug, title: p.title }))}
        levels={levels}
        issued={issued}
        defaultName={user.name}
      />
    </div>
  );
}
