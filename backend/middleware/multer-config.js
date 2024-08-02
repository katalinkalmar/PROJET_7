//on utilise la bibliothèque multer pour le téléchargement des images pour les livres
//sharp pour redimensionner les images
//path pour pour gérer les chemins des fichiers
//fs qui permet d'interagir avec le système des fichiers, ici pour en supprimer
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};
// on configure le stockage des téléchargements
//le callback indique à Multer d'enregistrer le fichier téléchargé dans le répertoire images.
//Le callback est appelé avec null comme premier argument, indiquant qu'il n'y a pas d'erreur, 
// et 'images', spécifie que le fichier doit être enregistré dans le répertoire images.
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },

    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');


// Redimensionnement de l'image
module.exports.resizeImage = (req, res, next) => {
    // On vérifie si un fichier a été téléchargé
    if (!req.file) {
        return next();
    }

    const filePath = req.file.path;
    const fileName = req.file.filename;
    const outputFilePath = path.join('images', `resized_${fileName}`);

    sharp(filePath)
        .resize({ width: 465, height: 600 })
        .toFile(outputFilePath)
        .then(() => {
            // Remplacer le fichier original par le fichier redimensionné
            fs.unlink(filePath, () => {
                req.file.path = outputFilePath;
                next();
            });
        })
        .catch(err => {
            console.log(err);
            return next();
        });
};