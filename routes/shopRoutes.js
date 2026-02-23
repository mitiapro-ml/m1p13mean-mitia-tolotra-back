const express = require('express');
const router = express.Router();
const shopCtrl = require('../controllers/shopController');
const auth = require('../middleware/authMiddleware');

// Public : Tout le monde peut voir toutes les boutiques
router.get('/', shopCtrl.getAllShops);

//privé pour les user-shop
router.post('/create', auth, shopCtrl.createShop);
router.get('/my-shops', auth, shopCtrl.getMyShops);

module.exports = router;