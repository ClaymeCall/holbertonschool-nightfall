import React from 'react';
import { Link } from 'react-router-dom';
import { experienceImageUrl, formatPrice } from '../../lib/format';
import { themeForExperience } from '../../lib/themes';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

function ExperienceCard({ experience }) {
  const {
    id,
    name,
    description,
    image,
    category,
    duration,
    intensity_level: intensityLevel,
    price,
  } = experience;

  const imageUrl = experienceImageUrl(image);

  return (
    <article
      data-theme={themeForExperience(experience)}
      className="motion-safe:animate-fade-up group relative isolate overflow-hidden rounded-xl border border-t-2 border-line border-t-accent bg-canvas shadow-lg shadow-black/50 transition duration-300 hover:-translate-y-1 hover:border-accent/60 hover:border-t-accent focus-within:border-highlight focus-within:border-t-accent"
    >
      <Link
        to={`/experiences/${id}`}
        aria-label={`Découvrir l'expérience ${name}`}
        className="relative flex min-h-[420px] flex-col justify-end p-6 no-underline"
      >
        {/* Backdrop: real photo when available, themed gradient fallback otherwise */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
            backgroundColor: 'rgb(var(--color-canvas))',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgb(var(--color-accent)/0.45),transparent_55%)]" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-canvas via-canvas/70 to-transparent" />

        {category && <Badge className="mb-3">{category}</Badge>}

        <h3 className="font-display text-3xl font-semibold leading-tight text-ink drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          {name}
        </h3>

        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{description}</p>
        )}

        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-bold text-ink">
            {formatPrice(price)}
          </span>
          <Button as="span" className="group-hover:brightness-110">
            Explorer
            <span aria-hidden="true">→</span>
          </Button>
        </div>

        {(duration || intensityLevel) && (
          <p className="mt-3 text-right text-[11px] uppercase tracking-widest text-ink-muted">
            {duration ? `${duration} min` : null}
            {duration && intensityLevel ? ' · ' : null}
            {intensityLevel}
          </p>
        )}
      </Link>
    </article>
  );
}

export default ExperienceCard;
