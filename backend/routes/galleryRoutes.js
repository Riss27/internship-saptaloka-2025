const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/galleryImageController");
const upload = require("../middlewares/upload");

router.route("/").get(galleryController.getAllImages).post(upload.single("image"), galleryController.createImage);

router.route("/:id").get(galleryController.getImageById).put(upload.single("image"), galleryController.updateImage).delete(galleryController.deleteImage);

module.exports = router;
