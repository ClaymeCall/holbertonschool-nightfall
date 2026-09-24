import React from 'react';
import { Link } from 'react-router-dom';

// Full class names (not built from a variable) so Tailwind can see them.
const TONES = {
  accent: {
    card: 'border-t-accent',
    glow: 'bg-[radial-gradient(circle_at_50%_0%,rgb(var(--color-accent)/0.22),transparent_55%)]',
  },
  highlight: {
    card: 'border-t-highlight',
    glow: 'bg-[radial-gradient(circle_at_50%_0%,rgb(var(--color-highlight)/0.2),transparent_55%)]',
  },
};

// The page shell shared by Login and Register: background, card, heading,
// and the link to the other page. The form goes in `children`.
function AuthCard({
  id,
  tone = 'accent',
  eyebrow,
  title,
  intro,
  footerText,
  footerTo,
  footerLabel,
  children,
}) {
  const styles = TONES[tone];

  return (
    <main className="relative isolate flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-canvas px-4 py-12 text-ink">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/nightfall-gates.webp)' }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-canvas/70" />
      <div aria-hidden="true" className={`absolute inset-0 -z-10 ${styles.glow}`} />

      <section
        className={`w-full max-w-md rounded-2xl border border-t-[3px] border-line ${styles.card} bg-surface p-8 shadow-2xl shadow-black/50`}
        aria-labelledby={`${id}-title`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-highlight">
          {eyebrow}
        </p>
        <h1 id={`${id}-title`} className="mt-2 font-display text-4xl leading-tight text-ink">
          {title}
        </h1>
        <p className="mt-3 text-ink-muted">{intro}</p>

        {children}

        <p className="mt-6 text-center text-ink-muted">
          {footerText}{" "}
          <Link to={footerTo} className="font-bold text-highlight underline hover:brightness-125">
            {footerLabel}
          </Link>
        </p>
      </section>
    </main>
  );
}

export default AuthCard;
