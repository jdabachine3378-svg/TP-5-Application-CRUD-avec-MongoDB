// Importation d'Express et création d'un routeur pour l'API REST
const express = require('express');
const router = express.Router();

// Importation du service Product (pas le contrôleur) pour la logique métier
const productService = require('../../services/productService');

// Middleware pour gérer les erreurs d'API de manière asynchrone
// Wrapper qui capture les erreurs des fonctions async et les passe au middleware d'erreur
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Middleware pour valider les ID MongoDB (format ObjectId)
const validateObjectId = (req, res, next) => {
    const mongoose = require('mongoose');
    // Vérification du format de l'ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'ID invalide' });
    }
    next();
};

// GET /api/products - Récupérer tous les produits avec filtres et pagination
router.get('/', asyncHandler(async (req, res) => {
    // Construction des options à partir des paramètres de requête
    const options = {
        page: req.query.page,
        limit: req.query.limit,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder,
        category: req.query.category,
        inStock: req.query.inStock,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        search: req.query.search
    };
    
    // Appel du service et retour des résultats en JSON
    const result = await productService.getAllProducts(options);
    res.json(result);
}));

// GET /api/products/:id - Récupérer un produit par son ID
router.get('/:id', validateObjectId, asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    
    // Si le produit n'existe pas, retourne 404
    if (!product) {
        return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.json(product);
}));

// POST /api/products - Créer un nouveau produit
router.post('/', asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);
    // Code 201 pour création réussie
    res.status(201).json(product);
}));

// PUT /api/products/:id - Mettre à jour un produit existant
router.put('/:id', validateObjectId, asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body);
    
    // Si le produit n'existe pas, retourne 404
    if (!product) {
        return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.json(product);
}));

// DELETE /api/products/:id - Supprimer un produit
router.delete('/:id', validateObjectId, asyncHandler(async (req, res) => {
    const result = await productService.deleteProduct(req.params.id);
    
    // Si le produit n'existe pas, retourne 404
    if (!result) {
        return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.json({ message: 'Produit supprimé avec succès' });
}));

// Exportation du routeur pour utilisation dans app.js
module.exports = router;

