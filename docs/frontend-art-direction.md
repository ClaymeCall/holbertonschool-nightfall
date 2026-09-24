# Nightfall — Direction visuelle

Le frontend conserve React, React Router, Tailwind/DaisyUI, les composants
`common`, `feature`, `ui`, les hooks et les endpoints existants.

- Accueil : portes de parc gothique, brume et citrouilles ; palette bleu nuit
  et logo « Éclipse griffée » bleu conservé, y compris pendant les survols.
- Typographie : [Metal Mania](https://fonts.google.com/specimen/Metal+Mania)
  pour les titres, [Special Elite](https://fonts.google.com/specimen/Special+Elite)
  pour les textes et Manrope pour les contrôles et les petites informations.
- Catalogue : affiches photographiques, intensité, durée et prix issus de l’API.
- Fiches : thème global via `SiteThemeContext`; textes d’ambiance dans
  `src/frontend/src/lib/themes.js`. Les descriptions de l’API restent affichées.
  Les six textes du catalogue d’origine sont regroupés dans
  `src/backend/src/content/experienceDescriptions.json` et utilisés par le seed.
- Laboratoire : vert toxique et trame de moniteur. Bunker : tons militaires et
  transmission. Asile : bleu spectral. Invasion : violet et signaux.
  Zone radioactive : orange et bande de danger. Forêt : vert sombre.
- Filtres : état et requêtes dans `useExperienceFilters`, présentation dans
  `ExperienceFilters`, doubles curseurs dans `RangeSlider`.
- Styles immersifs : `src/frontend/src/styles/immersive.css`.
- Animations désactivées avec `prefers-reduced-motion`.
- Contraste : texte clair explicitement défini sur les wrappers `data-theme`
  pour éviter le texte noir hérité de DaisyUI. Les boutons principaux utilisent
  un fond `--color-action` distinct de l’accent décoratif, avec un texte blanc.
  Login, inscription et réservation utilisent le même composant `Button`.

## Mettre à jour les descriptions existantes

Depuis `src/backend`, lancer `node src/utils/updateExperienceDescriptions.js`.
Le script ne remplace que les anciennes descriptions exactes du catalogue
d’origine et conserve les modifications administrateur. Il ne modifie ni
les prix, ni les dates, ni les réservations, ni l’archivage. Il est réexécutable.
L’option `--revert` restaure les anciennes descriptions uniquement si les
nouveaux textes n’ont pas été modifiés depuis.

## Visuel généré

Outil : ImageGen intégré (pas de CLI/API externe).
Fichier final : `src/frontend/public/images/nightfall-gates.jpg`.
Original généré converti en JPEG qualité 83 pour le web. Les images des
expériences proviennent des ressources déjà présentes dans le backend.

Prompt exact :

> Use case: stylized-concept. Asset type: cinematic full-bleed website background for Nightfall, an immersive horror theme park. Create one wide 16:9 cinematic photorealistic environment artwork: an imposing gothic abandoned amusement park entrance with wrought iron open gates, a haunted Victorian manor silhouette and distant ferris wheel, twisted bare trees, small glowing jack-o-lanterns along the wet cobblestone entrance, faint amber lanterns and silver-blue moonlit ground fog. Elegant mature Halloween horror, unsettling and believable, high-end film production design, fine film grain. Architectural details concentrated in right two thirds; left third dark mist and trees with clear negative space for large white website heading. Deep near-black charcoal and muted midnight blue, restrained burnt orange lights, layered depth, large pale moon obscured by thin clouds. No text, no letters, no logo, no watermark, no collage, no people, no gore. Output a landscape image suitable for a 1920px website hero.

## Vérifications

Compilation de production avec `npm run build` dans `src/frontend`.
Contrôle de rendu React : accueil, FAQ, six affiches, liens, intensités,
replis de thèmes et quatre curseurs de filtre. Aucun nouveau framework ajouté.
Les essais HTTP utilisent les services Docker existants, sans reseed ni
modification des réservations. La validation visuelle dans un navigateur
reste à réaliser : aucun navigateur connecté n’était disponible.
