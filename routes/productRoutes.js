// Importation d'Express et création d'un routeur
const express = require('express');
const router = express.Router();

// Importation du contrôleur Product pour gérer les requêtes
const productController = require('../controllers/productController');

// Routes pour les produits

// GET /products - Afficher la liste de tous les produits
router.get('/', productController.getAllProducts);

// GET /products/create - Afficher le formulaire de création
router.get('/create', productController.showCreateForm);

// POST /products/create - Traiter la soumission du formulaire de création
router.post('/create', productController.createProduct);

// GET /products/:id - Afficher les détails d'un produit
router.get('/:id', productController.getProductById);

// GET /products/:id/edit - Afficher le formulaire d'édition
router.get('/:id/edit', productController.showEditForm);

// POST /products/:id/update - Traiter la soumission du formulaire de modification
router.post('/:id/update', productController.updateProduct);

// POST /products/:id/delete - Supprimer un produit
router.post('/:id/delete', productController.deleteProduct);

// Exportation du routeur pour utilisation dans app.js
module.exports = router;

