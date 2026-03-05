import Image from "next/image";

type Props = {
  readonly src: string;
  readonly alt: string;
  readonly lightBg?: boolean;
};

export function StudyFigure({ src, alt, lightBg }: Props) {
  return (
    <figure>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        sizes="(max-width: 768px) 100vw, 700px"
        style={{ width: "100%", height: "auto" }}
        className={lightBg ? "study-figure-light-bg" : undefined}
      />
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  );
}
