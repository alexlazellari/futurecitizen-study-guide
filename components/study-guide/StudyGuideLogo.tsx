import Image from "next/image";
import { cn } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.futurecitizen.co.uk";

type LogoSize = "sm" | "md";

type StudyGuideLogoProps = {
  size?: LogoSize;
  showText?: boolean;
  textClassName?: string;
  className?: string;
  asLink?: boolean;
};

const SIZE_STYLES: Record<
  LogoSize,
  {
    imgClass: string;
    imgSize: number;
    gap: string;
    label: string;
  }
> = {
  sm: {
    imgClass: "h-5 w-5",
    imgSize: 20,
    gap: "gap-1.5",
    label: "text-xs",
  },
  md: {
    imgClass: "h-6 w-6",
    imgSize: 24,
    gap: "gap-1.5",
    label: "text-sm",
  },
};

export function StudyGuideLogo({
  size = "md",
  showText = true,
  textClassName,
  className,
  asLink = true,
}: StudyGuideLogoProps) {
  const styles = SIZE_STYLES[size];
  const textWrap = textClassName ?? "flex flex-col leading-none";

  const content = (
    <>
      <Image
        src="/study-guide/images/uk-flag.png"
        alt="British flag"
        width={styles.imgSize}
        height={styles.imgSize}
        className={cn(styles.imgClass, "object-contain")}
      />
      {showText ? (
        <span className={textWrap}>
          <span
            className={cn(
              styles.label,
              "font-(family-name:--font-space-grotesk) tracking-tight",
            )}
          >
            <span className="font-bold text-slate-900 dark:text-slate-100">Future</span><span className="font-medium text-slate-600 dark:text-slate-400">Citizen</span>
          </span>
        </span>
      ) : (
        <span className="sr-only">FutureCitizen</span>
      )}
    </>
  );

  const wrapperClassName = cn(
    "group inline-flex items-center",
    styles.gap,
    className,
  );

  return asLink ? (
    <a href={SITE_URL} aria-label="FutureCitizen" className={wrapperClassName}>
      {content}
    </a>
  ) : (
    <span aria-label="FutureCitizen" className={wrapperClassName}>
      {content}
    </span>
  );
}
