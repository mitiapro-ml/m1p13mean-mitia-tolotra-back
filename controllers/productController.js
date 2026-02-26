const Product = require('../models/Product');
const fs = require('fs'); // Système de fichiers de Node.js pour supprimer l'ancienne image

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

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Produit introuvable" });
        }

        let updates = { ...req.body };

        if (req.file) {
            if (product.image) {
                const filename = product.image.split('/images/')[1]; // On récupère le nom du fichier
                fs.unlink(`images/${filename}`, (err) => {
                    if (err) console.log("Erreur lors de la suppression de l'ancienne image:", err);
                });
            }

            updates.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        }

        delete updates.shop;

        Object.assign(product, updates);
        const updatedProduct = await product.save();

        res.status(200).json({
            message: "Produit mis à jour !",
            data: updatedProduct
        });

    } catch (error) {
        res.status(400).json({ message: "Erreur MAJ", error: error.message });
    }
};



exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        // --- NETTOYAGE IMAGE ---
        if (product.image) {
            // On extrait le nom du fichier de l'URL (ex: image_123.jpg)
            const filename = product.image.split('/images/')[1];
            fs.unlink(`images/${filename}`, (err) => {
                if (err) console.log("L'image n'existait déjà plus sur le serveur.");
            });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Produit et image supprimés avec succès !" });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
    }
};

exports.getOneProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate({
            path: 'shop',
            populate: { path: 'categorie' }
        });
        
        if (!product) return res.status(404).json({ message: "Produit introuvable" });
        
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getRecentProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 }) 
            .limit(10)
            .populate('shop', 'nom'); 

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ 
            message: "Erreur lors de la récupération des nouveautés", 
            error: error.message 
        });
    }
};