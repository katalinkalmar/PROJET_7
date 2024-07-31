const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require("../middleware/multer-config");

const booksCtrl = require('../controllers/books');

// url: localhost:4000/api/books/
// method: post
// >>> function add book 

// GET
router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRating); // placer /bestrating avant /:id sinon error
router.get('/:id', booksCtrl.getOneBook);

// POST
router.post('/', auth, multer, multer.resizeImage, booksCtrl.addBook);
router.post('/:id/rating', auth, booksCtrl.createRating);

// PUT
router.put('/:id', auth, booksCtrl.modifyBook);

// DELETE
router.delete('/:id', auth, booksCtrl.deleteBook);


module.exports = router;