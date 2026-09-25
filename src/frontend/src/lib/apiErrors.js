// The API answers in English (a few auth routes already answer in French). The
// interface is French, so known messages are translated here, once, and every
// caller of apiRequest gets a French `error.message`. A message that is not
// listed is kept as is: that is what lets the French auth messages through.
const MESSAGES = {
  Unauthorized: 'Vous devez être connecté pour faire cela.',
  Forbidden: "Vous n'avez pas le droit d'effectuer cette action.",
  'Internal server error': 'Erreur du serveur. Réessayez dans un instant.',
  'Not implemented': "Cette fonctionnalité n'est pas encore disponible.",

  'Experience not found': 'Expérience introuvable.',
  'Reservation not found': 'Réservation introuvable.',
  'User not found': 'Utilisateur introuvable.',
  'id must be a positive integer': 'Identifiant invalide.',

  'Cannot delete an experience with existing reservations':
    'Impossible de supprimer une expérience qui a des réservations.',
  'Cannot delete a user with existing reservations':
    'Impossible de supprimer un utilisateur qui a des réservations.',
  'Cancellation not allowed less than 48 hours before the reservation':
    "L'annulation n'est plus possible moins de 48 heures avant l'expérience.",

  'date must be a valid ISO 8601 date-time': "La date n'est pas valide.",
  'date must be in the future': 'La date doit être dans le futur.',
  'experience_id must be a positive integer': "L'expérience choisie n'est pas valide.",
  'participants must be a positive integer': 'Le nombre de participants doit être un entier positif.',

  'A valid email is required': 'Une adresse email valide est requise.',
  'Email already exists': 'Cet email est déjà utilisé.',
  'is_admin must be a boolean': 'Le rôle administrateur doit être vrai ou faux.',

  'q must be a non-empty string': 'La recherche ne peut pas être vide.',
  'category must be a non-empty string': 'La catégorie ne peut pas être vide.',
  'min_price must be a non-negative number': 'Le prix minimum doit être un nombre positif ou nul.',
  'max_price must be a non-negative number': 'Le prix maximum doit être un nombre positif ou nul.',
  'min_price must not be greater than max_price': 'Le prix minimum ne peut pas dépasser le prix maximum.',
  'min_duration must be a positive integer': 'La durée minimum doit être un entier positif.',
  'max_duration must be a positive integer': 'La durée maximum doit être un entier positif.',
  'min_duration must not be greater than max_duration':
    'La durée minimum ne peut pas dépasser la durée maximum.',
};

// Messages that embed a value from the server.
const PATTERNS = [
  [
    /^participants cannot exceed (\d+) for this experience$/,
    (match) => `Cette expérience accepte ${match[1]} participants au maximum.`,
  ],
  [
    /^Password must be at least (\d+) characters long$/,
    (match) => `Le mot de passe doit contenir au moins ${match[1]} caractères.`,
  ],
  [
    /^intensity_level must be an integer between (\d+) and (\d+)$/,
    (match) => `L'intensité doit être un entier entre ${match[1]} et ${match[2]}.`,
  ],
];

// Used when the server sent no message at all.
function messageForStatus(status) {
  if (status === 401) return 'Vous devez être connecté pour faire cela.';
  if (status === 403) return "Vous n'avez pas le droit d'effectuer cette action.";
  if (status === 404) return 'Élément introuvable.';
  if (status >= 500) return 'Erreur du serveur. Réessayez dans un instant.';
  return `La requête a échoué (code ${status}).`;
}

export const NETWORK_ERROR_MESSAGE = 'Impossible de contacter le serveur.';

export function translateApiError(message, status) {
  if (!message) {
    return messageForStatus(status);
  }

  if (Object.hasOwn(MESSAGES, message)) {
    return MESSAGES[message];
  }

  for (const [pattern, build] of PATTERNS) {
    const match = message.match(pattern);
    if (match) {
      return build(match);
    }
  }

  return message;
}
