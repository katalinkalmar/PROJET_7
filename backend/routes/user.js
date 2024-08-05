const express = require('express');
const router = express.Router();
// mon dossier user se trouve dans dossier controleur fichier
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;