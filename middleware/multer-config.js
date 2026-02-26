const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); // Le dossier où on stocke les fichiers
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // On gère les espaces
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension); // Nom unique
  }
});

module.exports = multer({ storage: storage }).single('image');