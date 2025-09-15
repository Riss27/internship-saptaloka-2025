const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');

// Rute untuk GET konten "About"
router.get('/', aboutController.getAboutContent);

// Rute untuk UPDATE konten "About"
router.put('/', aboutController.updateAboutContent);

module.exports = router;