const cron = require('node-cron');
const Booking = require('../models/Booking');
const Product = require('../models/Product');

cron.schedule('0 * * * *', async () => {
    try {
        const now = new Date();
        const expiredBookings = await Booking.find({
            status: 'pending',
            expiresAt: { $lt: now }
        });

        for (let booking of expiredBookings) {
            // Remettre le product en stock
            for (let item of booking.items) {
                await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
            }
            booking.status = 'expired';
            await booking.save();
            console.log(`[CRON] Booking ${booking.pickupCode} expiré. Stock rendu.`);
        }
    } catch (error) {
        console.error("Erreur Cron Expiration:", error);
    }
});