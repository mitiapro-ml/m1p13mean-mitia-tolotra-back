const Shop = require('../models/Shop');
const Category = require('../models/Category');
const Product = require('../models/Product');

exports.createShop = async (req, res) => {
    try {
        const { nom, description, categorieId } = req.body;

        //  check cate
        const categoryExists = await Category.findById(categorieId);
        if (!categoryExists) {
            return res.status(404).json({ message: "Catégorie invalide" });
        }

        const newShop = new Shop({
            nom,
            description,
            categorie: categorieId,
            owner: req.user.id 
        });

        await newShop.save();
        
        const populatedShop = await Shop.findById(newShop._id).populate('categorie', 'nom');
        
        res.status(201).json({ message: "Boutique créée avec succès", shop: populatedShop });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find().populate('categorie', 'nom').populate('owner', 'nom');
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json(error);
    }
};
exports.getMyShops = async (req, res) => {
    try {
        const shops = await Shop.find({ owner: req.user.id }).populate('categorie', 'nom');
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de vos boutiques" });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const { shopId } = req.params;
        
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ message: "Boutique non trouvée" });
        }

        if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Non autorisé" });
        }

        const { nom, description, prix, poid, isStockable, stock } = req.body;

        const imageUrl = req.file 
            ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
            : "";

        const newProduct = new Product({
            nom,
            description,
            prix,
            shop: shopId,
            image: imageUrl,
            poid: poid || 0,
            
            isStockable: isStockable === 'true' || isStockable === true, 
            
            stock: (isStockable === 'true' || isStockable === true) ? (stock || 0) : 0,
            
            manualAvailability: true 
        });

        await newProduct.save();
        
        res.status(201).json({ 
            message: "Produit ajouté avec succès", 
            product: newProduct 
        });

    } catch (error) {
        console.error("Error adding product:", error); 
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
exports.getShopProducts = async (req, res) => {
    try {
        const { shopId } = req.params;
        const products = await Product.find({ shop: shopId }).populate('shop', 'nom');
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "Aucun produit trouvé pour cette boutique" });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('shop', 'nom');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.getTop5ProductsForEachShop = async (req, res) => {
    try {
        const shops = await Shop.find()
            .populate('categorie', 'nom')
            .populate('owner', 'nom');

        const shopsWithTopProducts = await Promise.all(
            shops.map(async (shop) => {
                const topProducts = await Product.find({ shop: shop._id })
                    .sort({ popular: -1, createdAt: -1 })
                    .limit(5)
                    .populate('categorie', 'nom')
                    .populate('shop', 'nom');

                return {
                    ...shop.toObject(),
                    topProducts
                };
            })
        );

        res.status(200).json(shopsWithTopProducts);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.getShopTop5Products = async (req, res) => {
    try {
        const { shopId } = req.params;
        
        const shop = await Shop.findById(shopId)
            .populate('categorie', 'nom')
            .populate('owner', 'nom');

        if (!shop) {
            return res.status(404).json({ message: "Boutique non trouvée" });
        }

        const topProducts = await Product.find({ shop: shopId })
            .sort({ popular: -1, createdAt: -1 })
            .limit(5)
            .populate('categorie', 'nom')
            .populate('shop', 'nom');

        res.status(200).json({
            shop,
            topProducts
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.updateShop = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, description, categorie } = req.body; 

        const shop = await Shop.findById(id);
        if (!shop) {
            return res.status(404).json({ message: "Boutique non trouvée" });
        }

        if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Non autorisé" });
        }

        if (categorie) {
            const categoryExists = await Category.findById(categorie);
            if (!categoryExists) {
                return res.status(404).json({ message: "Catégorie invalide" });
            }
            shop.categorie = categorie;
        }

        // Mise à jour des autres champs
        if (nom) shop.nom = nom;
        if (description) shop.description = description;

        await shop.save();

        // On renvoie la boutique mise à jour avec les infos de la catégorie
        const updatedShop = await Shop.findById(id).populate('categorie', 'nom');

        res.status(200).json({ 
            message: "Boutique mise à jour avec succès", 
            shop: updatedShop 
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
    }
};

exports.deleteShop = async (req, res) => {
    try {
        const { id } = req.params;

        const shop = await Shop.findById(id);
        if (!shop) {
            return res.status(404).json({ message: "Boutique non trouvée" });
        }

        // Sécurité : Seul le propriétaire ou l'admin peut supprimer
        if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Action non autorisée" });
        }

        // 1. Suppression en cascade : on retire tous les produits de cette boutique
        await Product.deleteMany({ shop: id });

        // 2. Suppression de la boutique
        await Shop.findByIdAndDelete(id);

        res.status(200).json({ 
            message: "La boutique et tous ses produits ont été supprimés avec succès." 
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
    }
};
// --- ADMIN : Activer ou Bannir une boutique ---
exports.activateShopByAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Vérification stricte du rôle Admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                message: "Accès refusé. Seul un administrateur peut valider une boutique." 
            });
        }

        const shop = await Shop.findById(id);
        if (!shop) {
            return res.status(404).json({ message: "Boutique introuvable" });
        }

        // 2. Inversion du statut (Validation/Activation)
        shop.isActive = !shop.isActive;
        await shop.save();

        res.status(200).json({ 
            message: `Le statut de la boutique ${shop.nom} a été mis à jour par l'admin.`, 
            isActive: shop.isActive 
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de la modération", error: error.message });
    }
};