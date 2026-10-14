import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

/* ------------------------------------------------------------------ Button */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const buttonVariant: Record<ButtonVariant, string> = {
  primary: "bv-btn-primary",
  secondary: "bv-btn-secondary",
  ghost: "bv-btn-ghost",
  danger: "bv-btn-danger",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm" ? "!px-3 !py-2 !text-[0.8rem]" : size === "lg" ? "!px-6 !py-3.5 !text-base" : "";
  return (
    <button
      className={clsx("bv-btn", buttonVariant[variant], sizeClass, className)}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: {
  href: string;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const sizeClass =
    size === "sm" ? "!px-3 !py-2 !text-[0.8rem]" : size === "lg" ? "!px-6 !py-3.5 !text-base" : "";
  return (
    <Link
      href={href}
      className={clsx("bv-btn", buttonVariant[variant], sizeClass, className)}
      {...props}
    >
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ Input */

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx("bv-input w-full", className)} {...props} />;
}

/* ---------------------------------------------------------------- Textarea */

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={clsx("bv-input w-full", className)} {...props} />;
}

/* ------------------------------------------------------------------- Card */

export function Card({
  children,
  className,
  flat = false,
}: {
  children: ReactNode;
  className?: string;
  flat?: boolean;
}) {
  return <div className={clsx(flat ? "bv-card-flat" : "bv-card", "p-5", className)}>{children}</div>;
}

/* ------------------------------------------------------------------- Pill */

export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "success" | "warning" | "danger" | "accent";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "",
    brand: "!bg-brand-soft !text-brand !border-brand/25",
    success: "!bg-success-soft !text-success !border-success/25",
    warning: "!bg-warning-soft !text-warning !border-warning/25",
    danger: "!bg-danger-soft !text-danger !border-danger/25",
    accent: "!bg-accent-soft !text-accent !border-accent/25",
  };
  return <span className={clsx("bv-pill", tones[tone], className)}>{children}</span>;
}

/* ------------------------------------------------------------- ProgressBar */

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  tone = "brand",
}: {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  tone?: "brand" | "accent" | "success";
}) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const barColor =
    tone === "accent" ? "bg-accent" : tone === "success" ? "bg-success" : "bg-brand";
  return (
    <div>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label && <span className="font-semibold text-ink-soft">{label}</span>}
          {showValue && <span className="font-mono text-muted">{percent}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
        className="h-2.5 w-full overflow-hidden rounded-full bg-surface-3"
      >
        <div
          className={`h-full rounded-full ${barColor} transition-[width] duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Spinner */

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={clsx(
        "inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
    />
  );
}

/* --------------------------------------------------------------- Skeleton */

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={clsx("bv-skeleton", className)} />;
}

/* ------------------------------------------------------------- EmptyState */

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="bv-card-flat flex flex-col items-center gap-3 px-6 py-12 text-center">
      {icon && <div className="text-3xl">{icon}</div>}
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <p className="max-w-md text-sm text-muted">{body}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/* ---------------------------------------------------------- SectionHeading */

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "left",
  level = "h2",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
  /** Set to "h1" when this heading is the page title. */
  level?: "h1" | "h2";
}) {
  const Heading = level;
  return (
    <div className={clsx("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand">{eyebrow}</p>
      )}
      <Heading className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</Heading>
      {sub && <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{sub}</p>}
    </div>
  );
}

/* ----------------------------------------------------------------- Avatar */

export function Avatar({
  emoji,
  size = "md",
}: {
  emoji: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeClass =
    size === "sm"
      ? "size-8 text-base"
      : size === "lg"
        ? "size-14 text-2xl"
        : size === "xl"
          ? "size-20 text-4xl"
          : "size-11 text-xl";
  return (
    <span
      aria-hidden
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand/20 to-accent/20 ring-1 ring-line",
        sizeClass,
      )}
    >
      {emoji}
    </span>
  );
}
