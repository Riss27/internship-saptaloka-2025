const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/galleryImageController");
const upload = require("../middlewares/upload");
const { protect, requireAdmin } = require("../middlewares/authMiddleware");
const { createGalleryRules, updateGalleryRules, validate } = require("../middlewares/validators/galleryValidator.js");

router.get("/", galleryController.getAllImages);
router.get("/:id", galleryController.getImageById);

router.post("/", protect, requireAdmin, upload.single("image"), createGalleryRules(), validate, galleryController.createImage);
router.post("/bulk-delete", protect, requireAdmin, galleryController.bulkDeleteImages);
router.put("/:id", protect, requireAdmin, upload.single("image"), updateGalleryRules(), validate, galleryController.updateImage);
router.patch("/order", protect, requireAdmin, galleryController.reorderImages);
router.delete("/:id", protect, requireAdmin, galleryController.deleteImage);

module.exports = router;
