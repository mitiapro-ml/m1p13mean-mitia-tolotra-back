const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Accès refusé, token manquant ou mal formaté" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
       
        req.user = decoded;
        
        next(); 
    } catch (error) {
        res.status(401).json({ message: "Token non valide ou expiré" });
    }
};