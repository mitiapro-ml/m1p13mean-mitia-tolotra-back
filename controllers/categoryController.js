const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        // check role
        const isAdmin = req.user.role === 'admin';

        const newCat = new Category({
            ...req.body,
            // Si c'est un admin: validé d'office, sinon c'est false
            isValidated: isAdmin ? true : false 
        });

        await newCat.save();
        
        const message = isAdmin 
            ? "Catégorie créée et validée par l'admin" 
            : "Catégorie proposée, en attente de validation";

        res.status(201).json({ message, category: newCat });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création", error });
    }
};

exports.getShopCategories = async (req, res) => {
    try {
        const cats = await Category.find({ type: 'shop', isValidated: true });
        res.status(200).json(cats);
    } catch (error) {
        res.status(500).json(error);
    }
};

// --- ADMIN ---

// LISTE  ATTENTES 
exports.getPendingCategories = async (req, res) => {
    try {
        const pending = await Category.find({ isValidated: false });
        res.status(200).json(pending);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.decideCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'accept' ou 'reject'

        if (action === 'accept') {
            await Category.findByIdAndUpdate(id, { isValidated: true });
            res.status(200).json({ message: "Catégorie validée !" });
        } else if (action === 'reject') {
            await Category.findByIdAndDelete(id);
            res.status(200).json({ message: "Catégorie refusée et supprimée." });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur de décision", error });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, type } = req.body;
        const updatedCat = await Category.findByIdAndUpdate(
            id, 
            { nom, type, isValidated: false }, // Remet à false pour re-validation
            { new: true }
        );  
        if (!updatedCat) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }
        res.status(200).json({ message: "Catégorie mise à jour, en attente de validation", category: updatedCat });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour", error });
    }
};

exports.deleteCategory = async (req, res) => {
    try {   
        const { id } = req.params;
        const deletedCat = await Category.findByIdAndDelete(id);
        if (!deletedCat) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }
        res.status(200).json({ message: "Catégorie supprimée avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression", error });
    }
};