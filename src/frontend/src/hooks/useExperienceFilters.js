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
      params.set('max_intensity_level', debouncedFilters.intensity);
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

  return {
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
    hasFilters
  };
}

export default useExperienceFilters;
