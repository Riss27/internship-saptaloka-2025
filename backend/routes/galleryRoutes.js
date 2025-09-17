const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/galleryImageController");
const upload = require("../middleware/upload");

router.route("/").get(galleryController.getAllImages).post(upload.single("image"), galleryController.createImage); // 'image' adalah nama field di form

router.route("/:id").delete(galleryController.deleteImage);

module.exports = router;
