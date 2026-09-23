# Conventions front-end

## Couleurs : des rôles, pas des teintes

Les couleurs sont des variables CSS (`src/frontend/src/index.css`) exposées à
Tailwind par rôle (`src/frontend/tailwind.config.js`). Un thème est simplement un
autre jeu de ces variables.

| Classe Tailwind | Rôle |
|---|---|
| `bg-canvas` | fond de page |
| `bg-surface` | cartes, panneaux, champs |
| `border-line` | bordures |
| `text-ink` / `text-ink-muted` | texte principal / secondaire |
| `bg-accent` + `text-accent-fg` | boutons et remplissages |
| `text-highlight` | liens et petits textes colorés |

Règles :
- Ne pas écrire de couleur en dur (`#0a0a0a`, `bg-red-500`) dans une page :
  utiliser un rôle, sinon la page ne suivra pas un changement de thème.
- Petit texte coloré : `text-highlight`, pas `text-accent` (contraste insuffisant).
  Le texte ne descend jamais sous `text-ink-muted` (pas de `text-gray-500`).
- Les anciens noms `night-mauve`, `blood-red` et `deep-black` restent valides
  pour les pages pas encore migrées, mais ne doivent plus être utilisés dans du
  nouveau code.

## Composants de base (`src/frontend/src/components/ui/`)

- `Button` : `variant` (`primary`, `secondary`, `ghost`), `size` (`sm`, `md`,
  `lg`), `as={Link}` pour un lien qui a l'apparence d'un bouton.
- `Badge` : étiquette de catégorie.
- `Alert` : message d'erreur (`role="alert"`), de succès ou d'information
  (`role="status"`). N'affiche rien si le message est vide.

Mise en forme des données partagée : `src/frontend/src/lib/format.js`
(`formatPrice`, `experienceImageUrl`).

## Accessibilité

- Le focus clavier est visible partout (`:focus-visible` dans `index.css`).
- Chaque champ a un `<label>`. Les erreurs passent par `Alert`.
- Langue du document : `fr`.

## Ajouter un thème

Redéfinir les huit variables `--color-*` sous un sélecteur
`[data-theme='nom']` dans `index.css`, puis poser `data-theme="nom"` sur le
conteneur concerné. Aucun composant à modifier.
