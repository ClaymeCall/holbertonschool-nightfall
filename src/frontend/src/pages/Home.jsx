import React, { useMemo, useState } from 'react';
import Hero from '../components/feature/Hero';
import ExperiencesList from '../components/feature/ExperiencesList';
import useApiResource from '../hooks/useApiResource';

function Home() {
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  const [intensity, setIntensity] = useState('');

  /*
   * Récupération du catalogue complet.
   * Sert notamment à construire les listes catégorie / intensité
   * et connaître les durées disponibles.
   */
  const { data: allExperiences } = useApiResource('/experiences');

  /*
   * Durée minimum et maximum présentes dans le catalogue.
   */
  const durationLimits = useMemo(() => {
    if (!allExperiences || allExperiences.length === 0) {
      return {
        min: 0,
        max: 180
      };
    }

    const durations = allExperiences.map(
      (experience) => experience.duration
    );

    return {
      min: Math.min(...durations),
      max: Math.max(...durations)
    };
  }, [allExperiences]);

  const [minDuration, setMinDuration] = useState('');
  const [maxDuration, setMaxDuration] = useState('');

  /*
   * Catégories uniques présentes dans les expériences.
   */
  const categories = useMemo(() => {
    if (!allExperiences) {
      return [];
    }

    return [
      ...new Set(
        allExperiences.map(
          (experience) => experience.category
        )
      )
    ];
  }, [allExperiences]);

  /*
   * Intensités uniques présentes dans les expériences.
   */
  const intensities = useMemo(() => {
    if (!allExperiences) {
      return [];
    }

    return [
      ...new Set(
        allExperiences.map(
          (experience) => experience.intensity_level
        )
      )
    ];
  }, [allExperiences]);

  /*
   * Construction des query params envoyés au backend.
   */
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set('search', search.trim());
  }

  if (minPrice !== '') {
    params.set('min_price', minPrice);
  }

  if (maxPrice !== '') {
    params.set('max_price', maxPrice);
  }

  if (category) {
    params.set('category', category);
  }

  if (minDuration !== '') {
    params.set('min_duration', minDuration);
  }

  if (maxDuration !== '') {
    params.set('max_duration', maxDuration);
  }

  if (intensity) {
    params.set('intensity_level', intensity);
  }

  const query = params.toString();

  const path = query
    ? `/experiences?${query}`
    : '/experiences';

  /*
   * Les expériences affichées sont celles renvoyées
   * par le backend avec les filtres.
   */
  const {
    data: experiences,
    loading,
    error
  } = useApiResource(path);

  const hasFilters =
    search.trim() !== '' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    category !== '' ||
    minDuration !== '' ||
    maxDuration !== '' ||
    intensity !== '';

  return (
    <div className="min-h-screen bg-deep-black">
      <Hero />

      <main
        id="experiences"
        className="mx-auto max-w-6xl px-6 py-10"
      >
        <h1 className="mb-6 text-3xl font-bold text-white">
          Expériences
        </h1>

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
                  setSearch(event.target.value)
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
                  setMinPrice(event.target.value)
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
                  setMaxPrice(event.target.value)
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
                  setCategory(event.target.value)
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
                  setIntensity(event.target.value)
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
                    setMinDuration(event.target.value)
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
                    setMaxDuration(event.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {loading && (
          <p className="text-sm text-gray-400">
            Chargement des expériences…
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="text-sm text-red-400"
          >
            Impossible de charger les expériences : {error.message}
          </p>
        )}

        {experiences && (
          <ExperiencesList
            experiences={experiences}
            hasFilters={hasFilters}
          />
        )}
      </main>
    </div>
  );
}

export default Home;