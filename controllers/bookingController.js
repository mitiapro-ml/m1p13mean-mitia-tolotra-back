const Booking = require('../models/Booking');
const Product = require('../models/Product');

// --- CLIENT : Créer une réservation ---
exports.createBooking = async (req, res) => {
    try {
        const { shopId, items, type } = req.body;
        const pickupCode = "MT-" + Math.random().toString(36).substring(2, 8).toUpperCase();

        let total = 0;

        for (let item of items) {
            const product = await Product.findById(item.product);

            // 1. Vérification de l'existence
            if (!product) {
                return res.status(404).json({ message: "Produit introuvable" });
            }

            // 2. Vérification de la disponibilité globale (Virtual Mongoose)
            // Cela vérifie manualAvailability ET (si stockable) que stock > 0
            if (!product.isAvailable) {
                return res.status(400).json({ 
                    message: `Le produit ${product.nom} n'est pas disponible actuellement.` 
                });
            }

            // 3. Gestion spécifique du stock physique
            if (product.isStockable) {
                if (product.stock < item.quantity) {
                    return res.status(400).json({ 
                        message: `Stock insuffisant pour ${product.nom} (Restant: ${product.stock})` 
                    });
                }
                // On ne déduit que si le produit est marqué comme stockable
                product.stock -= item.quantity;
                await product.save();
            } else {
                // Si non-stockable (Pizza/Service), on ne touche pas au stock
                console.log(`[LOG] Réservation de ${product.nom} : produit non-stockable, aucun décompte effectué.`);
            }

            // Utilisation des bons noms de champs (prix au lieu de price)
            total += product.prix * item.quantity;
        }

        const newBooking = new Booking({
            user: req.user.id, // Vérifie si c'est req.user.id ou userId selon ton authMiddleware
            shop: shopId,
            items,
            type,
            pickupCode,
            totalAmount: total
        });

        await newBooking.save();
        res.status(201).json({ 
            message: "Réservation confirmée", 
            pickupCode, 
            booking: newBooking 
        });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// --- CLIENT : Mes réservations ---
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id , status: 'pending' }).populate('shop', 'nom');
        res.status(200).json(bookings);
    } catch (error) { res.status(500).json(error); }
};

// --- BOUTIQUE : Valider un code (Retrait sur place) ---
exports.validatePickup = async (req, res) => {
    try {
        const { pickupCode } = req.body;
        const booking = await Booking.findOneAndUpdate(
            { pickupCode, status: 'pending' },
            { status: 'completed' },
            { new: true }
        );
        if (!booking) return res.status(404).json({ message: "Code invalide ou déjà utilisé" });
        res.json({ message: "Retrait validé avec succès !", booking });
    } catch (error) { res.status(500).json(error); }
};

// --- BOUTIQUE : Liste des réservations de sa boutique ---
exports.getShopBookings = async (req, res) => {
    try {
        const { shopId } = req.params;
        const Shop = require('../models/Shop');
        const shop = await Shop.findById(shopId);
        if (!shop) return res.status(404).json({ message: "Boutique introuvable" });
        if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Non autorisé" });
        }
        const bookings = await Booking.find({ shop: shopId })
            .populate('user', 'nom prenom email')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};