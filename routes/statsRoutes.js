// routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const statsCtrl = require('../controllers/statsController');
const { authMiddleware ,adminCheck} = require('../middleware/authMiddleware');

// Route : GET /api/stats/inventory/:shopId
router.get('/inventory/:shopId', authMiddleware, statsCtrl.getInventoryStats);
//GET /api/stats/categories/:shopId
router.get('/categories/:shopId', authMiddleware, statsCtrl.getCategoryBreakdown);
//admin
router.get('/global', authMiddleware, adminCheck, statsCtrl.getGlobalAdminStats);
module.exports = router;