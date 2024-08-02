const express = require('express');
// création d'une instance du routeur Express
// pour regrouper les routes spécifiques aux livres.
const router = express.Router();
//importe un mdw d'authentification pour s'assurer que seuls les
//utilisateurs authentifiés puissent créer, modifier, supprimer les livres.
const auth = require('../middleware/auth');
//importe un mdw de gestion pour le téléch des livres.
const multer = require("../middleware/multer-config");
// on importe la logique métier de la gestion des livres.
const booksController = require('../controllers/books');

// url: localhost:4000/api/books/
// method: post
// >>> function add book 

// GET
router.get('/', booksController.getAllBooks);
router.get('/bestrating', booksController.getBestRating); // placer /bestrating avant /:id sinon error
router.get('/:id', booksController.getOneBook);

// POST
router.post('/', auth, multer, multer.resizeImage, booksController.addBook);
router.post('/:id/rating', auth, booksController.createRating);

// PUT
router.put('/:id', auth, booksController.modifyBook);

// DELETE
router.delete('/:id', auth, booksController.deleteBook);


module.exports = router;