const express = require('express');
const router = express.Router();
const shopCtrl = require('../controllers/shopController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public 
router.get('/', shopCtrl.getAllShops);

//privé pour les user-shop
router.post('/create', authMiddleware, shopCtrl.createShop);
router.get('/my-shops', authMiddleware, shopCtrl.getMyShops);

module.exports = router;