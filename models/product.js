// Importation de Mongoose pour créer le schéma et le modèle
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Définition du schéma Product avec validation et options
const productSchema = new Schema({
    // Nom du produit - obligatoire, min 2 caractères, espaces supprimés
    name: {
        type: String,
        required: [true, 'Le nom du produit est obligatoire'],
        trim: true,
        minlength: [2, 'Le nom doit contenir au moins 2 caractères']
    },
    
    // Prix du produit - obligatoire, nombre positif ou zéro
    price: {
        type: Number,
        required: [true, 'Le prix est obligatoire'],
        min: [0, 'Le prix ne peut pas être négatif'],
        default: 0
    },
    
    // Description du produit - optionnelle, max 1000 caractères
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
    },
    
    // Catégorie du produit - valeurs prédéfinies, défaut 'Autres'
    category: {
        type: String,
        enum: {
            values: ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Autres'],
            message: '{VALUE} n\'est pas une catégorie valide'
        },
        default: 'Autres'
    },
    
    // Disponibilité en stock - booléen, défaut true
    inStock: {
        type: Boolean,
        default: true
    },
    
    // Quantité en stock - nombre entier positif ou zéro
    quantity: {
        type: Number,
        min: 0,
        default: 0
    },
    
    // Tags du produit - tableau de chaînes de caractères
    tags: {
        type: [String],
        trim: true
    },
    
    // URL de l'image du produit - défaut 'default-product.jpg'
    imageUrl: {
        type: String,
        default: 'default-product.jpg'
    }
}, {
    // Options du schéma - ajoute automatiquement createdAt et updatedAt
    timestamps: true
});

// Index pour améliorer les performances des requêtes fréquentes

// Index sur le nom pour les recherches textuelles
productSchema.index({ name: 1 });

// Index sur la catégorie pour les filtres par catégorie
productSchema.index({ category: 1 });

// Index sur les tags pour les recherches par tags
productSchema.index({ tags: 1 });

// Index sur le prix - utile pour le tri et les filtres par prix
productSchema.index({ price: 1 });

// Virtual property - propriété calculée non stockée en base de données
// Formate le prix avec 2 décimales et le symbole €
productSchema.virtual('formattedPrice').get(function() {
    return `${this.price.toFixed(2)} €`;
});

// Méthode d'instance - vérifie si le stock est faible (< 5 et en stock)
productSchema.methods.isLowStock = function() {
    return this.quantity < 5 && this.inStock;
};

// Méthode statique - trouve tous les produits d'une catégorie donnée
productSchema.statics.findByCategory = function(category) {
    return this.find({ category: category });
};

// Middleware pre-save - exécuté avant chaque sauvegarde
// Si la quantité est 0, met automatiquement inStock à false
productSchema.pre('save', function(next) {
    if (this.quantity === 0) {
        this.inStock = false;
    }
    next();
});

// Middleware post-save - exécuté après chaque sauvegarde
// Log le nom du produit sauvegardé dans la console
productSchema.post('save', function(doc) {
    console.log(`Produit sauvegardé: ${doc.name}`);
});

// Création et exportation du modèle Product
const Product = mongoose.model('Product', productSchema);
module.exports = Product;

