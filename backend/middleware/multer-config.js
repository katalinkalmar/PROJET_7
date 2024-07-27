const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

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