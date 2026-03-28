import { cn } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.futurecitizen.co.uk";

type LogoSize = "sm" | "md";

type StudyGuideLogoProps = {
  size?: LogoSize;
  className?: string;
  asLink?: boolean;
};

const SIZE_STYLES: Record<LogoSize, { label: string }> = {
  sm: { label: "text-sm" },
  md: { label: "text-base" },
};

export function StudyGuideLogo({
  size = "md",
  className,
  asLink = true,
}: StudyGuideLogoProps) {
  const { label } = SIZE_STYLES[size];

  const content = (
    <span
      className={cn(
        label,
        "inline-flex items-baseline gap-0.5 whitespace-nowrap font-(family-name:--font-space-grotesk) tracking-tight",
      )}
      aria-label="FutureCitizen"
    >
      <span className="font-semibold text-[#4288c9]">future</span>
      <span className="inline-flex items-baseline">
        <span className="font-light text-slate-400 dark:text-slate-400">[</span>
        <span className="font-medium mx-0.5 text-slate-800 dark:text-slate-100">citizen</span>
        <span className="font-light text-slate-400 dark:text-slate-400">]</span>
      </span>
    </span>
  );

  const wrapperClassName = cn("inline-flex items-center", className);

  return asLink ? (
    <a href={SITE_URL} aria-label="FutureCitizen home" className={wrapperClassName}>
      {content}
    </a>
  ) : (
    <span aria-label="FutureCitizen" className={wrapperClassName}>
      {content}
    </span>
  );
}
