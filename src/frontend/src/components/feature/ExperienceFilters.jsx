import React from 'react';
import { INTENSITY_LABELS } from '../../lib/intensity';
import { ChevronDownIcon, SearchIcon } from '../ui/icons';
import RangeSlider from './RangeSlider';

const FIELD_LABEL = 'text-xs font-semibold uppercase tracking-[0.15em] text-ink-muted';

const INPUT =
  'input input-bordered w-full border-line bg-canvas text-base text-ink placeholder:text-ink-muted/50 focus:border-highlight focus:outline-none focus:ring-2 focus:ring-highlight/40';

const SELECT =
  'select select-bordered w-full border-line bg-canvas text-base text-ink focus:border-highlight focus:outline-none focus:ring-2 focus:ring-highlight/40 appearance-none pr-10';

function ExperienceFilters({
  search,
  onSearchChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  priceLimits,
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
    <section aria-label="Filtres des expériences" className="experience-filters">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-highlight">
            À vous de choisir
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
            Trouvez votre expérience
          </h2>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="btn btn-ghost btn-sm text-xs font-semibold uppercase tracking-widest text-ink-muted hover:bg-transparent hover:text-accent"
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
              placeholder="Quel sera votre prochain cauchemar ?"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className={`${INPUT} pl-10`}
            />
          </div>
        </div>

        {/* Catégorie */}
        <div className="flex flex-col gap-2">
          <label htmlFor="category" className={FIELD_LABEL}>
            Univers
          </label>

          <div className="relative">
            <select
              id="category"
              value={category}
              onChange={(event) => onCategoryChange(event.target.value)}
              className={SELECT}
            >
              <option value="">Tous les univers</option>

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
            Intensité maximum
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

      <details className="advanced-filters">
      <summary>Budget & durée <span aria-hidden="true">+</span></summary>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
      <div className="rounded-xl border border-line bg-canvas/40 p-4">
        <p className={FIELD_LABEL}>Prix</p>

        <RangeSlider
          minValue={minPrice}
          onMinChange={onMinPriceChange}
          maxValue={maxPrice}
          onMaxChange={onMaxPriceChange}
          limits={priceLimits}
          unit="€"
          minLabel="Prix minimum"
          maxLabel="Prix maximum"
        />

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
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
      </div>

      {/* Durée */}
      <div className="rounded-xl border border-line bg-canvas/40 p-4">
        <p className={FIELD_LABEL}>Durée</p>

        <RangeSlider
          minValue={minDuration}
          onMinChange={onMinDurationChange}
          maxValue={maxDuration}
          onMaxChange={onMaxDurationChange}
          limits={durationLimits}
          unit="min"
          minLabel="Durée minimum"
          maxLabel="Durée maximum"
        />
      </div>
      </div>
      </details>
    </section>
  );
}

export default ExperienceFilters;
