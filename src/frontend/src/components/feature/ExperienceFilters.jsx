import React from 'react';

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
  durationLimits
}) {
  return (
    <section className="mb-8 rounded-xl border border-gray-700 bg-gray-900 p-6">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

        {/* Recherche par nom */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="search"
            className="text-sm font-medium text-white"
          >
            Rechercher
          </label>

          <input
            id="search"
            type="text"
            placeholder="Ex: contaminé"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            className="rounded-md border border-gray-500 bg-white px-3 py-2 text-gray-900"
          />
        </div>

        {/* Prix minimum */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="min-price"
            className="text-sm font-medium text-white"
          >
            Prix minimum
          </label>

          <input
            id="min-price"
            type="number"
            min="0"
            placeholder="0 €"
            value={minPrice}
            onChange={(event) =>
              onMinPriceChange(event.target.value)
            }
            className="rounded-md border border-gray-500 bg-white px-3 py-2 text-gray-900"
          />
        </div>

        {/* Prix maximum */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="max-price"
            className="text-sm font-medium text-white"
          >
            Prix maximum
          </label>

          <input
            id="max-price"
            type="number"
            min="0"
            placeholder="100 €"
            value={maxPrice}
            onChange={(event) =>
              onMaxPriceChange(event.target.value)
            }
            className="rounded-md border border-gray-500 bg-white px-3 py-2 text-gray-900"
          />
        </div>

        {/* Catégorie */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="category"
            className="text-sm font-medium text-white"
          >
            Catégorie
          </label>

          <select
            id="category"
            value={category}
            onChange={(event) =>
              onCategoryChange(event.target.value)
            }
            className="rounded-md border border-gray-500 bg-white px-3 py-2 text-gray-900"
          >
            <option value="">
              Toutes les catégories
            </option>

            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Intensité */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="intensity"
            className="text-sm font-medium text-white"
          >
            Intensité
          </label>

          <select
            id="intensity"
            value={intensity}
            onChange={(event) =>
              onIntensityChange(event.target.value)
            }
            className="rounded-md border border-gray-500 bg-white px-3 py-2 text-gray-900"
          >
            <option value="">
              Toutes les intensités
            </option>

            {intensities.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Durée */}
      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-white">
          Durée
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-gray-300">
              Minimum : {minDuration || durationLimits.min} min
            </label>

            <input
              type="range"
              min={durationLimits.min}
              max={durationLimits.max}
              value={minDuration || durationLimits.min}
              onChange={(event) =>
                onMinDurationChange(event.target.value)
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">
              Maximum : {maxDuration || durationLimits.max} min
            </label>

            <input
              type="range"
              min={durationLimits.min}
              max={durationLimits.max}
              value={maxDuration || durationLimits.max}
              onChange={(event) =>
                onMaxDurationChange(event.target.value)
              }
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExperienceFilters;
