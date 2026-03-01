const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nom: { 
        type: String, 
        required: [true, "Le nom du produit est obligatoire"] 
    },
    description: { 
        type: String 
    },
    prix: { 
        type: Number, 
        required: [true, "Le prix est obligatoire"] 
    },
    image: { 
        type: String 
    },
    poid: { 
        type: Number, 
        default: 0 
    },
    popular: { 
        type: Boolean, 
        default: false 
    },
    promo: { 
        type: Number, 
        default: 0 
    },
    shop: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Shop', 
        required: true 
    },

    isStockable: { 
        type: Boolean, 
        default: true 
    },

    stock: { 
        type: Number, 
        default: 0 
    },

    manualAvailability: { 
        type: Boolean, 
        default: true 
    }

}, { 
    timestamps: true, 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
});

/**
 * CHAMP VIRTUEL : isAvailable
 * Ce champ calcul la disponibilite 
 */
productSchema.virtual('isAvailable').get(function() {
    if (!this.manualAvailability) return false;

    if (this.isStockable) {
        return this.stock > 0;
    }

    return true;
});

module.exports = mongoose.model('Product', productSchema);