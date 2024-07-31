const Book = require('../models/book');


// import du package fs (file system)
const fs = require('fs');

// partie 2 cours 3
// GET
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => { res.status(200).json(books); })
        .catch((error) => { res.status(400).json({ error: error }); });
};

// partie 2 cours 3
// GET
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => { res.status(200).json(book); })
        .catch((error) => { res.status(404).json({ error: error }); });
};

// GET
exports.getBestRating = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(404).json({ error }));
};


// POST
exports.addBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);

    delete bookObject._id;
    delete bookObject._userId;

    const newBook = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/resized_${req.file.filename}`,
        averageRating: bookObject.ratings[0].grade
    });

    newBook.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};


// PUT
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => { res.status(400).json({ error }) });
};


// DELETE
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];

                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => { res.status(500).json({ error }) });
};

// POST ajout d'une note
exports.createRating = (req, res, next) => {
    // On vérifie que la note est comprise entre 0 et 5;
    if (0 <= req.body.rating <= 5) {

        const ratingObject = { ...req.body, grade: req.body.rating };

        delete ratingObject._id;
        //requête à la base de données pour récuperer un livre précis.
        Book.findOne({ _id: req.params.id })
            .then(book => {
                // On récupère toutes les notes émises par tous les utilisateurs. 
                const newRatings = book.ratings;
                const userIdArray = newRatings.map(rating => rating.userId);
                //Je vérifie que l'utilisateur n'avait pas déjà mis de note.
                if (userIdArray.includes(req.auth.userId)) {

                    res.status(403).json({ message: 'Not authorized' });

                } else {
                    //Je rajoute la note d'utilasateur aux notes existantes.
                    newRatings.push(ratingObject);

                    // Calcul de la moyenne des notes
                    const grades = newRatings.map(rating => rating.grade); //Liste des notes
                    let sum = 0;
                    grades.map(grade => { sum += grade })
                    const averageGrades = (sum / grades.length).toFixed(1);

                    // Je mets à jour la base de données
                    Book.updateOne({ _id: req.params.id }, { ratings: newRatings, averageRating: averageGrades, _id: req.params.id })
                        .then(() => { res.status(201).json() })
                        .catch(error => { res.status(400).json({ error }) });

                    //On renvoie le livre avec la note actualisée.
                        book.averageRating = averageGrades;
                    res.status(200).json(book);
                }
            })
            .catch((error) => {
                res.status(404).json({ error });
            });
    } else {
        res.status(400).json({ message: 'Note impossible' });
    }
};
