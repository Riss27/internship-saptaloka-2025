const express = require("express");
const router = express.Router();
const landingPageController = require("../controllers/landingPageController");
const { protect, requireAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { createSlideRules, updateSlideRules, validate } = require("../middlewares/validators/landingPageValidator.js");

router.get("/", landingPageController.getAllSlides);
router.get("/:id", landingPageController.getSlideById);

router.post("/", protect, requireAdmin, upload.single("image"), createSlideRules(), validate, landingPageController.createSlide);
router.put("/:id", protect, requireAdmin, upload.single("image"), updateSlideRules(), validate, landingPageController.updateSlide);
router.delete("/:id", protect, requireAdmin, landingPageController.deleteSlide);

module.exports = router;
