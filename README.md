# SecureShare

SecureShare est une application de partage d'images. Les utilisateurs peuvent creer un compte, se connecter, publier une image avec un titre et une description, puis consulter le feed. L'application est composee d'un frontend React et d'une API REST Node.js/Express avec MongoDB.

## Fonctionnalites

- Inscription et connexion avec validation des donnees et authentification par JWT.
- Publication d'images reservee aux utilisateurs authentifies.
- Redimensionnement des images et conversion au format WebP avant leur stockage.
- Consultation du fil d'images avec authentification.
- Protection de l'API avec Helmet et limitation du nombre de requetes.

## Technologies

- Frontend : React, Vite, React Router, Tailwind CSS et Sass.
- Backend : Node.js, Express, Mongoose, MongoDB, Multer et Sharp.
- Tests backend : Jest et Supertest.

## Prerequis

- Node.js et npm.
- Une instance MongoDB accessible (locale ou distante).

## Installation et lancement

Ouvrir deux terminaux depuis la racine du depot.

### 1. Configurer et lancer l'API

Dans le premier terminal :

```sh
cd back
npm install
```

Creer un fichier `back/.env` avec les variables suivantes :

```env
MONGODB_URI=mongodb://...
JWT_SECRET=...
```

Remplacer `MONGODB_URI` par l'URI de votre instance MongoDB si elle n'est pas locale. Ne pas committer le fichier `.env` ni partager la cle JWT.

Demarrer le serveur depuis le dossier `back` :

```sh
node app.js
```

L'API est alors disponible sur `http://localhost:3000`.

### 2. Lancer le frontend

Dans le second terminal :

```sh
cd front/SecureShare
npm install
npm run dev
```

Ouvrir l'adresse affichee par Vite, generalement `http://localhost:5173`. Le frontend utilise actuellement l'API a l'adresse `http://localhost:3000`.

## Routes API

| Methode | Route | Authentification | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Non | Creer un compte (`name`, `email`, `password`). |
| `POST` | `/api/v1/auth/login` | Non | Se connecter (`email`, `password`) et recevoir un JWT. |
| `POST` | `/api/v1/upload/create` | Bearer JWT | Publier une image avec `title`, `description` et un fichier `image` (multipart/form-data, 10 Mo maximum). |
| `GET` | `/api/v1/upload/get` | Bearer JWT | Recuperer les images publiees. |

Les images traitees sont exposees sous `/uploads`. Les mots de passe d'inscription doivent contenir au moins une minuscule, une majuscule, un chiffre et un symbole, avec une longueur minimale de 6 caracteres.

## Scripts

Dans `front/SecureShare` :

```sh
npm run dev      # serveur de developpement
npm run build    # build de production
npm run preview  # previsualiser le build
npm run lint     # verifier le code frontend
```

Dans `back` :

```sh
npm test         # tests Jest
```

## Structure du depot

```text
back/                 API Express, modeles, routes et tests
front/SecureShare/    Application React/Vite
```

## Note de securite

La route `POST /api/v1/auth/loginVulnerable` est volontairement vulnerable et exposee a des fins pedagogiques. Ne pas l'utiliser dans une application reelle. Le serveur de developpement et les URLs d'API sont configures pour un lancement local.
