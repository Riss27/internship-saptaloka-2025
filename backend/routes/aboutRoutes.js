const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const upload = require('../middleware/upload');


router.get('/', aboutController.getAboutContent);

router.put('/', upload.single('logoFooter'), aboutController.updateAboutContent);

module.exports = router;