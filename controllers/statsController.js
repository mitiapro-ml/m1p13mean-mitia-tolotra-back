const Product = require('../models/Product');
const mongoose = require('mongoose');
const Shop = require('../models/Shop');
const User = require('../models/User');

exports.getGlobalAdminStats = async (req, res) => {
    try {
        // On lance plusieurs calculs en même temps pour gagner en vitesse
        const [totalUsers, totalShops, totalProducts, stockValue] = await Promise.all([
            User.countDocuments(),
            Shop.countDocuments(),
            Product.countDocuments(),
            Product.aggregate([
                { $group: { _id: null, total: { $sum: { $multiply: ["$prix", "$stock"] } } } }
            ])
        ]);

        res.status(200).json({
            users: totalUsers,
            shops: totalShops,
            products: totalProducts,
            platformValue: stockValue[0] ? stockValue[0].total : 0,
            averageProductsPerShop: (totalProducts / totalShops).toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getInventoryStats = async (req, res) => {
    try {
        const { shopId } = req.params;
        const stats = await Product.aggregate([
            { $match: { shop: new mongoose.Types.ObjectId(shopId) } },
            { 
                $group: {
                    _id: "$shop",
                    totalProduits: { $sum: 1 },
                    valeurTotaleStock: { $sum: { $multiply: ["$prix", "$stock"] } },
                    ruptures: { $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] } }
                }
            }
        ]);
        res.status(200).json(stats[0] || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCategoryBreakdown = async (req, res) => {
    try {
        const { shopId } = req.params;

        const breakdown = await Product.aggregate([
            // 1. On filtre par boutique
            { $match: { shop: new mongoose.Types.ObjectId(shopId) } },
            
            // 2. On "joint" avec la collection Shops pour récupérer la catégorie
            { $lookup: {
                from: "shops", // nom de la collection en BD
                localField: "shop",
                foreignField: "_id",
                as: "shopDetails"
            }},
            
            // 3. On calcule par catégorie
            { $group: {
                _id: "$shopDetails.categorie", // On groupe par l'ID de la catégorie du shop
                count: { $sum: 1 },
                avgPrice: { $avg: "$prix" }
            }}
        ]);

        res.status(200).json(breakdown);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};