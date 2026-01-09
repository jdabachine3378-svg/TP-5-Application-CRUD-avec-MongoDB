// Importation de express-validator pour la validation des données
const { body, validationResult } = require('express-validator');

// Validation pour les produits - tableau de règles de validation
exports.validateProduct = [
    // Validation du nom - obligatoire, minimum 2 caractères
    body('name')
        .notEmpty().withMessage('Le nom est obligatoire')
        .trim()
        .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),

    // Validation du prix - doit être un nombre positif (float)
    body('price')
        .isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),

    // Validation de la description - optionnelle, maximum 1000 caractères
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('La description ne peut pas dépasser 1000 caractères'),

    // Validation de la catégorie - doit être dans la liste des valeurs autorisées
    body('category')
        .optional()
        .isIn(['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Autres'])
        .withMessage('Catégorie invalide'),

    // Validation de la quantité - doit être un entier positif ou zéro
    body('quantity')
        .optional()
        .isInt({ min: 0 }).withMessage('La quantité doit être un nombre entier positif'),

    // Validation des tags - doit être une chaîne ou un tableau de chaînes
    body('tags')
        .optional()
        .custom((value) => {
            // Accepte les chaînes de caractères
            if (typeof value === 'string') {
                return true;
            }
            // Accepte les tableaux de chaînes
            if (Array.isArray(value)) {
                return value.every(tag => typeof tag === 'string');
            }
            return false;
        }).withMessage('Format de tags invalide')
];

// Middleware pour vérifier les résultats de validation
exports.checkValidationResult = (req, res, next) => {
    // Récupération des erreurs de validation
    const errors = validationResult(req);
    
    // Si des erreurs existent
    if (!errors.isEmpty()) {
        // Pour les requêtes API, retourne une réponse JSON
        if (req.originalUrl.startsWith('/api')) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            // Pour les requêtes web, réaffiche le formulaire avec les erreurs
            const errorMessages = errors.array().map(err => err.msg).join(', ');
            
            // Formulaire de création
            if (req.path.includes('/create')) {
                return res.status(400).render('products/create', {
                    title: 'Ajouter un produit',
                    categories: ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Autres'],
                    product: req.body,
                    error: errorMessages
                });
            } 
            // Formulaire d'édition
            else if (req.path.includes('/update')) {
                return res.status(400).render('products/edit', {
                    title: 'Modifier le produit',
                    categories: ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Autres'],
                    product: { ...req.body, _id: req.params.id },
                    error: errorMessages
                });
            }
        }
    }
    
    // Si pas d'erreurs, continue vers le prochain middleware
    next();
};

