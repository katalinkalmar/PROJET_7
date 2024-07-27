const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require("../middleware/multer-config");

const booksCtrl = require('../controllers/books');


// GET
router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRating); // placer /bestrating avant /:id sinon error
router.get('/:id', booksCtrl.getOneBook);

// POST
router.post('/', auth, multer, multer.resizeImage, booksCtrl.addBook);
router.post('/:id/rating', auth, booksCtrl.createRating);

// PUT
router.put('/:id', auth, booksCtrl.modifyThing);

// DELETE
router.delete('/:id', auth, booksCtrl.deleteThing);


module.exports = router;