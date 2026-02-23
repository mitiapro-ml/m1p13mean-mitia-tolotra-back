const Shop = require('../models/Shop');
const Category = require('../models/Category');

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