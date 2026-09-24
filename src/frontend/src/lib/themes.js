// The database has no theme column, so an experience's ambiance is derived from
// its image first (most specific), then from its category. Unknown values
// return undefined, which leaves the default theme.
const THEME_BY_IMAGE = {
  'laboratoire-contamine.jpg': 'laboratoire',
  'invasion-extraterrestre.jpg': 'paranormal',
  'bunker-abandonne.jpg': 'bunker',
  'asile-abandonne.jpg': 'asile',
  'zone-radioactive.jpg': 'radioactif',
};

const THEME_BY_CATEGORY = {
  horreur: 'horreur',
  survie: 'bunker',
  'science-fiction': 'laboratoire',
  action: 'radioactif',
  'escape game': 'paranormal',
};

export function themeForExperience({ image, category } = {}) {
  return THEME_BY_IMAGE[image] ?? THEME_BY_CATEGORY[category?.trim().toLowerCase()];
}
