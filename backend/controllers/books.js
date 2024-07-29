const Thing = require('../models/thing');


// import du package fs (file system)
const fs = require('fs');

// partie 2 cours 3
// GET
exports.getAllBooks = (req, res, next) => {
    Thing.find()
        .then((books) => { res.status(200).json(books); })
        .catch((error) => { res.status(400).json({ error: error }); });
};

// partie 2 cours 3
// GET
exports.getOneBook = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then((livre) => { res.status(200).json(livre); })
        .catch((error) => { res.status(404).json({ error: error }); });
};

// GET
exports.getBestRating = (req, res, next) => {
    Thing.find().sort({ averageRating: -1 }).limit(3)
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(404).json({ error }));
};


// POST
exports.addBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);

    delete bookObject._id;
    delete bookObject._userId;

    const newBook = new Thing({
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
exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete thingObject._userId;

    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => { res.status(400).json({ error }) });
};


// DELETE
exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = thing.imageUrl.split('/images/')[1];

                fs.unlink(`images/${filename}`, () => {
                    Thing.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => { res.status(500).json({ error }) });
};

// POST ajout d'une note
exports.createRating = (req, res, next) => {

    if (0 <= req.body.rating <= 5) {

        const ratingObject = { ...req.body, grade: req.body.rating };

        delete ratingObject._id;

        Thing.findOne({ _id: req.params.id })
            .then(book => {

                const newRatings = book.ratings;
                const userIdArray = newRatings.map(rating => rating.userId);

                if (userIdArray.includes(req.auth.userId)) {

                    res.status(403).json({ message: 'Not authorized' });

                } else {
                    newRatings.push(ratingObject);

                    const grades = newRatings.map(rating => rating.grade);

                    let sum = 0;
                    for (let i = 0; i < grades.length; i++) {
                        sum += grades[i];
                    }

                    const averageGrades = sum / grades.length

                    book.averageRating = averageGrades;

                    Thing.updateOne({ _id: req.params.id }, { ratings: newRatings, averageRating: averageGrades, _id: req.params.id })
                        .then(() => { res.status(201).json() })
                        .catch(error => { res.status(400).json({ error }) });

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
