const express = require('express');
const router = express.Router();
const shopCtrl = require('../controllers/shopController');
const { authMiddleware } = require('../middleware/authMiddleware');
const multer = require('../middleware/multer-config');
// Ajoute ici ton middleware admin si tu l'as séparé, sinon on gère le rôle dans le controller
// const { adminMiddleware } = require('../middleware/adminMiddleware'); 

// --- ROUTES PUBLIQUES ---
router.get('/', shopCtrl.getAllShops);
router.get('/products', shopCtrl.getAllProducts); // Voir tous les produits de la plateforme
router.get('/top5', shopCtrl.getTop5ProductsForEachShop); // Dashboard accueil

// --- ROUTES PRIVÉES (Utilisateurs & Commerçants) ---
router.post('/create', authMiddleware, shopCtrl.createShop);
router.get('/my-shops', authMiddleware, shopCtrl.getMyShops);

// Gestion spécifique d'une boutique (Update & Delete)
router.put('/:id', authMiddleware, shopCtrl.updateShop);
router.delete('/:id', authMiddleware, shopCtrl.deleteShop);

// Gestion des produits d'une boutique
router.post('/:shopId/add-product', authMiddleware, multer, shopCtrl.addProduct);
router.get('/:shopId/products', authMiddleware, shopCtrl.getShopProducts);
router.get('/:shopId/top5', shopCtrl.getShopTop5Products);

// --- ROUTES ADMINISTRATION (Sécurisées par rôle) ---
// Note: Le controller vérifie déjà si req.user.role === 'admin'
router.patch('/:id/activate', authMiddleware, shopCtrl.activateShopByAdmin);

module.exports = router;