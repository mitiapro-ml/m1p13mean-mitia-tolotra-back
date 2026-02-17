const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL)
.then(async () => {
    console.log("Connexion réussie pour le test...");
    
    // Création d'un Admin de test
    const admin = new User({
        nom: "Mitia",
        prenom: "TolotraTestdata1",
        email: "admin01@test.com",
        password: "123", // Attention: plus tard on va hasher les mots de passe !
        role: "admin"
    });

    await admin.save();
    console.log("Utilisateur Admin créé avec succès !");
    process.exit();
})
.catch(err => console.log(err));