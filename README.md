# TP-5-Application-CRUD-avec-MongoDB

# Application CRUD avec Express, MongoDB et Mongoose

Application web complète implémentant les opérations CRUD (Create, Read, Update, Delete) pour la gestion de produits.

## Technologies utilisées

- **Node.js** - Environnement d'exécution JavaScript
- **Express.js** - Framework web pour Node.js
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM (Object Document Mapper) pour MongoDB
- **EJS** - Moteur de template pour générer du HTML dynamique
- **Bootstrap 5** - Framework CSS pour l'interface utilisateur

## Fonctionnalités

- ✅ Création, lecture, mise à jour et suppression de produits
- ✅ Pagination des résultats
- ✅ Filtrage par catégorie, stock, prix
- ✅ Recherche textuelle
- ✅ Tri des produits
- ✅ Validation des données
- ✅ API REST pour l'accès programmatique
- ✅ Interface utilisateur moderne avec Bootstrap

## Installation

### Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (via Docker recommandé)
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet** (ou télécharger)

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer MongoDB**

   Option 1 : Utiliser Docker (recommandé)
   ```bash
   docker-compose up -d
   ```

   Option 2 : Installer MongoDB localement
   - Télécharger et installer MongoDB depuis [mongodb.com](https://www.mongodb.com/try/download/community)

   Option 3 : Utiliser MongoDB Atlas (cloud)
   - Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Configurer un cluster et obtenir l'URI de connexion
   - Mettre à jour `MONGODB_URI` dans le fichier `.env`

4. **Configurer les variables d'environnement**

   Créer un fichier `.env` à la racine du projet :
   ```
   MONGODB_URI=mongodb://localhost:27017/crud_app
   PORT=3000
   SESSION_SECRET=secret_key_change_in_production
   ```

## Lancement de l'application

```bash
npm start
```

Ou en mode développement (avec nodemon) :
```bash
npm run dev
```

L'application sera accessible à l'adresse : **http://localhost:3000**

## Structure du projet

```
crud-express-mongodb/
├── config/              # Fichiers de configuration
├── controllers/         # Contrôleurs (logique de traitement des requêtes)
│   └── productController.js
├── db/                  # Configuration de la base de données
│   └── mongoose.js
├── middleware/          # Middlewares personnalisés
│   └── validators.js
├── models/              # Modèles Mongoose
│   └── product.js
├── public/              # Fichiers statiques
│   └── css/
│       └── style.css
├── routes/              # Routes de l'application
│   ├── productRoutes.js
│   └── api/
│       └── productRoutes.js
├── services/            # Services (logique métier)
│   └── productService.js
├── views/               # Templates EJS
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── products/
│   │   ├── index.ejs
│   │   ├── details.ejs
│   │   ├── create.ejs
│   │   └── edit.ejs
│   └── error.ejs
├── app.js               # Point d'entrée de l'application
├── docker-compose.yml   # Configuration Docker pour MongoDB
├── package.json         # Dépendances du projet
└── README.md
```

## API REST

L'application expose également une API REST accessible via `/api/products` :

- `GET /api/products` - Récupérer tous les produits (avec filtres et pagination)
- `GET /api/products/:id` - Récupérer un produit par ID
- `POST /api/products` - Créer un nouveau produit
- `PUT /api/products/:id` - Mettre à jour un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Exemple d'utilisation de l'API

```bash
# Récupérer tous les produits
curl http://localhost:3000/api/products

# Créer un produit
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Produit Test","price":29.99,"category":"Électronique"}'
```

## Auteur

TP réalisé dans le cadre d'un cours sur Express.js et MongoDB.
