## Diagramme bdd

```mermaid
erDiagram
    UTILISATEUR ||--o{ RESERVATION : effectue
    EXPERIENCE ||--o{ RESERVATION : concerne
    CATEGORIE ||--o{ EXPERIENCE : regroupe

    UTILISATEUR {
        identifiant id_utilisateur PK
        texte nom
        texte email UK
        texte mot_de_passe_hashe
        texte role
    }

    CATEGORIE {
        identifiant id_categorie PK
        texte nom
    }

    EXPERIENCE {
        identifiant id_experience PK
        identifiant id_categorie FK
        texte nom
        texte description
        texte image
        entier duree_minutes
        entier niveau_intensite "1 à 5"
        entier capacite_maximale
        decimal prix
        booleen archive
    }

    RESERVATION {
        identifiant id_reservation PK
        identifiant id_utilisateur FK
        identifiant id_experience FK
        date_heure date_heure_prevue
        entier nombre_participants
        texte statut
    }
```