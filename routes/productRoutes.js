const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController');

// Exemple : GET /api/products/search?keyword=montre&sortBy=price_asc
router.get('/search', productCtrl.searchAndFilterProducts);

module.exports = router;