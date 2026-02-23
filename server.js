const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// IMPORT ROUTES
const authRoutes = require('./routes/authRoutes'); 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion MongoDB
const mongoURI = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/m1p13mean-db';

mongoose.connect(mongoURI)
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error(' Erreur de connexion MongoDB:', err));

// 2. UTILISATION DES ROUTES
app.use('/api/auth', authRoutes);

// Route de base
app.get('/', (req, res) => {
    res.json({ message: "API Mitia & Tolotra opérationnelle !" });
});

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Serveur lancé sur http://localhost:${PORT}`);
});

//boutique et catégorie
const shopRoutes = require('./routes/shopRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // À créer sur le même modèle

app.use('/api/shops', shopRoutes);
app.use('/api/categories', categoryRoutes);