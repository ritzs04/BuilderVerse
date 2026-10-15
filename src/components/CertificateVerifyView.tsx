import React, { useState } from 'react';
import { X, ShieldCheck, ShieldAlert, SearchX, ArrowLeft } from 'lucide-react';
import { verifyCertificate } from '../utils/certificates';

/**
 * CERTIFICATE VERIFICATION — opened automatically at /?verify=CERT_ID.
 * Shows validity, achievement, course, date and display name.
 * Private photos and account data are NEVER exposed here.
 */
export const CertificateVerifyView: React.FC<{ certId: string; onBack: () => void }> = ({ certId, onBack }) => {
  const [rendered] = useState(() => verifyCertificate(certId));

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bv-bg)', color: 'var(--bv-ink)' }}>
      <div
        className="w-full max-w-lg rounded-3xl border shadow-xl p-8 text-center space-y-4"
        style={{ backgroundColor: 'var(--bv-surface)', borderColor: 'var(--bv-line)' }}
      >
        <div className="text-xs font-bold uppercase tracking-widest text-[var(--bv-brand)]">
          BuilderVerse · Certificate Verification
        </div>

        {rendered.status === 'valid' && rendered.record ? (
          <div className="space-y-3">
            <div className="mx-auto size-14 rounded-full grid place-items-center bg-[var(--bv-success-soft)]">
              <ShieldCheck className="size-7 text-[var(--bv-success)]" />
            </div>
            <h1 className="text-xl font-extrabold">Valid Certificate ✓</h1>
            <p className="text-sm text-[var(--bv-muted)] leading-relaxed">
              This certificate was genuinely issued by BuilderVerse for real completed work —
              every lesson, exercise and project behind it was checked against actual progress.
            </p>
            <div className="p-4 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-left space-y-1.5 text-xs">
              <div>
                <b>Presented to:</b>{' '}
                {rendered.record.publiclyShared
                  ? rendered.record.displayName
                  : <span className="text-[var(--bv-muted)] italic">hidden by the student's sharing setting</span>}
              </div>
              <div><b>Course / achievement:</b> {rendered.record.courseName}</div>
              <div><b>Level:</b> {rendered.record.level}</div>
              <div><b>Issued:</b> {rendered.record.issuedAt}</div>
              <div className="font-mono text-[var(--bv-ink-soft)]"><b>ID:</b> {rendered.record.id}</div>
            </div>
            <p className="text-[11px] text-[var(--bv-muted)]">
              Issued by BuilderVerse · Learn. Think. Build. (Not a government or university credential.)
            </p>
          </div>
        ) : rendered.status === 'revoked' ? (
          <div className="space-y-3">
            <div className="mx-auto size-14 rounded-full grid place-items-center bg-[var(--bv-danger-soft)]">
              <ShieldAlert className="size-7 text-[var(--bv-danger)]" />
            </div>
            <h1 className="text-xl font-extrabold">Certificate Revoked</h1>
            <p className="text-sm text-[var(--bv-muted)] leading-relaxed">
              Certificate <span className="font-mono">{certId}</span> was valid once, but the student has
              revoked it. A revoked certificate must not be treated as valid.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto size-14 rounded-full grid place-items-center bg-[var(--bv-surface-2)]">
              <SearchX className="size-7 text-[var(--bv-muted)]" />
            </div>
            <h1 className="text-xl font-extrabold">Certificate Not Found</h1>
            <p className="text-sm text-[var(--bv-muted)] leading-relaxed">
              No matching certificate was found for <span className="font-mono">{certId}</span>.
              Check the ID for typos, or ask the student for a fresh verification link.
            </p>
          </div>
        )}

        <button
          onClick={onBack}
          className="w-full py-2.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="size-3.5" /> Back to BuilderVerse
        </button>
      </div>
    </div>
  );
};
