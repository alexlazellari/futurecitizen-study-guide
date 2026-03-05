import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
        src="/images/uk-flag.png"
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
              "font-semibold tracking-tight",
              "text-slate-900 dark:text-slate-100",
            )}
          >
            LifeUK{" "}
            <span className="text-slate-500 dark:text-slate-400">Prep</span>
          </span>
        </span>
      ) : (
        <span className="sr-only">LifeUK Prep</span>
      )}
    </>
  );

  const wrapperClassName = cn(
    "group inline-flex items-center",
    styles.gap,
    className,
  );

  return asLink ? (
    <Link href="/" aria-label="LifeUKPrep" className={wrapperClassName}>
      {content}
    </Link>
  ) : (
    <span aria-label="LifeUKPrep" className={wrapperClassName}>
      {content}
    </span>
  );
}
