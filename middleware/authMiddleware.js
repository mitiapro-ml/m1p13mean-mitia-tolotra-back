const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Accès refusé, token manquant ou mal formaté" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // On stocke les infos décodées (id, role, etc.) dans req.user
        req.user = decoded; 
        
        next(); 
    } catch (error) {
        res.status(401).json({ message: "Token non valide ou expiré" });
    }
};

exports.adminCheck = (req, res, next) => {
    // On vérifie bien req.user (le même nom que plus haut)
    if (req.user && req.user.role === 'admin') {
        next(); 
    } else {
        res.status(403).json({ message: "Accès refusé : Réservé aux administrateurs" });
    }
};