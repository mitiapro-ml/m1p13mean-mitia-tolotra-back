const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: { 
        type: String, 
        required: [true, "Le nom est obligatoire"] 
    },
    prenom: { 
        type: String, 
        required: [true, "Le prénom est obligatoire"] 
    },
    email: { 
        type: String, 
        required: [true, "L'email est obligatoire"], 
        unique: true, 
        lowercase: true 
    },
    password: { 
        type: String, 
        required: [true, "Le mot de passe est obligatoire"] 
    },
    role: { 
        type: String, 
        enum: ['admin', 'boutique', 'client'], 
        default: 'client' 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);