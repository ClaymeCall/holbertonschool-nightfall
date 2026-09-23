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

const delay = (seconds) => ({ animationDelay: `${seconds}s` });

// Also renders the "Le parc" section so the landing content stays in one place
// and the page that mounts <Hero /> does not need to change.
function Hero({
  title = 'Nightfall',
  eyebrow = "Parc d'expériences immersives",
  tagline = 'Entrez dans la nuit.',
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
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-canvas to-transparent"
        />

        <p
          style={delay(0)}
          className="text-xs font-semibold uppercase tracking-[0.35em] text-highlight motion-safe:animate-fade-up"
        >
          {eyebrow}
        </p>

        <h1
          style={delay(0.1)}
          className="mt-5 font-display text-[2.6rem] font-semibold uppercase tracking-[0.1em] text-ink drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)] motion-safe:animate-fade-up sm:text-7xl md:text-8xl"
        >
          {title}
        </h1>

        <p
          style={delay(0.2)}
          className="mt-4 font-display text-2xl italic text-ink motion-safe:animate-fade-up sm:text-4xl"
        >
          {tagline}
        </p>

        <p
          style={delay(0.3)}
          className="mt-6 max-w-xl text-sm uppercase tracking-widest text-ink-muted motion-safe:animate-fade-up sm:text-base"
        >
          {subtitle}
        </p>

        <div
          style={delay(0.4)}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 motion-safe:animate-fade-up"
        >
          <Button as="a" href={ctaHref} size="lg">
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
