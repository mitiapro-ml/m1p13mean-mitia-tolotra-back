const express = require('express');
const router = express.Router();
const bookingCtrl = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, bookingCtrl.createBooking);
router.get('/my-bookings', authMiddleware, bookingCtrl.getUserBookings);
router.post('/validate', authMiddleware, bookingCtrl.validatePickup);
router.get('/shop/:shopId', authMiddleware, bookingCtrl.getShopBookings);

module.exports = router;