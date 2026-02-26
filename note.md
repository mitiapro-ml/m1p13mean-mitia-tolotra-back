# 🚀 Documentation Technique : Backend MEAN (M1 Projet)

Ce document détaille l'architecture du serveur Node.js / Express, stabilisé pour garantir la sécurité et la scalabilité du projet.

---

## 🏗️ 1. Architecture du Système
Le serveur suit une architecture **modulaire** pour faciliter la maintenance et l'évolution.

* **Point d'entrée** : `server.js` (Configuration Express, connexion MongoDB, et middleware CORS).
* **Routage** : Découpé par domaine (`auth`, `products`, `stats`, `shops`, `categories`).
* **Contrôleurs** : Logique métier isolée pour chaque ressource (CRUD et calculs).
* **Middlewares** : Couches de sécurité et de traitement de fichiers (Multer).

---

## 🔐 2. Stratégie de Sécurité & Authentification

Nous utilisons une authentification basée sur les **JSON Web Tokens (JWT)** avec une gestion des droits à deux niveaux.

### A. Authentification (`authMiddleware`)
Ce middleware vérifie la validité du token envoyé dans le header `Authorization`.
- **Fonctionnement** : Il extrait le token, le vérifie avec la clé `JWT_SECRET`, et injecte les données décodées dans `req.user`.

### B. Autorisation (`adminCheck`)
Ce middleware restreint l'accès aux données sensibles aux seuls administrateurs.
- **Fonctionnement** : Il compare `req.user.role` avec la valeur `'admin'`. Si l'utilisateur n'a pas les droits, une erreur `403 Forbidden` est renvoyée.



---

## 📦 3. Gestion des Ressources & Routes

### 🛒 Module Produits (`/api/products`)
L'ordre des routes a été optimisé pour éviter les conflits de paramètres (routes statiques avant les routes dynamiques).
- `GET /latest` : Récupère les nouveautés (Accès public).
- `GET /search` : Recherche avec filtres de prix/catégorie (Accès public).
- `GET /:id` : Détails d'un produit spécifique.
- `PUT /:id` : Mise à jour (Authentifié + Multer pour l'image).
- `DELETE /:id` : Suppression (Authentifié).

### 📈 Module Statistiques (`/api/stats`)
- `GET /inventory/:shopId` : État des stocks par boutique (Authentifié).
- `GET /categories/:shopId` : Répartition des ventes (Authentifié).
- `GET /global` : Chiffres d'affaires globaux (**Admin uniquement**).

---

## 🖼️ 4. Gestion des Médias (Multer)

Le stockage des images est géré de manière statique pour une performance optimale.
- **Stockage** : Dossier physique `/images` à la racine.
- **Traitement** : Les fichiers sont renommés avec un `timestamp` unique pour éviter les collisions.
- **Accessibilité** : Le serveur expose le dossier via `express.static`, permettant au Front-end d'afficher les images via une URL.



---

## ⚙️ 5. Configuration Environnementale (`.env`)

Le projet est portable et sécurisé via des variables d'environnement :
- `MONGO_URI` : Chaîne de connexion à MongoDB Atlas.
- `JWT_SECRET` : Clé de chiffrement des tokens.
- `PORT` : Port d'écoute du serveur (par défaut 3000).

---

## 🛠️ 6. Résolution des Problèmes Critiques (Debug log)

1. **Uniformisation de l'objet Request** : Passage de `req.auth` à `req.user` pour assurer la communication entre les middlewares.
2. **Gestion des Exports** : Passage aux exports nommés (`exports.nom`) pour importer plusieurs fonctions depuis un seul fichier middleware.
3. **Priorité de Routage** : Placement stratégique des routes statiques pour empêcher Express de capturer les mots-clés (`search`, `latest`) comme des identifiants (`:id`).

---