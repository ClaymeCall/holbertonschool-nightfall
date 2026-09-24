import React from 'react';
import Hero from '../components/feature/Hero';
import ExperiencesList from '../components/feature/ExperiencesList';
import ExperienceFilters from '../components/feature/ExperienceFilters';
import useApiResource from '../hooks/useApiResource';
import useExperienceFilters from '../hooks/useExperienceFilters';

function Home() {
  /*
   * Récupération du catalogue complet.
   * Sert notamment à construire les listes catégorie / intensité
   * et connaître les durées disponibles.
   */
  const { data: allExperiences } = useApiResource('/experiences');

  const {
    search,
    setSearch,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    category,
    setCategory,
    intensity,
    setIntensity,
    minDuration,
    setMinDuration,
    maxDuration,
    setMaxDuration,
    categories,
    intensities,
    durationLimits,
    path,
    hasFilters,
    resetFilters
  } = useExperienceFilters(allExperiences);

  /*
   * Les expériences affichées sont celles renvoyées
   * par le backend avec les filtres.
   */
  const {
    data: experiences,
    loading,
    error
  } = useApiResource(path);

  return (
    <div className="min-h-screen bg-canvas">
      <Hero />

      <main
        id="experiences"
        className="mx-auto max-w-6xl px-6 py-10"
      >
        <h1 className="mb-6 font-display text-4xl font-semibold text-ink">
          Expériences
        </h1>

        <ExperienceFilters
          search={search}
          onSearchChange={setSearch}
          minPrice={minPrice}
          onMinPriceChange={setMinPrice}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
          intensity={intensity}
          onIntensityChange={setIntensity}
          intensities={intensities}
          minDuration={minDuration}
          onMinDurationChange={setMinDuration}
          maxDuration={maxDuration}
          onMaxDurationChange={setMaxDuration}
          durationLimits={durationLimits}
          hasFilters={hasFilters}
          onReset={resetFilters}
        />

        {loading && (
          <p className="text-sm text-ink-muted">
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
