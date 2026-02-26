const Product = require('../models/Product');

/**
 * @route   GET /api/products/search
 * @desc    Recherche multicritères : recherche textuelle, prix, type, popularité et tri.
 * @access  Public
 * * PARAMÈTRES ATTENDUS (Query Params) :
 * - keyword : string (recherche dans le nom)
 * - minPrice / maxPrice : number
 * - popular : boolean ('true')
 * - type : string ('shop' ou 'product')
 * - sortBy : string ('price_asc', 'price_desc', 'newest')
 */
exports.searchAndFilterProducts = async (req, res) => {
    try {
        const { keyword, minPrice, maxPrice, popular, type, sortBy } = req.query;
        let query = {};

        // Recherche par mot-clé 
        if (keyword) {
            query.nom = { $regex: keyword, $options: 'i' };
        }

        // Filtre par prix
        if (minPrice || maxPrice) {
            query.prix = {};
            if (minPrice) query.prix.$gte = Number(minPrice);
            if (maxPrice) query.prix.$lte = Number(maxPrice);
        }

        // Filtre popularite
        if (popular === 'true') {
            query.popular = true;
        }

        // --- Tri  ---
        let sortOption = {};
        if (sortBy === 'price_asc') sortOption = { prix: 1 };       // Moins cher au plus cher
        else if (sortBy === 'price_desc') sortOption = { prix: -1 }; // Plus cher au moins cher
        else if (sortBy === 'newest') sortOption = { createdAt: -1 }; // Plus recent 
        else sortOption = { createdAt: -1 }; // Tri par défaut

        // --- ---
        let results = await Product.find(query)
            .sort(sortOption)
            .populate({
                path: 'shop',
                populate: { path: 'categorie' }
            });

        // --- FILTRAGE PAR TYPE ---
        // On filtre sur le type de catégorie après le populate
        if (type) {
            results = results.filter(p => 
                p.shop && p.shop.categorie && p.shop.categorie.type === type
            );
        }

        res.status(200).json({
            count: results.length,
            success: true,
            data: results
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Erreur lors de la récupération des produits", 
            error: error.message 
        });
    }
};