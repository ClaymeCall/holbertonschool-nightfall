import React from 'react';

function Hero({
  title = 'Nightfall',
  subtitle = "Des expériences immersives et troublantes, à vivre après la tombée de la nuit.",
  ctaText = 'Découvrir les expériences',
  ctaHref = '#experiences',
}) {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-deep-black px-6 text-center">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(139,0,0,0.35),transparent_60%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-deep-black/60 to-deep-black" />

      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-night-mauve">
        Après la tombée de la nuit
      </p>

      <h1 className="max-w-3xl text-5xl font-bold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] sm:text-6xl">
        {title}
      </h1>

      <p className="mt-6 max-w-xl text-base text-gray-300 sm:text-lg">
        {subtitle}
      </p>

      <a
        href={ctaHref}
        className="mt-10 inline-flex items-center gap-2 rounded-md bg-blood-red px-6 py-3 text-sm font-bold text-white no-underline transition-opacity hover:opacity-90"
      >
        {ctaText}
        <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}

export default Hero;
