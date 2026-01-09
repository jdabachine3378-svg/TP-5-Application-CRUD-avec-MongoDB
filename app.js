// Importation des modules nécessaires
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

// Configuration de dotenv pour charger les variables d'environnement
require('dotenv').config();

// Connexion à MongoDB - importation du fichier de configuration Mongoose
require('./db/mongoose');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour parser les données des formulaires (application/x-www-form-urlencoded)
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware pour parser les données JSON (pour l'API REST)
app.use(express.json());

// Configuration du dossier public pour les fichiers statiques (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Configuration de la session pour les messages flash
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 } // Durée de vie du cookie: 1 minute
}));

// Middleware pour les messages flash - transfert des messages de session vers res.locals
app.use((req, res, next) => {
    res.locals.flashMessage = req.session.flashMessage;
    delete req.session.flashMessage;
    next();
});

// Importation des routes
const productRoutes = require('./routes/productRoutes');
const apiProductRoutes = require('./routes/api/productRoutes');

// Route racine - redirection vers la liste des produits
app.get('/', (req, res) => {
    res.redirect('/products');
});

// Utilisation des routes pour les produits (interface web)
app.use('/products', productRoutes);

// Utilisation des routes API pour les produits (REST API)
app.use('/api/products', apiProductRoutes);

// Middleware pour gérer les routes non trouvées (404)
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Page non trouvée',
        message: 'La page que vous recherchez n\'existe pas.'
    });
});

// Middleware pour gérer les erreurs globales (500)
app.use((err, req, res, next) => {
    console.error('Erreur non gérée:', err);
    res.status(500).render('error', {
        title: 'Erreur serveur',
        // En production, ne pas exposer les détails de l'erreur
        message: process.env.NODE_ENV === 'production'
            ? 'Une erreur est survenue sur le serveur.'
            : err.message || 'Erreur interne du serveur'
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});

// Gestion propre de l'arrêt du serveur (signal SIGTERM)
process.on('SIGTERM', () => {
    console.log('SIGTERM reçu. Arrêt gracieux du serveur...');
    process.exit(0);
});

