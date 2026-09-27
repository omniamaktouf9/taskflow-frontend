# TaskFlow - Frontend

Application Angular de gestion de tâches avec authentification JWT, connectée à une API Spring Boot.

## Technologies utilisées

- **Angular 22**
- **TypeScript**
- **RxJS**
- **Angular Router** (navigation, route guards)
- **HttpClient** (appels API, intercepteurs)

## Fonctionnalités

- Inscription et connexion (JWT)
- Stockage sécurisé du token (localStorage)
- Protection des routes non authentifiées (Route Guard)
- Détection automatique de l'expiration de session (HTTP Interceptor)
- CRUD complet des tâches (créer, lire, modifier, supprimer)
- Interface responsive et stylée

## Structure du projet

src/app/
├── components/
│   ├── login/          # Page de connexion/inscription
│   └── task-list/      # Page principale de gestion des tâches
├── services/
│   ├── auth.ts         # Gestion de l'authentification et du token
│   └── task.ts         # Appels API vers les tâches
├── guards/
│   └── auth-guard.ts   # Protection des routes authentifiées
└── interceptors/
    └── auth-interceptor.ts  # Gestion automatique des erreurs 401/403

## Lancer le projet en local

### Prérequis
- Node.js 18+
- Angular CLI
- Le backend TaskFlow doit être lancé sur http://localhost:8080 (voir https://github.com/omniamaktouf9/taskflow-backend)

### Étapes

1. Installer les dépendances :

npm install

2. Lancer le serveur de développement :

ng serve

3. Ouvrir le navigateur sur http://localhost:4200

## Projet backend associé

Ce frontend fonctionne avec l'API Spring Boot disponible ici : https://github.com/omniamaktouf9/taskflow-backend