const express = require('express');
const router = express.Router();
const catCtrl = require('../controllers/categoryController');

const { authMiddleware } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public
router.get('/shop-list', catCtrl.getShopCategories);

// Privé 
router.post('/create', authMiddleware, catCtrl.createCategory);

// Admin (Utilise authMiddleware ET adminMiddleware)
router.get('/pending', authMiddleware, adminMiddleware, catCtrl.getPendingCategories);
router.post('/decide/:id', authMiddleware, adminMiddleware, catCtrl.decideCategory);

module.exports = router;