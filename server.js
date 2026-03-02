const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // AJOUTÉ : Pour gérer le chemin des images
require('dotenv').config();

// --- 1. IMPORT DES ROUTES ---
const authRoutes = require('./routes/authRoutes'); 
const adminsRoutes = require('./routes/adminRoutes');       
const shopRoutes = require('./routes/shopRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes'); 
const statsRoutes = require('./routes/statsRoutes');     
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// --- 2. MIDDLEWARES  ---
app.use(cors());
app.use(express.json());

// --- 3. GESTION DES IMAGES  ---
app.use('/images', express.static(path.join(__dirname, 'images')));

// ---  CONNEXION MONGODB ---
const mongoURI = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/m1p13mean-db';
mongoose.connect(mongoURI)
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error(' Erreur de connexion MongoDB:', err));

// ---  ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stats', statsRoutes);
//app.use('/api/users', userRoutes);
app.use('/api/admin', adminsRoutes);
app.use('/api/bookings', bookingRoutes);

// ---  SERVICE DE GESTION DES EXPIRATIONS ---
require('./services/expirationServices');

// Route de base
app.get('/', (req, res) => {
    res.json({ message: "API Mitia & Tolotra opérationnelle !" });
});

// ---  SERVEUR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Serveur lancé sur http://localhost:${PORT}`);
});