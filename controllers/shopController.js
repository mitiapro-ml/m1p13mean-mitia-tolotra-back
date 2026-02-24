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
        const { nom, description, prix, poid, image } = req.body;
        const shop = await Shop.findById(shopId);

        if (!shop) {
            return res.status(404).json({ message: "Boutique non trouvée" });
        }
        if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à ajouter des produits à cette boutique" });
        }

        const newProduct = new Product({
            nom,
            description,
            prix,
            shop: shopId,
            image: image == undefined ? "" : image,
            poid: poid == undefined ? 0 : poid,
        });

        await newProduct.save();
        res.status(201).json({ message: "Produit ajouté avec succès", product: newProduct });
    } catch (error) {
        console.error("Error adding product:", error); 
        res.status(500).json({ message: "Erreur serveur", error });
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