import React, { useMemo, useRef, useState } from 'react';
import { X, Award, Camera, RefreshCw, Download, Copy, CheckCircle2, ShieldCheck, PartyPopper, ArrowLeft, ArrowRight, Eye, EyeOff, Trash2 } from 'lucide-react';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { LEARNING_PATHS } from '../data/builderVerseData';
import { OwnProject } from './BuildOwnProjectModal';
import {
  CertificateLevel, CertificateRecord, compressPhoto, generateCertificateId,
  linkedInAnnouncement, loadCertificates, saveCertificates, verificationUrl
} from '../utils/certificates';
import { triggerPathCompleteConfetti } from '../utils/confetti';

/**
 * GRADUATION STUDIO — the student's graduation moment.
 * A short celebration flow: eligibility (checked against REAL progress)
 * → display name + optional photo → template choice → live preview →
 * issued certificate → PNG/PDF download + verification link.
 */

type StudioStage = 'welcome' | 'details' | 'template' | 'preview' | 'issued' | 'my-certs';

interface TemplateDef {
  id: CertificateRecord['template'];
  name: string;
  blurb: string;
}

const TEMPLATES: TemplateDef[] = [
  { id: 'pink-dream', name: 'Pink Dream', blurb: 'Blush-pink & cream, delicate florals, stars and hearts.' },
  { id: 'coding-star', name: 'Coding Star', blurb: 'Pastel pink & lavender with coding symbols and a badge.' },
  { id: 'future-builder', name: 'Future Builder', blurb: 'Cream with rose-gold accents, border, ID + QR code.' }
];

interface Eligibility {
  pathId: string;
  pathName: string;
  level: CertificateLevel;
  detail: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  completedLessonIds: string[];
  completedProjectIds: string[];
  ownProjects: OwnProject[];
  onEarnXp: (amount: number) => void;
}

export const GraduationStudioModal: React.FC<Props> = ({
  isOpen, onClose, username, completedLessonIds, completedProjectIds, ownProjects, onEarnXp
}) => {
  const [stage, setStage] = useState<StudioStage>('welcome');
  const [displayName, setDisplayName] = useState(username);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState('');
  const [template, setTemplate] = useState<CertificateRecord['template']>('pink-dream');
  const [chosen, setChosen] = useState<Eligibility | null>(null);
  const [issued, setIssued] = useState<CertificateRecord | null>(null);
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);
  const [exportError, setExportError] = useState('');
  const [copied, setCopied] = useState<'verify' | 'linkedin' | null>(null);
  const [certs, setCerts] = useState<CertificateRecord[]>([]);
  const certPreviewRef = useRef<HTMLDivElement>(null);

  // Eligibility is computed from REAL progress — never from page views.
  const eligibility: Eligibility[] = useMemo(() => {
    const list: Eligibility[] = [];
    for (const path of LEARNING_PATHS) {
      const total = path.lessons.length;
      const done = path.lessons.filter(l => completedLessonIds.includes(l.id)).length;
      if (total > 0 && done === total) {
        const alreadyIssued = loadCertificates().some(
          c => c.courseId === path.id && c.level === 'Course Graduate' && !c.revoked
        );
        if (!alreadyIssued) {
          list.push({
            pathId: path.id,
            pathName: path.title,
            level: 'Course Graduate',
            detail: `${done}/${total} lessons, exercises and quizzes completed`
          });
        }
      }
    }
    if (completedProjectIds.length > 0) {
      const count = completedProjectIds.length;
      list.push({
        pathId: `project-creator-${count}`,
        pathName: `${count} Guided Project${count > 1 ? 's' : ''}`,
        level: 'Project Creator',
        detail: 'Built, tested and documented a practical project'
      });
    }
    const doneOwn = ownProjects.filter(p => p.status === 'done');
    if (doneOwn.length > 0) {
      list.push({
        pathId: `independent-builder-${doneOwn.length}`,
        pathName: doneOwn[0].title || 'My Original Project',
        level: 'Independent Builder',
        detail: 'Created, tested and documented an original project'
      });
    }
    return list;
  }, [completedLessonIds, completedProjectIds, ownProjects]);

  // Open the studio fresh and load the graduate's certificates.
  React.useEffect(() => {
    if (isOpen) {
      setStage('welcome');
      setDisplayName(username);
      setPhoto(null);
      setPhotoError('');
      setChosen(null);
      setIssued(null);
      setExportError('');
      setCerts(loadCertificates());
    }
  }, [isOpen, username]);

  /** Read a photo file, validate it, compress it, and store a data URL. */
  const handlePhotoFile = (file: File | undefined) => {
    setPhotoError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose an image file (JPG or PNG).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setPhotoError('That photo is larger than 8 MB — please pick a smaller one.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const compressed = await compressPhoto(String(reader.result));
        setPhoto(compressed);
      } catch {
        setPhotoError('Could not read that photo. Please try a different file.');
      }
    };
    reader.onerror = () => setPhotoError('Could not read that photo. Please try a different file.');
    reader.readAsDataURL(file);
  };

  /** Issue the verified certificate and save it to the local registry. */
  const handleIssue = () => {
    if (!chosen || !displayName.trim()) return;
    const id = generateCertificateId(chosen.pathId);
    const record: CertificateRecord = {
      id,
      displayName: displayName.trim(),
      courseId: chosen.pathId,
      courseName: chosen.pathName,
      level: chosen.level,
      issuedAt: new Date().toISOString().slice(0, 10),
      template,
      photoDataUrl: photo,
      revoked: false
    };
    const next = [...loadCertificates(), record];
    saveCertificates(next);
    setCerts(next);
    setIssued(record);
    setStage('issued');
    onEarnXp(100); // graduation is the biggest reward on the platform
    triggerPathCompleteConfetti();
  };

  /** Render the live certificate DOM to a high-resolution PNG. */
  const renderPreviewPng = async (): Promise<string> => {
    if (!certPreviewRef.current) throw new Error('Certificate preview is not ready');
    // Wait for webfonts + the photo/QR images so the export matches the preview.
    try {
      await document.fonts.ready;
    } catch { /* fonts are best-effort */ }
    const canvas = await html2canvas(certPreviewRef.current, {
      backgroundColor: '#FFF5F6',
      scale: 2.5,
      useCORS: true,
      logging: false
    });
    return canvas.toDataURL('image/png');
  };

  const handleDownloadPng = async () => {
    if (!issued) return;
    setExporting('png');
    setExportError('');
    try {
      const png = await renderPreviewPng();
      const a = document.createElement('a');
      a.href = png;
      a.download = `${issued.id}.png`;
      a.click();
    } catch {
      setExportError('PNG export failed. Please try again.');
    }
    setExporting(null);
  };

  const handleDownloadPdf = async () => {
    if (!issued) return;
    setExporting('pdf');
    setExportError('');
    try {
      const png = await renderPreviewPng();
      // Landscape A4: the PNG (same aspect) fills the page like a print layout.
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      pdf.addImage(png, 'PNG', 0, 0, 297, 210);
      pdf.save(`${issued.id}.pdf`);
    } catch {
      setExportError('PDF export failed. Please try again.');
    }
    setExporting(null);
  };

  const handleCopy = (kind: 'verify' | 'linkedin', text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(kind);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  /** The live certificate preview — the same DOM is exported to PNG/PDF. */
  const renderCertificate = (record: { displayName: string; courseName: string; level: CertificateLevel; issuedAt: string; id: string }, tpl: CertificateRecord['template'], photoSrc: string | null, qrDataUrl: string | null) => {
    const isPink = tpl === 'pink-dream';
    const isStar = tpl === 'coding-star';
    return (
      <div
        className="w-full aspect-[297/210] rounded-xl overflow-hidden relative flex flex-col items-center justify-center text-center p-6 sm:p-10"
        style={{
          background: isPink
            ? 'linear-gradient(135deg, #FFF5F6 0%, #FDEEF2 40%, #FFF9F3 100%)'
            : isStar
              ? 'linear-gradient(135deg, #FBF3FB 0%, #F3EAFB 55%, #FFF5F6 100%)'
              : '#FFFDF7',
          border: isPink ? '10px solid #F5DCE3' : isStar ? '10px solid #DCD0F2' : '10px solid #E6CFA8',
          outline: '2px solid var(--bv-line-strong)',
          outlineOffset: '-16px'
        }}
      >
        {/* Decorative corner stars */}
        <div className="absolute top-4 left-6 text-2xl select-none" aria-hidden>✦</div>
        <div className="absolute top-4 right-6 text-2xl select-none" aria-hidden>✦</div>
        <div className="absolute bottom-4 left-6 text-2xl select-none" aria-hidden>{isPink ? '🌸' : isStar ? '💻' : '✦'}</div>
        <div className="absolute bottom-4 right-6 text-2xl select-none" aria-hidden>{isPink ? '💗' : isStar ? '⭐' : '✦'}</div>

        <div className="text-[11px] sm:text-xs font-extrabold tracking-[0.3em] uppercase text-[var(--bv-brand)]">
          BuilderVerse · Learn. Think. Build.
        </div>
        <h3 className="mt-1 text-xl sm:text-3xl font-black text-[var(--bv-ink)]">
          Certificate of Achievement
        </h3>

        {/* Photo (or cute placeholder when the student chose text-only) */}
        {photoSrc ? (
          <img
            src={photoSrc}
            alt="Student"
            crossOrigin="anonymous"
            className="mt-2 size-14 sm:size-20 rounded-full object-cover border-4"
            style={{ borderColor: 'var(--bv-brand)' }}
          />
        ) : (
          <div className="mt-2 size-14 sm:size-20 rounded-full grid place-items-center text-2xl sm:text-4xl border-4 border-dashed border-[var(--bv-line-strong)] bg-white/60">
            🌷
          </div>
        )}

        <p className="mt-1 text-[10px] sm:text-xs text-[var(--bv-muted)]">This certificate is proudly presented to</p>
        <div className="text-lg sm:text-3xl font-black text-[var(--bv-brand)] leading-tight px-4">
          {record.displayName}
        </div>
        <p className="mt-1 text-[10px] sm:text-sm text-[var(--bv-ink-soft)] max-w-xl leading-snug">
          for successfully completing <b>{record.courseName}</b> — {record.level}.<br />
          Every concept learned, every bug solved, and every challenge attempted has strengthened your skills.
        </p>

        <div className="mt-2 flex items-end justify-between w-full px-1 sm:px-4">
          <div className="text-left text-[9px] sm:text-[11px] text-[var(--bv-muted)] leading-relaxed">
            <div>Issued: {record.issuedAt}</div>
            <div className="font-mono font-bold text-[var(--bv-ink-soft)]">{record.id}</div>
          </div>
          {qrDataUrl && (
            <img src={qrDataUrl} alt="Verification QR code" className="size-12 sm:size-20 bg-white p-1 rounded" />
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  /** Draft values shown in the live preview before the certificate is issued. */
  const draftRecord = {
    displayName: displayName.trim() || username || 'Your Name',
    courseName: chosen?.pathName || 'Your Course',
    level: (chosen?.level || 'Course Graduate') as CertificateLevel,
    issuedAt: new Date().toISOString().slice(0, 10),
    id: 'BV-YYYY-XXXXXX-XX'
  };
  const [draftQr, setDraftQr] = useState<string | null>(null);

  // Generate the draft QR once (links to the future verify page shape).
  React.useEffect(() => {
    let cancelled = false;
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    QRCode.toDataURL(`${base}/?verify=DRAFT`, { width: 160, margin: 1 }).then(url => {
      if (!cancelled) setDraftQr(url);
    }).catch(() => { /* QR is decorative in the draft */ });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col"
        style={{ backgroundColor: 'var(--bv-surface)', borderColor: 'var(--bv-line)', color: 'var(--bv-ink)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--bv-line)]">
          <div>
            <h2 className="text-lg font-extrabold flex items-center gap-2">
              <Award className="size-5 text-[var(--bv-brand)]" /> Graduation Studio
            </h2>
            <p className="text-xs text-[var(--bv-muted)] mt-0.5">
              Your graduation moment — earned, never given.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--bv-muted)] hover:text-[var(--bv-ink)] hover:bg-[var(--bv-surface-2)] transition"
            aria-label="Close Graduation Studio"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* WELCOME + ELIGIBILITY */}
          {stage === 'welcome' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-[var(--bv-surface-2)]/50 border border-[var(--bv-line)] text-center space-y-2">
                <div className="text-4xl">🎓</div>
                <h3 className="font-extrabold">Welcome to your graduation moment</h3>
                <p className="text-xs text-[var(--bv-muted)] max-w-md mx-auto leading-relaxed">
                  Certificates unlock only from work you actually completed — every lesson,
                  exercise, project and original build is checked against your real progress.
                </p>
              </div>

              {eligibility.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-[var(--bv-line-strong)] text-center space-y-2">
                  <p className="text-sm font-bold">No certificates unlocked yet 🌱</p>
                  <p className="text-xs text-[var(--bv-muted)] max-w-md mx-auto leading-relaxed">
                    Finish all lessons in any learning path, complete a guided project, or mark
                    one of your own projects as done — then come back. Your progress is saved, so
                    you can continue exactly where you left off.
                  </p>
                  <button
                    onClick={() => setStage('my-certs')}
                    className="text-xs font-bold text-[var(--bv-brand)] hover:underline"
                  >
                    View My Certificates anyway →
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold">You earned these — pick one to graduate with:</h3>
                  {eligibility.map(e => (
                    <div
                      key={e.pathId + e.level}
                      className={`p-4 rounded-xl border cursor-pointer transition hover:shadow-sm ${chosen?.pathId === e.pathId && chosen?.level === e.level ? 'border-[var(--bv-brand)] ring-2 ring-[var(--bv-brand)]/20' : 'border-[var(--bv-line)]'}`}
                      onClick={() => setChosen(e)}
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                          <div className="font-bold text-sm">{e.pathName}</div>
                          <div className="text-xs text-[var(--bv-muted)]">{e.detail}</div>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[var(--bv-brand-soft)] text-[var(--bv-brand)]">
                          {e.level}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => chosen && setStage('details')}
                      disabled={!chosen}
                      className="flex-1 py-2.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition disabled:opacity-40"
                    >
                      Continue with "{chosen?.pathName || '…'}" →
                    </button>
                    <button
                      onClick={() => setStage('my-certs')}
                      className="px-4 py-2.5 rounded-xl border border-[var(--bv-line)] text-xs font-bold hover:bg-[var(--bv-surface-2)] transition"
                    >
                      My Certificates
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* NAME + PHOTO DETAILS */}
          {stage === 'details' && (
            <div className="space-y-4">
              <button onClick={() => setStage('welcome')} className="text-xs font-bold text-[var(--bv-brand)] hover:underline flex items-center gap-1">
                <ArrowLeft className="size-3.5" /> Back to achievements
              </button>
              <div>
                <label className="text-xs font-bold block mb-1.5">
                  The name to print on your certificate
                </label>
                <input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  maxLength={60}
                  placeholder="e.g. Maya Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-sm font-bold focus:outline-none focus:border-[var(--bv-brand)]"
                />
                <p className="text-[11px] text-[var(--bv-muted)] mt-1">
                  Double-check the spelling — this exact name appears on the certificate. We never ask for ID documents.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1.5">
                  Your photo <span className="font-normal text-[var(--bv-muted)]">(optional — a text-only certificate is equally valid)</span>
                </label>
                <div className="flex items-center gap-4 flex-wrap">
                  {photo ? (
                    <img src={photo} alt="Certificate preview" className="size-20 rounded-full object-cover border-4 border-[var(--bv-brand)]" />
                  ) : (
                    <div className="size-20 rounded-full grid place-items-center text-3xl border-4 border-dashed border-[var(--bv-line-strong)] bg-[var(--bv-surface-2)]/50">
                      🌷
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs font-bold cursor-pointer hover:border-[var(--bv-brand)]/50 transition">
                      <Camera className="size-4" /> {photo ? 'Replace photo' : 'Upload photo'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handlePhotoFile(e.target.files?.[0])}
                      />
                    </label>
                    {photo && (
                      <button onClick={() => setPhoto(null)} className="block text-[11px] text-[var(--bv-muted)] hover:text-[var(--bv-danger)] transition">
                        Remove — use text-only certificate
                      </button>
                    )}
                  </div>
                </div>
                {photoError && <p className="text-xs text-[var(--bv-danger)] mt-1">{photoError}</p>}
                <p className="text-[11px] text-[var(--bv-muted)] mt-1">
                  Your photo is stored only on this device and used only on your certificate. You can remove it any time.
                </p>
              </div>

              <button
                onClick={() => setStage('template')}
                disabled={!displayName.trim()}
                className="w-full py-2.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                Choose My Certificate Design <ArrowRight className="size-3.5" />
              </button>
            </div>
          )}

          {/* TEMPLATE CHOICE */}
          {stage === 'template' && (
            <div className="space-y-4">
              <button onClick={() => setStage('details')} className="text-xs font-bold text-[var(--bv-brand)] hover:underline flex items-center gap-1">
                <ArrowLeft className="size-3.5" /> Back to name & photo
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`p-4 rounded-xl border text-left transition hover:shadow-sm ${template === t.id ? 'border-[var(--bv-brand)] ring-2 ring-[var(--bv-brand)]/20' : 'border-[var(--bv-line)]'}`}
                  >
                    <div
                      className="h-20 rounded-lg mb-2"
                      style={{
                        background: t.id === 'pink-dream'
                          ? 'linear-gradient(135deg, #FFF5F6, #FDEEF2)'
                          : t.id === 'coding-star'
                            ? 'linear-gradient(135deg, #FBF3FB, #F3EAFB)'
                            : '#FFFDF7',
                        border: t.id === 'future-builder' ? '4px solid #E6CFA8' : '4px solid #F5DCE3'
                      }}
                    >
                      <div className="h-full grid place-items-center text-2xl">
                        {t.id === 'pink-dream' ? '🌸' : t.id === 'coding-star' ? '💻' : '🏛️'}
                      </div>
                    </div>
                    <div className="font-bold text-xs">{t.name}</div>
                    <div className="text-[11px] text-[var(--bv-muted)] mt-0.5 leading-snug">{t.blurb}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStage('preview')}
                className="w-full py-2.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition flex items-center justify-center gap-1.5"
              >
                Preview My Certificate <ArrowRight className="size-3.5" />
              </button>
            </div>
          )}

          {/* LIVE PREVIEW + ISSUE */}
          {stage === 'preview' && (
            <div className="space-y-4">
              <button onClick={() => setStage('template')} className="text-xs font-bold text-[var(--bv-brand)] hover:underline flex items-center gap-1">
                <ArrowLeft className="size-3.5" /> Back to designs
              </button>
              <p className="text-xs text-[var(--bv-muted)] leading-relaxed">
                This is exactly what your downloaded file will look like. Check your name spelling one last time. 💗
              </p>
              <div ref={certPreviewRef}>
                {renderCertificate(draftRecord, template, photo, draftQr)}
              </div>
              <button
                onClick={handleIssue}
                className="w-full py-3 rounded-xl bg-[var(--bv-brand)] text-white text-sm font-extrabold hover:bg-[var(--bv-brand-strong)] transition flex items-center justify-center gap-2"
              >
                <PartyPopper className="size-4" /> Issue My Certificate +100 XP
              </button>
            </div>
          )}

          {/* ISSUED — the celebration + downloads */}
          {stage === 'issued' && issued && (
            <IssuedCertificateView
              record={issued}
              onPng={handleDownloadPng}
              onPdf={handleDownloadPdf}
              exporting={exporting}
              exportError={exportError}
              copied={copied}
              onCopy={handleCopy}
              renderCertificate={renderCertificate}
            />
          )}

          {/* MY CERTIFICATES DASHBOARD */}
          {stage === 'my-certs' && (
            <div className="space-y-3">
              <button onClick={() => setStage('welcome')} className="text-xs font-bold text-[var(--bv-brand)] hover:underline flex items-center gap-1">
                <ArrowLeft className="size-3.5" /> Back to Studio
              </button>
              {certs.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-[var(--bv-line-strong)] text-center">
                  <p className="text-sm font-bold">No certificates yet</p>
                  <p className="text-xs text-[var(--bv-muted)] mt-1">Complete a learning path to earn your first graduation moment. 🎓</p>
                </div>
              ) : (
                certs.map(c => (
                  <div key={c.id} className="p-4 rounded-xl border border-[var(--bv-line)] space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <div className="font-bold text-sm">{c.courseName}</div>
                        <div className="text-xs text-[var(--bv-muted)]">{c.level} · Issued {c.issuedAt}</div>
                        <div className="text-[11px] font-mono text-[var(--bv-ink-soft)]">{c.id}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.revoked ? 'bg-[var(--bv-danger-soft)] text-[var(--bv-danger)]' : 'bg-[var(--bv-success-soft)] text-[var(--bv-success)]'}`}>
                        {c.revoked ? 'Revoked' : 'Valid'}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          const next = loadCertificates().map(x => x.id === c.id ? { ...x, revoked: !x.revoked } : x);
                          saveCertificates(next);
                          setCerts(next);
                        }}
                        className="text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--bv-line)] hover:bg-[var(--bv-surface-2)] transition"
                      >
                        {c.revoked ? <><Eye className="size-3.5" /> Restore</> : <><EyeOff className="size-3.5" /> Revoke</>}
                      </button>
                      <button
                        onClick={() => handleCopy('verify', verificationUrl(c.id))}
                        className="text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--bv-line)] hover:bg-[var(--bv-surface-2)] transition"
                      >
                        <Copy className="size-3.5" /> Copy verify link
                      </button>
                      <button
                        onClick={() => {
                          const next = loadCertificates().filter(x => x.id !== c.id);
                          saveCertificates(next);
                          setCerts(next);
                        }}
                        className="ml-auto p-1.5 rounded-lg text-[var(--bv-muted)] hover:text-[var(--bv-danger)] hover:bg-[var(--bv-danger-soft)] transition"
                        aria-label="Delete certificate"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/** The post-issue celebration screen with downloads and sharing. */
function IssuedCertificateView(props: {
  record: CertificateRecord;
  onPng: () => void;
  onPdf: () => void;
  exporting: 'png' | 'pdf' | null;
  exportError: string;
  copied: 'verify' | 'linkedin' | null;
  onCopy: (kind: 'verify' | 'linkedin', text: string) => void;
  renderCertificate: (
    record: { displayName: string; courseName: string; level: CertificateLevel; issuedAt: string; id: string },
    tpl: CertificateRecord['template'],
    photoSrc: string | null,
    qrDataUrl: string | null
  ) => React.ReactNode;
}) {
  const { record } = props;
  const [qr, setQr] = useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(verificationUrl(record.id), { width: 180, margin: 1 }).then(url => {
      if (!cancelled) setQr(url);
    }).catch(() => { /* certificate stays valid without a QR preview */ });
    return () => { cancelled = true; };
  }, [record.id]);

  return (
    <div className="space-y-4 text-center">
      <div className="text-4xl">🎉</div>
      <div>
        <h3 className="font-extrabold text-base">You did it, {record.displayName}!</h3>
        <p className="text-xs text-[var(--bv-muted)] max-w-md mx-auto leading-relaxed mt-1">
          Remember when programming felt difficult? You kept learning, solving problems and trying again.
          This certificate celebrates how far you've come. Be proud. 🌷
        </p>
      </div>

      {props.renderCertificate(record, record.template, record.photoDataUrl, qr)}

      {props.exportError && (
        <p className="text-xs text-[var(--bv-danger)]">{props.exportError}</p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={props.onPng}
          disabled={props.exporting !== null}
          className="py-2.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          <Download className="size-4" /> {props.exporting === 'png' ? 'Rendering…' : 'Download PNG'}
        </button>
        <button
          onClick={props.onPdf}
          disabled={props.exporting !== null}
          className="py-2.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          <Download className="size-4" /> {props.exporting === 'pdf' ? 'Rendering…' : 'Download PDF'}
        </button>
      </div>

      <div className="p-3.5 rounded-xl bg-[var(--bv-success-soft)] border border-[var(--bv-line)] text-left space-y-2">
        <div className="text-xs font-bold flex items-center gap-1.5 text-[var(--bv-success)]">
          <ShieldCheck className="size-4" /> Verified certificate · {record.id}
        </div>
        <p className="text-[11px] text-[var(--bv-ink-soft)] leading-relaxed">
          Anyone can check this certificate at the verification link — it carries a checksum built into the ID.
        </p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => props.onCopy('verify', verificationUrl(record.id))}
            className="text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--bv-surface)] border border-[var(--bv-line)] hover:border-[var(--bv-brand)]/50 transition"
          >
            {props.copied === 'verify' ? <CheckCircle2 className="size-3.5 text-[var(--bv-success)]" /> : <Copy className="size-3.5" />}
            {props.copied === 'verify' ? 'Copied!' : 'Copy verification link'}
          </button>
          <button
            onClick={() => props.onCopy('linkedin', linkedInAnnouncement(record))}
            className="text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--bv-surface)] border border-[var(--bv-line)] hover:border-[var(--bv-brand)]/50 transition"
          >
            {props.copied === 'linkedin' ? <CheckCircle2 className="size-3.5 text-[var(--bv-success)]" /> : <Copy className="size-3.5" />}
            {props.copied === 'linkedin' ? 'Copied!' : 'Copy LinkedIn post'}
          </button>
        </div>
      </div>

      <p className="text-[11px] text-[var(--bv-muted)]">
        Tip: add the photo version to My Builder Portfolio, or share your text-only certificate anywhere. 💗
      </p>
    </div>
  );
}