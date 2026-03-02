const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        prix: Number,
        quantity: { type: Number, default: 1 }
    }],
    type: { type: String, enum: ['collect', 'try'], required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'expired', 'cancelled'], default: 'pending' },
    pickupCode: { type: String, unique: true, required: true },
    totalAmount: { type: Number, default: 0 },
    expiresAt: { 
        type: Date, 
        default: () => new Date(Date.now() + 36 * 60 * 60 * 1000) // Expire après 36h
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);