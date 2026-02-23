module.exports = (req, res, next) => {
    // 1. On regarde le rôle que le premier middleware a extrait du token
    const roleDeLutilisateur = req.user.role; 

    // 2. On vérifie si c'est "admin"
    if (roleDeLutilisateur === 'admin') {
        next(); // OK, c'est un admin, il peut passer à l'étape suivante (le contrôleur)
    } else {
        // 3. Si c'est un "gerant" ou "client", on lui ferme la porte
        res.status(403).json({ 
            message: "Action interdite : Vous n'êtes pas l'administrateur du site !" 
        });
    }
};