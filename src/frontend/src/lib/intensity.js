// The backend stores intensity_level as an integer from 1 to 5. This maps
// each value to the French word label shown throughout the UI.
export const INTENSITY_LABELS = {
  1: 'Faible',
  2: 'Modérée',
  3: 'Élevée',
  4: 'Très élevée',
  5: 'Extrême',
};

export const INTENSITY_OPTIONS = Object.entries(INTENSITY_LABELS).map(([value, label]) => ({
  value: Number(value),
  label,
}));

export function intensityLabel(level) {
  return INTENSITY_LABELS[level] || null;
}
