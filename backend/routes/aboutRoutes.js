const express = require("express");
const router = express.Router();
const aboutController = require("../controllers/aboutController");
const upload = require("../middlewares/upload");
const { protect, requireAdmin } = require("../middlewares/authMiddleware");
const { updateAboutRules, validate } = require("../middlewares/validators/aboutValidator.js");

router.get("/", aboutController.getAboutContent);

router.put("/", protect, requireAdmin, upload.single("logoFooter"), updateAboutRules(), validate, aboutController.updateAboutContent);

module.exports = router;
