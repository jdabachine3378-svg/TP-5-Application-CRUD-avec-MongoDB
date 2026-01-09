// Importation du modèle Product
const Product = require('../models/product');

// Service pour créer un nouveau produit
exports.createProduct = async (productData) => {
    try {
        // Création d'une nouvelle instance Product avec les données fournies
        const product = new Product(productData);
        // Sauvegarde du produit en base de données
        await product.save();
        return product;
    } catch (error) {
        // Gestion spécifique des erreurs de validation
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            throw new Error(`Erreur de validation: ${errors.join(', ')}`);
        }
        throw error;
    }
};

// Service pour récupérer tous les produits avec pagination, filtrage, tri et recherche
exports.getAllProducts = async (options = {}) => {
    try {
        // Configuration de la pagination - page par défaut: 1, limite par défaut: 10
        const page = parseInt(options.page) || 1;
        const limit = parseInt(options.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Construction du filtre de requête
        const filter = {};
        
        // Filtre par catégorie si spécifié
        if (options.category) {
            filter.category = options.category;
        }
        
        // Filtre par disponibilité en stock si spécifié
        if (options.inStock === 'true') {
            filter.inStock = true;
        }
        
        // Filtre par prix minimum si spécifié
        if (options.minPrice) {
            filter.price = { ...filter.price, $gte: parseFloat(options.minPrice) };
        }
        
        // Filtre par prix maximum si spécifié
        if (options.maxPrice) {
            filter.price = { ...filter.price, $lte: parseFloat(options.maxPrice) };
        }
        
        // Recherche textuelle dans le nom et la description (insensible à la casse)
        if (options.search) {
            filter.$or = [
                { name: { $regex: options.search, $options: 'i' } },
                { description: { $regex: options.search, $options: 'i' } }
            ];
        }
        
        // Configuration du tri - par défaut: tri par date de création décroissante
        const sort = {};
        if (options.sortBy) {
            sort[options.sortBy] = options.sortOrder === 'desc' ? -1 : 1;
        } else {
            sort.createdAt = -1; // Tri par défaut: plus récent en premier
        }
        
        // Exécution de la requête avec pagination
        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
        
        // Compte total des documents correspondant au filtre (pour la pagination)
        const totalItems = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / limit);
        
        // Retourne les produits et les informations de pagination
        return {
            products,
            pagination: {
                page,
                limit,
                totalPages,
                totalItems
            }
        };
    } catch (error) {
        throw new Error('Erreur lors de la récupération des produits');
    }
};

// Service pour récupérer un produit par son ID
exports.getProductById = async (id) => {
    try {
        // Recherche du produit par ID
        const product = await Product.findById(id);
        
        // Si le produit n'existe pas, lance une erreur
        if (!product) {
            throw new Error('Produit non trouvé');
        }
        
        return product;
    } catch (error) {
        // Gestion spécifique des ID invalides (format incorrect)
        if (error.name === 'CastError') {
            throw new Error('ID de produit invalide');
        }
        throw error;
    }
};

// Service pour mettre à jour un produit existant
exports.updateProduct = async (id, updateData) => {
    try {
        // Mise à jour du produit - new: true retourne le document mis à jour
        // runValidators: true exécute les validateurs du schéma
        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        // Si le produit n'existe pas, lance une erreur
        if (!product) {
            throw new Error('Produit non trouvé');
        }
        
        return product;
    } catch (error) {
        // Gestion des erreurs de validation
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            throw new Error(`Erreur de validation: ${errors.join(', ')}`);
        }
        // Gestion des ID invalides
        if (error.name === 'CastError') {
            throw new Error('ID de produit invalide');
        }
        throw error;
    }
};

// Service pour supprimer un produit
exports.deleteProduct = async (id) => {
    try {
        // Suppression du produit par ID
        const product = await Product.findByIdAndDelete(id);
        
        // Si le produit n'existe pas, lance une erreur
        if (!product) {
            throw new Error('Produit non trouvé');
        }
        
        return { message: 'Produit supprimé avec succès', product };
    } catch (error) {
        // Gestion des ID invalides
        if (error.name === 'CastError') {
            throw new Error('ID de produit invalide');
        }
        throw error;
    }
};

// Service pour créer plusieurs produits en transaction (exemple)
// Garantit que toutes les opérations réussissent ou échouent ensemble
exports.createMultipleProducts = async (productsData) => {
    const session = await Product.startSession();
    session.startTransaction();
    
    try {
        // Création des produits dans la transaction
        const products = await Product.create(productsData, { session });
        
        // Validation de la transaction - toutes les opérations réussissent
        await session.commitTransaction();
        session.endSession();
        
        return products;
    } catch (error) {
        // En cas d'erreur, annulation de la transaction (rollback)
        await session.abortTransaction();
        session.endSession();
        throw new Error('Erreur lors de la création multiple');
    }
};

