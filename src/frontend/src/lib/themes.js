// The database has no theme column, so an experience's ambiance is derived from
// its image first (most specific), then from its category. Unknown values
// return undefined, which leaves the default theme.
const THEME_BY_IMAGE = {
  'laboratoire-contamine.jpg': 'laboratoire',
  'invasion-extraterrestre.jpg': 'paranormal',
  'bunker-abandonne.jpg': 'bunker',
  'asile-abandonne.jpg': 'asile',
  'zone-radioactive.jpg': 'radioactif',
  'foret-maudite.jpg': 'foret',
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

// Editorial atmosphere belongs to the presentation layer; booking data stays in the API.
const AMBIANCES = {
  laboratoire: { code: 'BIO–01', label: 'Alerte biologique', tagline: 'Le protocole a échoué.', mission: 'Trouvez l’antidote. Contenez la menace.', atmosphere: 'Néons froids, vapeurs toxiques et expériences interdites. Ici, la peur se propage plus vite que le virus.' },
  bunker: { code: 'SEC–02', label: 'Transmission perdue', tagline: 'Personne ne répondra.', mission: 'Percez les secrets enfouis sous terre.', atmosphere: 'Béton brut, portes blindées et silence pesant. Chaque couloir vous éloigne un peu plus de la surface.' },
  asile: { code: 'PSY–03', label: 'Présence détectée', tagline: 'Vous n’êtes pas seuls.', mission: 'Découvrez la vérité. Échappez aux présences.', atmosphere: 'Des couloirs désertés, des portes entrouvertes, des échos impossibles. Les murs ont gardé bien plus que des souvenirs.' },
  paranormal: { code: 'XENO–04', label: 'Contact inconnu', tagline: 'Ils sont déjà là.', mission: 'Traquez l’inconnu avant qu’il ne vous trouve.', atmosphere: 'Des signaux dans le noir. Une présence qui n’a rien d’humain. Tout ce que vous pensiez connaître s’arrête aux portes de la base.' },
  radioactif: { code: 'RAD–05', label: 'Périmètre interdit', tagline: 'Chaque seconde compte.', mission: 'Récupérez les données. Limitez votre exposition.', atmosphere: 'Une centrale évacuée, des alarmes lointaines et une menace invisible. Franchir le périmètre n’est que le début.' },
  foret: { code: 'WILD–06', label: 'Chemin disparu', tagline: 'La forêt vous observe.', mission: 'Retrouvez le chemin avant que la nuit vous engloutisse.', atmosphere: 'Des branches qui craquent, des ombres entre les arbres. Certaines légendes préfèrent rester dans l’obscurité.' },
  horreur: { code: 'NF–00', label: 'Au-delà du réel', tagline: 'Faites face à vos peurs.', mission: 'Entrez dans l’histoire.', atmosphere: 'Laissez vos certitudes à l’entrée. Une autre réalité vous attend de l’autre côté.' },
};

export function ambianceForExperience(experience) {
  return AMBIANCES[themeForExperience(experience)] ?? AMBIANCES.horreur;
}
