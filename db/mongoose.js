// Importation de Mongoose pour la gestion de MongoDB
const mongoose = require('mongoose');
// Configuration de dotenv pour charger les variables d'environnement
require('dotenv').config();

// Connexion à MongoDB avec gestion des promesses
// Note: Les options useNewUrlParser et useUnifiedTopology ne sont plus nécessaires dans Mongoose v6+
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crud_app')
    .then(() => {
        console.log('Connexion à MongoDB établie avec succès');
    })
    .catch((err) => {
        console.error('Erreur de connexion à MongoDB:', err.message);
        // Quitte l'application en cas d'échec de connexion
        process.exit(1);
    });

// Événements de connexion pour une meilleure gestion des erreurs

// Événement déclenché lorsque la connexion est établie
mongoose.connection.on('connected', () => {
    console.log('Mongoose connecté à MongoDB');
});

// Événement déclenché en cas d'erreur de connexion
mongoose.connection.on('error', (err) => {
    console.error('Erreur de connexion Mongoose:', err.message);
});

// Événement déclenché lors de la déconnexion
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose déconnecté de MongoDB');
});

// Fermeture propre de la connexion lors de l'arrêt de l'application
// Gère le signal SIGINT (Ctrl+C) pour fermer proprement la connexion
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Connexion Mongoose fermée suite à l\'arrêt de l\'application');
    process.exit(0);
});

// Exportation du module mongoose pour utilisation dans d'autres fichiers
module.exports = mongoose;

