import React from 'react';
import { INTENSITY_LABELS } from '../../lib/intensity';
import { ChevronDownIcon, SearchIcon } from '../ui/icons';

const FIELD_LABEL = 'text-xs font-semibold uppercase tracking-[0.15em] text-ink-muted';

const INPUT =
  'w-full rounded-lg border border-line bg-canvas px-3.5 py-3 text-base text-ink placeholder:text-ink-muted/50 focus:border-highlight focus:outline-none focus:ring-2 focus:ring-highlight/40';

const SELECT = `${INPUT} appearance-none pr-10`;

function RangeField({ label, value, limits, onChange }) {
  const percent =
    limits.max > limits.min
      ? ((value - limits.min) / (limits.max - limits.min)) * 100
      : 0;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className={FIELD_LABEL}>{label}</span>
        <span className="font-display text-lg font-semibold text-ink lining-nums">
          {value} min
        </span>
      </div>

      <input
        type="range"
        min={limits.min}
        max={limits.max}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="nf-range mt-3"
        style={{
          background: `linear-gradient(to right, rgb(var(--color-accent)) ${percent}%, rgb(var(--color-line)) ${percent}%)`
        }}
      />
    </div>
  );
}

function ExperienceFilters({
  search,
  onSearchChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  category,
  onCategoryChange,
  categories,
  intensity,
  onIntensityChange,
  intensities,
  minDuration,
  onMinDurationChange,
  maxDuration,
  onMaxDurationChange,
  durationLimits,
  hasFilters,
  onReset
}) {
  return (
    <section className="mb-10 rounded-2xl border border-line bg-surface/60 p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-highlight">
            Affiner
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
            Trouvez votre expérience
          </h2>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold uppercase tracking-widest text-ink-muted transition hover:text-accent"
          >
            Réinitialiser
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Recherche par nom */}
        <div className="flex flex-col gap-2 lg:col-span-2">
          <label htmlFor="search" className={FIELD_LABEL}>
            Rechercher
          </label>

          <div className="relative">
            <SearchIcon
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              id="search"
              type="text"
              placeholder="Ex: contaminé"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className={`${INPUT} pl-10`}
            />
          </div>
        </div>

        {/* Catégorie */}
        <div className="flex flex-col gap-2">
          <label htmlFor="category" className={FIELD_LABEL}>
            Catégorie
          </label>

          <div className="relative">
            <select
              id="category"
              value={category}
              onChange={(event) => onCategoryChange(event.target.value)}
              className={SELECT}
            >
              <option value="">Toutes</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
            />
          </div>
        </div>

        {/* Intensité */}
        <div className="flex flex-col gap-2">
          <label htmlFor="intensity" className={FIELD_LABEL}>
            Intensité
          </label>

          <div className="relative">
            <select
              id="intensity"
              value={intensity}
              onChange={(event) => onIntensityChange(event.target.value)}
              className={SELECT}
            >
              <option value="">Toutes</option>

              {intensities.map((item) => (
                <option key={item} value={item}>
                  {INTENSITY_LABELS[item] || item}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {/* Prix minimum */}
        <div className="flex flex-col gap-2">
          <label htmlFor="min-price" className={FIELD_LABEL}>
            Prix minimum
          </label>

          <div className="relative">
            <input
              id="min-price"
              type="number"
              min="0"
              placeholder="0"
              value={minPrice}
              onChange={(event) => onMinPriceChange(event.target.value)}
              className={`${INPUT} pr-9`}
            />
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-muted">
              €
            </span>
          </div>
        </div>

        {/* Prix maximum */}
        <div className="flex flex-col gap-2">
          <label htmlFor="max-price" className={FIELD_LABEL}>
            Prix maximum
          </label>

          <div className="relative">
            <input
              id="max-price"
              type="number"
              min="0"
              placeholder="100"
              value={maxPrice}
              onChange={(event) => onMaxPriceChange(event.target.value)}
              className={`${INPUT} pr-9`}
            />
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-muted">
              €
            </span>
          </div>
        </div>
      </div>

      {/* Durée */}
      <div className="mt-6 border-t border-dashed border-line pt-6">
        <p className={FIELD_LABEL}>Durée</p>

        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <RangeField
            label="Minimum"
            value={Number(minDuration || durationLimits.min)}
            limits={durationLimits}
            onChange={onMinDurationChange}
          />

          <RangeField
            label="Maximum"
            value={Number(maxDuration || durationLimits.max)}
            limits={durationLimits}
            onChange={onMaxDurationChange}
          />
        </div>
      </div>
    </section>
  );
}

export default ExperienceFilters;
