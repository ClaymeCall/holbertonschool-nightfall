import { useMemo, useState } from 'react';
import useDebouncedValue from './useDebouncedValue';

const DEBOUNCE_DELAY_MS = 400;

/**
 * Owns every experience filter's state and derives the API query built from
 * them. Filter values feeding the query are debounced so that typing or
 * dragging a slider doesn't fire a request per keystroke/step.
 */
function useExperienceFilters(allExperiences) {
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  const [intensity, setIntensity] = useState('');
  const [minDuration, setMinDuration] = useState('');
  const [maxDuration, setMaxDuration] = useState('');

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

  const priceLimits = useMemo(() => {
    if (!allExperiences || allExperiences.length === 0) {
      return {
        min: 0,
        max: 1000
      };
    }

    const prices = allExperiences.map((experience) => Number(experience.price));

    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [allExperiences]);

  /*
   * Catégories uniques présentes dans les expériences, triées par ordre
   * alphabétique pour un menu stable.
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
    ].sort((a, b) => a.localeCompare(b, 'fr'));
  }, [allExperiences]);

  /*
   * Niveaux d'intensité uniques présentes dans les expériences, triés du
   * plus faible au plus fort.
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
    ].sort((a, b) => a - b);
  }, [allExperiences]);

  function updateMinDuration(value) {
    const currentMax = maxDuration === ''
      ? durationLimits.max
      : Number(maxDuration);

    setMinDuration(String(Math.min(Number(value), currentMax)));
  }

  function updateMinPrice(value) {
    if (value === '') {
      setMinPrice('');
      return;
    }

    const currentMax = maxPrice === '' ? priceLimits.max : Number(maxPrice);
    const nextValue = Math.max(priceLimits.min, Number(value));

    setMinPrice(String(Math.min(nextValue, currentMax)));
  }

  function updateMaxPrice(value) {
    if (value === '') {
      setMaxPrice('');
      return;
    }

    const currentMin = minPrice === '' ? priceLimits.min : Number(minPrice);
    const nextValue = Math.min(priceLimits.max, Number(value));

    setMaxPrice(String(Math.max(nextValue, currentMin)));
  }

  function updateMaxDuration(value) {
    const currentMin = minDuration === ''
      ? durationLimits.min
      : Number(minDuration);

    setMaxDuration(String(Math.max(Number(value), currentMin)));
  }

  const debouncedFilters = useDebouncedValue(
    { search, minPrice, maxPrice, category, intensity, minDuration, maxDuration },
    DEBOUNCE_DELAY_MS
  );

  /*
   * Construction des query params envoyés au backend, à partir des valeurs
   * debouncées.
   */
  const path = useMemo(() => {
    const params = new URLSearchParams();

    if (debouncedFilters.search.trim()) {
      params.set('q', debouncedFilters.search.trim());
    }

    if (debouncedFilters.minPrice !== '') {
      params.set('min_price', debouncedFilters.minPrice);
    }

    if (debouncedFilters.maxPrice !== '') {
      params.set('max_price', debouncedFilters.maxPrice);
    }

    if (debouncedFilters.category) {
      params.set('category', debouncedFilters.category);
    }

    if (debouncedFilters.minDuration !== '') {
      params.set('min_duration', debouncedFilters.minDuration);
    }

    if (debouncedFilters.maxDuration !== '') {
      params.set('max_duration', debouncedFilters.maxDuration);
    }

    if (debouncedFilters.intensity) {
      params.set('intensity_level', debouncedFilters.intensity);
    }

    const query = params.toString();

    return query ? `/experiences/search?${query}` : '/experiences';
  }, [debouncedFilters]);

  const hasFilters =
    debouncedFilters.search.trim() !== '' ||
    debouncedFilters.minPrice !== '' ||
    debouncedFilters.maxPrice !== '' ||
    debouncedFilters.category !== '' ||
    debouncedFilters.minDuration !== '' ||
    debouncedFilters.maxDuration !== '' ||
    debouncedFilters.intensity !== '';

  function resetFilters() {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setCategory('');
    setIntensity('');
    setMinDuration('');
    setMaxDuration('');
  }

  return {
    search,
    setSearch,
    minPrice,
    setMinPrice: updateMinPrice,
    maxPrice,
    setMaxPrice: updateMaxPrice,
    category,
    setCategory,
    intensity,
    setIntensity,
    minDuration,
    setMinDuration: updateMinDuration,
    maxDuration,
    setMaxDuration: updateMaxDuration,
    categories,
    intensities,
    durationLimits,
    priceLimits,
    path,
    hasFilters,
    resetFilters
  };
}

export default useExperienceFilters;
