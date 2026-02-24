const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    description: { type: String },
    prix: { type: Number, required: true },
    shop: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Shop', 
        required: true 
    },
    image: { type: String },
    poid: { type: Number, default: 0 },
    popular: { type: Boolean, default: false },
    promo: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
