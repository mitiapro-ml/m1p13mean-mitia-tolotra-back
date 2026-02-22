const User = require('../models/User');


exports.getAdminData = async (req, res) => {
    try {
        console.log("Admin data request for user :", req.user); // Debug log
        const users = await User.findOne({ _id: req.user.id });
        res.status(200).json({ message: "Données administrateur récupérées", user: users });
    } catch (error) {
        res.status(500).json({ message: "Vous n'êtes pas autorisé à accéder à ces données", error });
    }
};