const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    nom: { type: String, required: true, unique: true },
    type: { type: String, enum: ['shop', 'product'], required: true },
    isValidated: { type: Boolean, default: false } 
});
module.exports = mongoose.model('Category', categorySchema);