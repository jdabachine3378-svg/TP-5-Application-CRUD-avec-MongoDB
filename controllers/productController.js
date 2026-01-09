// Importation du service Product pour la logique métier
const productService = require('../services/productService');

// Contrôleur pour afficher la liste de tous les produits
exports.getAllProducts = async (req, res) => {
    try {
        // Récupération des paramètres de requête pour le filtrage, tri et pagination
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
        
        // Appel du service pour récupérer les produits avec les options
        const { products, pagination } = await productService.getAllProducts(options);
        
        // Rendu de la vue avec les produits, la pagination et les filtres
        res.render('products/index', {
            title: 'Liste des produits',
            products,
            pagination,
            filters: options
        });
    } catch (error) {
        // Gestion des erreurs - log et affichage d'une page d'erreur
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).render('error', {
            title: 'Erreur',
            message: error.message || 'Erreur lors de la récupération des produits'
        });
    }
};

// Contrôleur pour afficher les détails d'un produit
exports.getProductById = async (req, res) => {
    try {
        // Récupération de l'ID depuis les paramètres de la route
        const { id } = req.params;
        
        // Appel du service pour récupérer le produit par ID
        const product = await productService.getProductById(id);
        
        // Rendu de la vue de détails avec le produit
        res.render('products/details', {
            title: product.name,
            product
        });
    } catch (error) {
        // Gestion spécifique des erreurs 404 (produit non trouvé)
        if (error.message === 'Produit non trouvé' || error.message === 'ID de produit invalide') {
            return res.status(404).render('error', {
                title: 'Produit non trouvé',
                message: error.message
            });
        }
        
        // Autres erreurs - page d'erreur 500
        console.error('Erreur lors de la récupération du produit:', error);
        res.status(500).render('error', {
            title: 'Erreur',
            message: error.message || 'Erreur lors de la récupération du produit'
        });
    }
};

// Contrôleur pour afficher le formulaire de création d'un produit
exports.showCreateForm = (req, res) => {
    // Liste des catégories disponibles
    const categories = ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Autres'];
    
    // Rendu du formulaire de création avec les catégories
    res.render('products/create', {
        title: 'Ajouter un produit',
        categories,
        product: {} // Objet vide pour le formulaire
    });
};

// Contrôleur pour traiter la soumission du formulaire de création
exports.createProduct = async (req, res) => {
    try {
        // Traitement des tags - conversion de la chaîne en tableau
        if (req.body.tags && typeof req.body.tags === 'string') {
            req.body.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
        
        // Appel du service pour créer le produit
        const product = await productService.createProduct(req.body);
        
        // Redirection vers la page de détails du produit créé
        res.redirect(`/products/${product._id}`);
    } catch (error) {
        // En cas d'erreur, réaffichage du formulaire avec les données et l'erreur
        console.error('Erreur lors de la création du produit:', error);
        const categories = ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Autres'];
        res.status(400).render('products/create', {
            title: 'Ajouter un produit',
            categories,
            product: req.body, // Conservation des données saisies
            error: error.message
        });
    }
};

// Contrôleur pour afficher le formulaire d'édition d'un produit
exports.showEditForm = async (req, res) => {
    try {
        // Récupération de l'ID depuis les paramètres de la route
        const { id } = req.params;
        
        // Appel du service pour récupérer le produit
        const product = await productService.getProductById(id);
        
        // Liste des catégories disponibles
        const categories = ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Autres'];
        
        // Rendu du formulaire d'édition avec le produit et les catégories
        res.render('products/edit', {
            title: `Modifier ${product.name}`,
            product,
            categories
        });
    } catch (error) {
        // Gestion spécifique des erreurs 404
        if (error.message === 'Produit non trouvé' || error.message === 'ID de produit invalide') {
            return res.status(404).render('error', {
                title: 'Produit non trouvé',
                message: error.message
            });
        }
        
        // Autres erreurs
        console.error('Erreur lors de la récupération du produit:', error);
        res.status(500).render('error', {
            title: 'Erreur',
            message: error.message || 'Erreur lors de la récupération du produit'
        });
    }
};

// Contrôleur pour traiter la soumission du formulaire de modification
exports.updateProduct = async (req, res) => {
    try {
        // Traitement des tags - conversion de la chaîne en tableau
        if (req.body.tags && typeof req.body.tags === 'string') {
            req.body.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
        
        // Appel du service pour mettre à jour le produit
        const product = await productService.updateProduct(req.params.id, req.body);
        
        // Redirection vers la page de détails du produit mis à jour
        res.redirect(`/products/${product._id}`);
    } catch (error) {
        // Gestion des erreurs 404
        if (error.message === 'Produit non trouvé' || error.message === 'ID de produit invalide') {
            return res.status(404).render('error', {
                title: 'Produit non trouvé',
                message: error.message
            });
        }
        
        // En cas d'erreur, réaffichage du formulaire avec les données et l'erreur
        console.error('Erreur lors de la mise à jour du produit:', error);
        const categories = ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Autres'];
        res.status(400).render('products/edit', {
            title: 'Modifier le produit',
            categories,
            product: { ...req.body, _id: req.params.id }, // Conservation des données saisies
            error: error.message
        });
    }
};

// Contrôleur pour supprimer un produit
exports.deleteProduct = async (req, res) => {
    try {
        // Récupération de l'ID depuis les paramètres de la route
        const { id } = req.params;
        
        // Appel du service pour supprimer le produit
        await productService.deleteProduct(id);
        
        // Message flash de succès (stocké en session)
        req.session.flashMessage = {
            type: 'success',
            message: 'Produit supprimé avec succès'
        };
        
        // Redirection vers la liste des produits
        res.redirect('/products');
    } catch (error) {
        // Gestion des erreurs - message flash d'erreur
        if (error.message === 'Produit non trouvé' || error.message === 'ID de produit invalide') {
            req.session.flashMessage = {
                type: 'error',
                message: error.message
            };
        } else {
            req.session.flashMessage = {
                type: 'error',
                message: 'Erreur lors de la suppression du produit'
            };
        }
        
        // Redirection vers la liste des produits
        res.redirect('/products');
    }
};

