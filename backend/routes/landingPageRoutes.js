const express = require("express");
const router = express.Router();
const landingPageController = require("../controllers/landingPageController");

router.get("/", landingPageController.getAllSlides);
router.post("/", landingPageController.createSlide);
router.get("/:id", landingPageController.getSlideById);
router.put("/:id", landingPageController.updateSlide);
router.delete("/:id", landingPageController.deleteSlide);

module.exports = router;
