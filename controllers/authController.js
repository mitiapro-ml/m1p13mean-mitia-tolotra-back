const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    try {
        const { nom, prenom, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Cet utilisateur existe déjà" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ nom, prenom, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: "Utilisateur créé !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur inscription", error });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

        // 2. Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

        // 3. Créer le Token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } 
        );

        res.status(200).json({
            token,
            user: { id: user._id, nom: user.nom, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur connexion", error });
    }
};