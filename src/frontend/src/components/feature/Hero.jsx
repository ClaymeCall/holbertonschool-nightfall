import React from 'react';
import Button from '../ui/Button';
import NightfallLogo from '../ui/NightfallLogo';
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
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/nightfall-gates.webp)' }}
        />
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-canvas/70" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-canvas to-transparent"
        />

        <NightfallLogo
          style={delay(0)}
          className="h-16 w-16 motion-safe:animate-fade-up sm:h-20 sm:w-20"
          title=""
        />

        <p
          style={delay(0.1)}
          className="mt-5 text-xs font-semibold uppercase tracking-[0.35em] text-highlight motion-safe:animate-fade-up"
        >
          {eyebrow}
        </p>

        <h1
          style={delay(0.2)}
          className="mt-5 font-display text-[2.8rem] uppercase leading-none tracking-[0.06em] text-ink motion-safe:animate-fade-up sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem]"
        >
          <span className={`block motion-safe:animate-flicker ${NEON_GLOW}`}>{title}</span>
        </h1>

        <p
          style={delay(0.3)}
          className="mt-6 text-xl text-ink motion-safe:animate-fade-up sm:text-2xl"
        >
          {tagline}
        </p>

        <p
          style={delay(0.4)}
          className="mt-3 max-w-xl text-sm uppercase tracking-widest text-ink-muted motion-safe:animate-fade-up sm:text-base"
        >
          {subtitle}
        </p>

        <div
          style={delay(0.5)}
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
