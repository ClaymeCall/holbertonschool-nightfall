import { useId } from "react";

type NightfallLogoProps = {
  className?: string;
  /** Texte accessible ; passer "" si le logo est décoratif (ex. à côté du nom écrit). */
  title?: string;
};

/**
 * Logo Nightfall — « Éclipse griffée ».
 * Couleurs pilotées par les variables CSS --nf-ink et --nf-accent :
 * changez-les sur un parent (ou :root) pour suivre le thème du site.
 */
export function NightfallLogo({ className = "size-12", title = "Nightfall" }: NightfallLogoProps) {
  const maskId = `nf-crescent-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const decorative = title === "";

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
    >
      <defs>
        <mask id={maskId}>
          <rect width="200" height="200" fill="#fff" />
          <circle cx="112" cy="90" r="84" fill="#000" />
        </mask>
      </defs>

      <circle
        cx="100"
        cy="100"
        r="86"
        mask={`url(#${maskId})`}
        className="fill-[var(--nf-accent,#6f8cff)] transition-colors duration-500 motion-reduce:transition-none"
      />

      <g
        transform="translate(100 100) scale(.62) translate(-101 -100)"
        className="fill-[var(--nf-ink,currentColor)] transition-colors duration-500 motion-reduce:transition-none"
      >
        <path d="M42 28L62 24Q58 100 52 178Q48 100 42 28Z" />
        <path d="M58 26L80 22Q116 98 152 176Q108 112 58 26Z" />
        <path d="M138 178L160 176Q156 100 150 22Q144 100 138 178Z" />
      </g>
    </svg>
  );
}

export default NightfallLogo;
