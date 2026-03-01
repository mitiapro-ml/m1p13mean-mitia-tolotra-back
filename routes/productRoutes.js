const express = require('express');
const router = express.Router();

// Imports des controllers et middlewares
const productCtrl = require('../controllers/productController');
const multer = require('../middleware/multer-config');  
const { authMiddleware } = require('../middleware/authMiddleware');


// --- 1. ROUTES PUBLIQUES (SANS AUTH) ---
router.get('/latest', productCtrl.getRecentProducts);
router.get('/search', productCtrl.searchAndFilterProducts);
router.get('/:id', productCtrl.getOneProduct);

// --- 2. ROUTES PROTÉGÉES (AVEC AUTH) ---
router.put('/:id', authMiddleware, multer, productCtrl.updateProduct);
router.delete('/:id', authMiddleware, productCtrl.deleteProduct);
// Route pour basculer la disponibilité manuelle
router.patch('/:id/toggle-availability', authMiddleware, productCtrl.toggleAvailability);

module.exports = router;