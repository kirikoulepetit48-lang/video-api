# API de Génération Vidéo

Cette API Node.js Express permet de gérer des clés d'accès pour un service de génération vidéo. Elle utilise SQLite comme base de données pour stocker les clés et leurs crédits.

## Fonctionnalités

- **Gestion des Clés Administrateur**: Une clé admin est générée ou fournie pour gérer d'autres clés.
- **Génération de Clé Client**: Crée de nouvelles clés API client avec un nombre de crédits défini.
- **Consultation des Clés**: Liste toutes les clés API et leurs soldes de crédits.
- **Génération Vidéo**: Simule la génération d'une vidéo, vérifie la validité de la clé client et déduit un crédit.

## Technologies Utilisées

- Node.js
- Express.js
- better-sqlite3 (pour l'interaction avec SQLite)
- uuid (pour générer des identifiants uniques)
- dotenv (pour la gestion des variables d'environnement)
- express-validator (pour la validation des requêtes)

## Installation

1.  **Cloner le dépôt :**
    ```bash
    git clone <URL_DU_DEPOT>
    cd video-api
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```

3.  **Configurer les variables d'environnement :**
    Créez un fichier `.env` à la racine du projet en copiant `.env.example` :
    ```bash
    cp .env.example .env
    ```
    
    Vous pouvez y définir la clé administrateur *initiale*. Si vous ne la définissez pas, une clé aléatoire sera générée au premier démarrage et affichée dans la console. **Pour un environnement de production, définissez toujours `ADMIN_SEED_KEY` dans votre `.env` et gardez-la secrète.**
    ```env
    PORT=3000
    ADMIN_SEED_KEY=votre_cle_admin_securisee_ici # Optionnel, une clé sera générée si non spécifiée
    ```

## Lancement du Projet

### Mode Développement (avec `nodemon`)

```bash
npm run dev
```

### Mode Production

```bash
npm start
```

Le serveur démarrera sur `http://localhost:3000` (ou le port spécifié dans votre `.env`).

## Utilisation de l'API

**Toutes les requêtes nécessitent l'ajout d'un en-tête `X-API-KEY` avec la clé appropriée.**

### 1. Obtenir la Clé Administrateur

Au premier démarrage de l'application, si `ADMIN_SEED_KEY` n'est pas définie dans votre `.env`, une clé administrateur sera générée et affichée dans la console. Notez-la précieusement, car elle est nécessaire pour toutes les routes `admin`.

```
Serveur démarré sur le port 3000
Base de données SQLite initialisée et migrations exécutées.
Clé administrateur créée avec succès. Utilisez cette clé pour les routes admin: <VOTRE_CLE_ADMIN>
Il est recommandé de définir cette clé via ADMIN_SEED_KEY dans votre .env
```

### 2. Routes Administrateur (requièrent la `ADMIN_SEED_KEY`)

Ces routes nécessitent que l'en-tête `X-API-KEY` contienne la clé administrateur.

#### `POST /admin/generate-key` - Générer une nouvelle clé client

Crée une nouvelle clé API pour les clients avec un solde de crédits initial.

-   **Méthode**: `POST`
-   **URL**: `/admin/generate-key`
-   **En-têtes**: `X-API-KEY: <VOTRE_CLE_ADMIN>`
-   **Corps de la requête (JSON)**:
    ```json
    {
      "initialCredits": 100
    }
    ```
-   **Réponse Succès (201 CREATED)**:
    ```json
    {
      "message": "Clé API générée avec succès",
      "key": "<NOUVELLE_CLE_CLIENT>",
      "credits": 100
    }
    ```

#### `GET /admin/keys` - Lister toutes les clés API

Récupère toutes les clés API enregistrées (admin et client) et leurs détails.

-   **Méthode**: `GET`
-   **URL**: `/admin/keys`
-   **En-têtes**: `X-API-KEY: <VOTRE_CLE_ADMIN>`
-   **Réponse Succès (200 OK)**:
    ```json
    [
      {
        "id": "<UUID>",
        "key": "<CLE_ADMIN>",
        "credits": -1,      // -1 signifie illimités pour l'admin
        "is_admin": 1,
        "created_at": "2023-01-01 10:00:00"
      },
      {
        "id": "<UUID>",
        "key": "<CLE_CLIENT>",
        "credits": 99,
        "is_admin": 0,
        "created_at": "2023-01-01 10:05:00"
      }
    ]
    ```

### 3. Routes Client (requièrent une clé d'accès client)

Ces routes nécessitent que l'en-tête `X-API-KEY` contienne une clé client valide avec des crédits suffisants.

#### `POST /generate-video` - Générer une vidéo (simulée)

Déclenche une génération de vidéo. Un crédit est déduit à chaque appel réussi.

-   **Méthode**: `POST`
-   **URL**: `/generate-video`
-   **En-têtes**: `X-API-KEY: <VOTRE_CLE_CLIENT>`
-   **Corps de la requête**: Aucun (ou tout corps que votre logique de génération vidéo nécessiterait, non implémenté ici).
-   **Réponse Succès (200 OK)**:
    ```json
    {
      "message": "Vidéo générée avec succès",
      "videoUrl": "https://example.com/videos/<ID_KEY>-<TIMESTAMP>.mp4",
      "remainingCredits": 99
    }
    ```
-   **Réponse Erreur (403 Forbidden)**:
    ```json
    {
      "message": "Accès refusé: Crédits insuffisants."
    }
    ```

## Structure du Projet

```
. ভিডিও-এপিআই
├── data/
│   └── video_api.db       # Fichier de la base de données SQLite
├── src/
│   ├── config/
│   │   ├── database.js    # Configuration de la base de données SQLite
│   │   └── seed.js        # Script pour initialiser la clé admin
│   ├── controllers/
│   │   ├── adminController.js   # Logique métier pour les routes admin
│   │   └── videoController.js   # Logique métier pour la génération vidéo
│   ├── middleware/
│   │   └── authMiddleware.js    # Middlewares d'authentification par clé API
│   ├── routes/
│   │   ├── adminRoutes.js     # Définition des routes admin
│   │   └── videoRoutes.js     # Définition des routes vidéo
│   └── index.js             # Point d'entrée de l'application Express
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```
