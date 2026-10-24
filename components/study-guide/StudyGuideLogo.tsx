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
        // Inherits Nextra's system font stack rather than naming a family.
        // Space Grotesk was this zone's only webfont — 22KB fetched on every
        // page for these four words.
        "inline-block whitespace-nowrap tracking-tight",
      )}
    >
      {/*
        The document text here is exactly "FutureCitizen", the declared site
        name. The brackets are pseudo-element content from globals.css (see
        .wordmark-brackets), and the gap before them is a margin rather than a
        space, so neither reaches a crawler as text.
      */}
      <span className="font-semibold text-[#4288c9]">Future</span>
      <span className="wordmark-brackets ml-[0.25em] inline-block">
        <span className="font-medium mx-0.5 text-slate-800 dark:text-slate-100">Citizen</span>
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
