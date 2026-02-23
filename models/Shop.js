const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    description: { type: String },
    categorie: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActivated: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);