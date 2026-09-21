# Projet Nightfall

## Présentation
**Nightfall** est un parc à thème fictif immersif proposant des expériences de survie, de science-fiction et de catastrophe. Les visiteurs ne se contentent pas de monter dans des attractions : ils y participent. Des laboratoires contaminés aux invasions extraterrestres, chaque activité possède son propre univers, son niveau de difficulté et ses caractéristiques.

Cette application web permet aux visiteurs de :
- Découvrir et parcourir les expériences
- Filtrer et rechercher des activités
- Réserver des billets
- Gérer leurs réservations
- Permettre aux administrateurs du parc de gérer le contenu

## Membres de l'équipe
- Haitu
- Clement
- Thomas

## Fonctionnalités
### Catalogue d'expériences
Les visiteurs peuvent parcourir toutes les expériences proposées par Nightfall. Chaque expérience comprend :
- Nom
- Description
- Image
- Catégorie (ex. : Survie, Horreur, Escape Game, Science-fiction, Action)
- Durée
- Niveau d'intensité
- Nombre maximum de participants
- Prix

### Recherche et filtres
Les utilisateurs peuvent :
- Rechercher des expériences par nom
- Filtrer par catégorie
- TODO : Préciser les filtres supplémentaires (ex. : intensité, prix, durée).

### Page de détails d'une expérience
Chaque expérience dispose d'une page dédiée affichant :
- Nom
- Description
- Prix
- Catégorie
- Durée
- Niveau d'intensité
- TODO : Ajouter d'éventuels détails supplémentaires (ex. : images, avis).

Les utilisateurs connectés peuvent démarrer une réservation depuis cette page.

### Visiteur
Un visiteur peut :
- Découvrir le parc et ses expériences
- Parcourir les activités disponibles
- Rechercher et filtrer les expériences par nom et par catégorie

### Membre
Un utilisateur inscrit peut :
- Créer un compte et se connecter
- Parcourir les expériences
- Réserver une expérience (avec validation côté backend de :
  - L'existence de l'expérience
  - Une date/heure future
  - Un nombre de participants valide
  - Les limites de capacité)
- Consulter ses réservations
- Annuler une réservation (uniquement plus de 48 heures avant l'horaire prévu)

### Administrateur
Un administrateur peut :
- Ajouter, modifier ou supprimer/archiver des expériences
- Consulter toutes les réservations
- Gérer le contenu du parc (accès réservé aux administrateurs)

TODO : Clarifier les règles d'archivage et de suppression pour les expériences liées à des réservations.

## Prérequis
TODO : Lister les prérequis (ex. : Node.js, Docker, outils en ligne de commande de la base de données).

## Technologies

### Frontend
- **React** (JavaScript, HTML, CSS)

### Backend
- **Node.js** avec **Express** (API REST)

### Base de données
TODO : Préciser la technologie de base de données choisie (ex. : MySQL, PostgreSQL, MongoDB).

### DevOps
- **Docker** pour la conteneurisation
- **Git** et **GitHub** pour le contrôle de version

### Gestion de projet
TODO : Préciser l'outil utilisé pour le suivi des tâches (ex. : GitHub Projects, Trello, Notion).

## Démarrage
TODO : Ajouter les instructions d'installation pour :
- Docker Compose
- Le développement en local (frontend et backend)
- Les variables d'environnement (modèle de .env)

### Avec Docker Compose
TODO : Ajouter les instructions Docker Compose.

### Développement en local
#### Frontend
TODO : Ajouter les instructions d'installation du frontend.

#### Backend
TODO : Ajouter les instructions d'installation du backend.
## Comptes de démonstration
TODO : Ajouter les comptes de démonstration pour :
- Visiteur (aucune connexion requise)
- Membre (identifiants de connexion)
- Administrateur (identifiants de connexion)
- [Architecture](#architecture)
## Modèle de données
### Expériences
- Nom
- Description
- Image
- Catégorie (ex. : Survie, Horreur, Escape Game, Science-fiction, Action)
- Durée
- Niveau d'intensité
- Nombre maximum de participants
- Prix

### Utilisateurs
- E-mail
- Mot de passe haché
- Rôle (visiteur/membre/administrateur)

### Réservations
- Expérience (référence)
- Date et heure
- Nombre de participants
- Utilisateur (référence)

TODO : Préciser les relations entre les entités (ex. : un-à-plusieurs, plusieurs-à-plusieurs).
TODO : Ajouter d'éventuels champs ou contraintes supplémentaires.
## Routes de l'API
TODO : Lister tous les endpoints de l'API avec leurs méthodes, paramètres et réponses.

Exemples de routes :
- `GET /api/experiences` - Récupérer toutes les expériences
- `GET /api/experiences/:id` - Récupérer une expérience précise
- `POST /api/experiences` - Créer une expérience (admin uniquement)
- `PUT /api/experiences/:id` - Modifier une expérience (admin uniquement)
- `DELETE /api/experiences/:id` - Supprimer/archiver une expérience (admin uniquement)
- `POST /api/auth/register` - Inscrire un nouvel utilisateur
- `POST /api/auth/login` - Connecter un utilisateur
- `GET /api/bookings` - Récupérer les réservations de l'utilisateur
- `POST /api/bookings` - Créer une réservation
- `DELETE /api/bookings/:id` - Annuler une réservation
## Sécurité
- Les mots de passe sont hachés et jamais stockés en clair
- Validation côté backend de toutes les saisies utilisateur
- Les routes et fonctionnalités d'administration sont protégées
- Les utilisateurs ne peuvent pas s'attribuer eux-mêmes le rôle d'administrateur
- Aucune donnée sensible (clés d'API, tokens) n'est versionnée dans le dépôt
- Le fichier `.env` est inclus dans `.gitignore`
- TODO : Préciser les mesures de sécurité supplémentaires (ex. : limitation de débit, CORS, protection CSRF).
## Organisation du projet
- **4 jours** de développement, **1 jour** pour la présentation et l'évaluation
- Travail réparti entre 3 membres de l'équipe (frontend, backend, base de données/DevOps)
- Fonctionnalités MVP par ordre de priorité :
  1. Catalogue d'expériences
  2. Recherche et filtres
  3. Page de détails d'une expérience
  4. Système de réservation
  5. Gestion des comptes utilisateurs
  6. Tableau de bord personnel
  7. Politique d'annulation
  8. Interface d'administration

TODO : Ajouter un lien vers l'outil de gestion de projet (ex. : GitHub Projects, Trello, Notion).
TODO : Définir les conventions de nommage des branches et le workflow Git.
## Captures d'écran
TODO : Ajouter des captures d'écran de l'application (ex. : page d'accueil, détails d'une expérience, parcours de réservation, tableau de bord admin).

## Design responsive
L'application est conçue pour fonctionner sur :
- Ordinateur
- Smartphone

TODO : Préciser les points de rupture ou les frameworks utilisés (ex. : CSS Grid, Flexbox, Bootstrap).