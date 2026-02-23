const express = require('express');
const router = express.Router();
const catCtrl = require('../controllers/categoryController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.get('/shop-list', catCtrl.getShopCategories);

router.post('/create', auth, catCtrl.createCategory);

// Admin : les validations
router.get('/pending', auth, admin, catCtrl.getPendingCategories);
router.post('/decide/:id', auth, admin, catCtrl.decideCategory);

module.exports = router;