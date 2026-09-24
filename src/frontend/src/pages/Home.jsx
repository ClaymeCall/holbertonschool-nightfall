import React from 'react';
import Hero from '../components/feature/Hero';
import ParkConcept from '../components/feature/ParkConcept';
import ExperiencesList from '../components/feature/ExperiencesList';
import ExperienceFilters from '../components/feature/ExperienceFilters';
import useApiResource from '../hooks/useApiResource';
import useExperienceFilters from '../hooks/useExperienceFilters';
import Skeleton from '../components/ui/Skeleton';

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
    priceLimits,
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
    <main id="main-content" className="min-h-screen bg-canvas">
      <Hero />
      <div className="park-ribbon" aria-hidden="true"><span>Entrez dans l’inconnu</span><span>✦</span><span>Défiez vos peurs</span><span>✦</span><span>Vivez Nightfall</span><span>✦</span></div>
      <section
        id="experiences"
        aria-labelledby="experiences-title"
        className="site-container catalogue-section"
      >
        <div className="section-heading">
          <div><p className="eyebrow">Le catalogue des cauchemars</p><h2 id="experiences-title" className="section-title">À chaque porte,<br /><em>une autre peur.</em></h2></div>
          <p className="section-intro">Choisissez votre univers. Préparez votre équipe.<br />Nous nous occupons des frissons.</p>
        </div>

        <ExperienceFilters
          search={search}
          onSearchChange={setSearch}
          minPrice={minPrice}
          onMinPriceChange={setMinPrice}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          priceLimits={priceLimits}
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
          <div role="status" className="experiences-grid mt-6">
            <span className="sr-only">Chargement des expériences…</span>
            {[0, 1].map((item) => <Skeleton key={item} className="experience-card h-[475px]" />)}
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="text-sm text-red-400"
          >
            Impossible de charger les expériences : {error.message}
          </p>
        )}

        {!loading && !error && experiences && (
          <p className="catalogue-count" role="status">{experiences.length} expérience{experiences.length > 1 ? 's' : ''} à explorer <span>Osez le premier pas ↘</span></p>
        )}
        {!loading && !error && experiences && (
          <ExperiencesList
            experiences={experiences}
            hasFilters={hasFilters}
          />
        )}
      </section>
      <ParkConcept />
    </main>
  );
}

export default Home;
