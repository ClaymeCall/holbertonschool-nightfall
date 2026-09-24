import React from 'react';
import Button from '../ui/Button';
import ParkConcept from './ParkConcept';

// Static, decorative star field: a few tiny radial dots, no animation.
const STARS = [
  [12, 22, 1.5], [27, 58, 1], [38, 14, 1.5], [46, 71, 1], [58, 30, 1],
  [66, 12, 1.5], [74, 64, 1], [83, 38, 1], [91, 78, 1.5], [7, 82, 1], [52, 48, 1],
]
  .map(([x, y, r]) => `radial-gradient(${r}px ${r}px at ${x}% ${y}%, rgb(var(--color-ink) / 0.85), transparent)`)
  .join(',');

// Neon glow built from the theme accent, so it follows the active data-theme.
const NEON_GLOW =
  '[text-shadow:0_0_8px_rgb(var(--color-accent)),0_0_26px_rgb(var(--color-accent)),0_0_70px_rgb(var(--color-accent)/0.65)]';

const delay = (seconds) => ({ animationDelay: `${seconds}s` });

// Also renders the "Le parc" section so the landing content stays in one place
// and the page that mounts <Hero /> does not need to change.
function Hero({
  title = 'Nightfall',
  eyebrow = "Parc d'expériences immersives",
  tagline = "Entrez si vous l'osez.",
  subtitle = "Explorez l'inconnu. Découvrez l'inexplicable.",
  ctaText = 'Découvrir les expériences',
  ctaHref = '#experiences',
}) {
  return (
    <>
      <section className="relative isolate flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: STARS, backgroundRepeat: 'no-repeat' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_25%,rgb(var(--color-accent)/0.28),transparent_60%)]"
        />
        <div
          aria-hidden="true"
          className="absolute right-[10%] top-[12%] -z-10 h-14 w-14 rounded-full bg-ink/85 shadow-[0_0_70px_24px_rgb(var(--color-highlight)/0.35)] sm:h-20 sm:w-20"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 1280 240"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-x-0 bottom-0 -z-10 h-40 w-full sm:h-60"
        >
          <rect x="0" y="206" width="1280" height="34" className="fill-surface" />
          <g className="stroke-line" strokeWidth="3" fill="none">
            <circle cx="300" cy="110" r="96" />
            <path d="M300 14v192M204 110h192M232 42l136 136M368 42L232 178M300 110L262 206M300 110L338 206" />
          </g>
          <g className="fill-accent">
            <circle cx="300" cy="14" r="4" />
            <circle cx="368" cy="42" r="4" />
            <circle cx="396" cy="110" r="4" />
            <circle cx="368" cy="178" r="4" />
            <circle cx="300" cy="206" r="4" />
            <circle cx="232" cy="178" r="4" />
            <circle cx="204" cy="110" r="4" />
            <circle cx="232" cy="42" r="4" />
          </g>
          <g className="fill-surface">
            <path d="M1000 206L1024 70L1036 70L1060 206Z" />
            <rect x="1018" y="44" width="24" height="28" rx="3" />
            <path d="M1140 206L1152 110L1158 110L1170 206Z" />
          </g>
          <path
            d="M560 206C640 60 720 60 800 206M800 206C860 100 920 100 980 206"
            className="stroke-line"
            strokeWidth="4"
            fill="none"
          />
        </svg>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-canvas to-transparent"
        />

        <p
          style={delay(0)}
          className="text-xs font-semibold uppercase tracking-[0.35em] text-highlight motion-safe:animate-fade-up"
        >
          {eyebrow}
        </p>

        <h1
          style={delay(0.1)}
          className="mt-5 font-display text-[2.8rem] uppercase leading-none tracking-[0.06em] text-ink motion-safe:animate-fade-up sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem]"
        >
          <span className={`block motion-safe:animate-flicker ${NEON_GLOW}`}>{title}</span>
        </h1>

        <p
          style={delay(0.2)}
          className="mt-6 text-xl text-ink motion-safe:animate-fade-up sm:text-2xl"
        >
          {tagline}
        </p>

        <p
          style={delay(0.3)}
          className="mt-3 max-w-xl text-sm uppercase tracking-widest text-ink-muted motion-safe:animate-fade-up sm:text-base"
        >
          {subtitle}
        </p>

        <div
          style={delay(0.4)}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 motion-safe:animate-fade-up"
        >
          <Button
            as="a"
            href={ctaHref}
            size="lg"
            className="shadow-[0_0_30px_rgb(var(--color-accent)/0.4)]"
          >
            {ctaText}
            <span aria-hidden="true">→</span>
          </Button>
          <Button as="a" href="#concept" variant="ghost" size="lg">
            Découvrir le parc
          </Button>
        </div>
      </section>

      <ParkConcept />
    </>
  );
}

export default Hero;
