---
title: "NIGHTFALL — Documentation Mermaid"
project: NIGHTFALL
branch: main
commit: f10c7b89e095fcd728d6e842519c57d3df265153
tags:
  - nightfall
  - mermaid
  - architecture
  - database
  - api
---

# NIGHTFALL — Documentation Mermaid

> Documentation basée sur la branche `main` au commit `f10c7b8`.
> Les diagrammes correspondent au code et au schéma SQL actuellement présents dans le dépôt.

## 1. Architecture générale

```mermaid
flowchart LR
    User["Visiteur / membre / administrateur"] --> Browser["Navigateur"]
    Browser --> Front["Front-end React + Vite"]
    Front -->|"HTTP JSON / Bearer JWT"| API["API REST Node.js + Express"]
    API -->|"Requêtes SQL paramétrées"| DB["MySQL 8"]
    API --> Images["Images statiques /images"]
    DB --> Volume["Volume Docker mysql_data"]
    Seed["seed.js"] -->|"Schéma + données de démonstration"| DB
```

### Services Docker Compose

```mermaid
flowchart TB
    Compose["Docker Compose"] --> FrontC["frontend\nNode 18 + Vite\nport 5173"]
    Compose --> BackC["backend\nNode 18 + Express\nport 5080"]
    Compose --> DbC["database\nMySQL 8\nport 3306"]
    BackC -->|"depends_on: healthy"| DbC
    FrontC -->|"appels API"| BackC
    DbC --> Data["mysql_data"]
```

## 2. Structure applicative

```mermaid
flowchart TB
    App["App.jsx / React Router"] --> Public["Pages publiques\nHome, ExperienceDetails"]
    App --> Auth["Pages authentification\nLogin, Register"]
    App --> Member["Espace membre\n/dashboard via RequireAuth"]
    App --> Admin["Espace admin\n/admin via RequireAdmin"]
    Public --> Components["Catalogue, filtres, cartes, réservation"]
    Member --> ApiClient["API client + stockage JWT local"]
    Admin --> ApiClient
    ApiClient --> Express["API Express /api"]
    Express --> AuthMW["authenticate() / requireAdmin()"]
    AuthMW --> DB["MySQL"]
```

## 3. Modèle de données réel

> La table `categories` n’existe pas dans `src/database/init.sql` : la catégorie est stockée directement dans `experiences.category`.

```mermaid
erDiagram
    USERS ||--o{ SESSIONS : "ouvre"
    USERS ||--o{ RESERVATIONS : "effectue"
    EXPERIENCES ||--o{ RESERVATIONS : "concerne"

    USERS {
        int id PK
        varchar email UK
        varchar password_hash
        boolean is_admin
        timestamp created_at
    }

    SESSIONS {
        int id PK
        int user_id FK
        varchar token UK
        int max_age_hours
        timestamp created_at
    }

    EXPERIENCES {
        int id PK
        varchar name
        text description
        varchar image
        varchar category
        int duration
        tinyint intensity_level
        int max_participants
        decimal price
        boolean is_archived
        timestamp created_at
    }

    RESERVATIONS {
        int id PK
        int experience_id FK
        int user_id FK
        datetime date_time
        int participants
        timestamp created_at
    }
```

### Contraintes métier principales

```mermaid
flowchart TB
    Input["Données reçues"] --> Validate["Validation Express"]
    Validate -->|"expérience existante"| Capacity["participants <= max_participants"]
    Capacity -->|"date future"| Insert["INSERT reservations"]
    Validate -->|"erreur"| BadRequest["400 / 404"]
    Capacity -->|"règle non respectée"| BadRequest
    Insert --> Success["201 réservation confirmée"]

    Note["Note: aucune vérification\n de capacité cumulée\n sur un créneau n'est implémentée"] --- Validate
```

## 4. Parcours de réservation

```mermaid
sequenceDiagram
    actor M as Membre
    participant R as React
    participant A as API Express
    participant DB as MySQL

    M->>R: Remplit date et nombre de participants
    R->>A: POST /api/reservations + Bearer JWT
    A->>A: Vérifie le JWT et req.user.sub
    A->>A: Valide date, expérience et capacité
    A->>DB: INSERT reservations
    DB-->>A: insertId
    A-->>R: 201 réservation confirmée
    R-->>M: Notification de confirmation
```

## 5. Consultation et annulation

```mermaid
sequenceDiagram
    actor M as Membre
    participant R as React
    participant A as API Express
    participant DB as MySQL

    M->>R: Ouvre « Mon espace »
    R->>A: GET /api/reservations + Bearer JWT
    A->>DB: SELECT WHERE user_id = req.user.sub
    DB-->>A: Réservations du membre
    A-->>R: 200 liste des réservations
    R-->>M: Affiche les cartes de réservation

    M->>R: Demande une annulation
    R->>A: DELETE /api/reservations/:id
    A->>DB: Vérifie propriétaire et date_time
    alt Plus de 48 heures
        A->>DB: DELETE reservation
        A-->>R: 204
        R-->>M: Annulation confirmée
    else 48 heures ou moins
        A-->>R: 403
        R-->>M: Annulation refusée
    end
```

## 6. Authentification et autorisations

```mermaid
sequenceDiagram
    actor U as Utilisateur
    participant R as React
    participant A as API Express
    participant S as authServices
    participant DB as MySQL

    U->>R: Saisit email et mot de passe
    R->>A: POST /api/auth/login
    A->>S: login(req.db, { email, password })
    S->>DB: SELECT user par email
    S->>S: bcrypt.compare()
    alt mot de passe valide
        S->>S: jwt.sign({ sub, email, is_admin })
        S->>DB: INSERT INTO sessions (...) 
        S-->>A: { token, user }
        A-->>R: 200 JWT + user + is_admin
        R->>R: Stocke le token localement
    else invalide
        A-->>R: 401 Email ou mot de passe incorrect
    end

    R->>A: Requête privée avec Authorization: Bearer JWT
    A->>A: authenticate()
    A->>DB: SELECT sessions WHERE token = ?
    A->>A: jwt.verify()
    alt Route administrateur
        A->>A: requireAdmin()
    end
    A-->>R: Ressource autorisée ou 401/403
```

## 7. Catalogue et filtres

```mermaid
sequenceDiagram
    actor V as Visiteur
    participant R as React
    participant A as API Express
    participant DB as MySQL

    V->>R: Saisit une recherche ou un filtre
    R->>R: Debounce de la saisie
    R->>A: GET /api/experiences/search?q&category&price...
    A->>A: Construit les conditions avec paramètres SQL
    A->>DB: SELECT experiences WHERE ...
    DB-->>A: Expériences actives
    A-->>R: 200 tableau JSON
    R-->>V: Catalogue filtré
```

## 8. Administration du catalogue

```mermaid
flowchart LR
    Admin["Administrateur connecté"] --> AuthM["authenticate()"]
    AuthM --> Role["requireAdmin()"]
    Role --> CRUD["CRUD expériences"]
    CRUD --> Create["POST /experiences"]
    CRUD --> Update["PUT /experiences/:id"]
    CRUD --> Archive["PATCH /experiences/:id/toggle-archive"]
    CRUD --> Delete["DELETE /experiences/:id"]
    Delete --> Conflict["409 si réservation liée"]
    Role --> Users["GET /users : utilisateurs + réservations"]
```

## 9. Routes API essentielles

| Méthode | Route | Accès | Rôle |
|---|---|---|---|
| `GET` | `/api/experiences` | Public | Liste les expériences non archivées (sauf admin qui voit aussi les archivées) |
| `GET` | `/api/experiences/search` | Public | Recherche et filtres combinables |
| `GET` | `/api/experiences/:id` | Public | Détail d’une expérience, 404 si archivée et non admin |
| `POST` | `/api/auth/register` | Public | Crée un compte membre |
| `POST` | `/api/auth/login` | Public | Retourne un JWT et l’utilisateur |
| `POST` | `/api/auth/logout` | Authentifié | Supprime la session |
| `GET` | `/api/auth/me` | Authentifié | Non implémenté — `501 Not implemented` |
| `POST` | `/api/reservations` | Authentifié | Crée une réservation |
| `GET` | `/api/reservations` | Authentifié | Liste les réservations du membre |
| `DELETE` | `/api/reservations/:id` | Propriétaire | Annule si délai supérieur à 48 h |
| `POST` | `/api/experiences` | Admin | Ajoute une expérience |
| `PUT` | `/api/experiences/:id` | Admin | Modifie une expérience |
| `PATCH` | `/api/experiences/:id/toggle-archive` | Admin | Archive/désarchive |
| `DELETE` | `/api/experiences/:id` | Admin | Supprime si aucune réservation liée |
| `GET` | `/api/users` | Admin | Consulte les utilisateurs et réservations |
| `GET` | `/api/users/:id` | Admin | Non implémenté — `501 Not implemented` |
| `PUT` | `/api/users/:id` | Admin | Non implémenté — `501 Not implemented` |

## 10. Initialisation des données de démonstration

```mermaid
sequenceDiagram
    participant C as Docker Compose
    participant DB as MySQL
    participant Seed as seed.js
    participant API as Express

    C->>DB: Démarre MySQL et init.sql
    DB-->>C: Healthcheck OK
    C->>Seed: Lance le seed au démarrage backend
    Seed->>DB: Crée les tables si nécessaire
    Seed->>DB: Réinitialise les données de démonstration
    Seed->>DB: Insère comptes, expériences et réservations
    Seed-->>C: Seed terminé
    C->>API: Lance npm run dev
    API-->>C: API disponible sur le port 5080
```

> **Attention :** le seed actuel supprime puis recrée les données. Un redémarrage du backend peut donc effacer les réservations créées pendant une démonstration.

## 11. Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Membre | `user1@nightfall.com` | `password123` |
| Membre | `user2@nightfall.com` | `password123` |
| Administrateur | `admin@nightfall.com` | `admin123` |

## 12. Limites connues à mentionner

- `GET /api/auth/me` retourne encore `501 Not implemented`.
- `GET /api/users/:id` et `PUT /api/users/:id` sont également non implémentées.
- La capacité cumulée de toutes les réservations sur un même créneau n’est pas calculée, donc le système n’empêche pas l’overbooking sur un même horaire.
- Le schéma SQL stocke la catégorie en texte ; il n’existe pas de table `categories`.
- Le README du dépôt contient encore plusieurs informations à actualiser concernant les ports, variables Vite, comptes de démonstration et routes.
- Le calcul de l’annulation est basé sur `hoursUntilReservation <= 48`, mais il dépend d’une conversion de date entre MySQL et JavaScript, donc une validation plus robuste serait recommandée pour éviter les écarts de fuseau / type.

## 13. Sources du dépôt

- [Branche main](https://github.com/ClaymeCall/holbertonschool-nightfall/tree/main)
- [Docker Compose](https://github.com/ClaymeCall/holbertonschool-nightfall/blob/main/docker-compose.yml)
- [Schéma SQL](https://github.com/ClaymeCall/holbertonschool-nightfall/blob/main/src/database/init.sql)
- [Routes expériences](https://github.com/ClaymeCall/holbertonschool-nightfall/blob/main/src/backend/src/routes/experiences.js)
- [Routes réservations](https://github.com/ClaymeCall/holbertonschool-nightfall/blob/main/src/backend/src/routes/reservations.js)
- [Middleware authentification](https://github.com/ClaymeCall/holbertonschool-nightfall/blob/main/src/backend/src/middleware/auth.js)
- [Script de seed](https://github.com/ClaymeCall/holbertonschool-nightfall/blob/main/src/backend/src/utils/seed.js)
