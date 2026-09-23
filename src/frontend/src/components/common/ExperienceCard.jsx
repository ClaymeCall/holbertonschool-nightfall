import React from 'react';
import { Link } from 'react-router-dom';
import { API_ORIGIN } from '../../lib/api';
import { intensityLabel } from '../../lib/intensity';

const currencyFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

const IMAGE_BASE_URL = `${API_ORIGIN}/images/experiences/`;

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

  const imageUrl = image ? `${IMAGE_BASE_URL}${image}` : null;
  const intensityLabelText = intensityLabel(intensityLevel);

  return (
    <article className="group relative isolate overflow-hidden rounded-xl border border-gray-800 bg-deep-black shadow-lg shadow-black/50 transition-transform duration-300 hover:-translate-y-1">
      <Link
        to={`/experiences/${id}`}
        aria-label={`Découvrir l'expérience ${name}`}
        className="relative flex min-h-[420px] flex-col justify-end p-6 no-underline"
      >
        {/* Backdrop: real photo when available, gothic gradient fallback otherwise */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
            backgroundColor: '#0a0a0a',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(139,0,0,0.35),transparent_55%)]" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-deep-black via-deep-black/70 to-transparent" />

        {category && (
          <span className="mb-3 w-fit rounded-full border border-blood-red/60 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-blood-red">
            {category}
          </span>
        )}

        <h3 className="text-2xl font-bold leading-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          {name}
        </h3>

        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-gray-300">{description}</p>
        )}

        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            {currencyFormatter.format(Number(price))}
          </span>
          <span className="flex items-center gap-2 rounded-md bg-blood-red px-4 py-2 text-sm font-bold text-white transition-opacity group-hover:opacity-90">
            Explorer
            <span aria-hidden="true">→</span>
          </span>
        </div>

        {(duration || intensityLabelText) && (
          <p className="mt-3 text-right text-[11px] uppercase tracking-widest text-gray-500">
            {duration ? `${duration} min` : null}
            {duration && intensityLabelText ? ' · ' : null}
            {intensityLabelText}
          </p>
        )}
      </Link>
    </article>
  );
}

export default ExperienceCard;
