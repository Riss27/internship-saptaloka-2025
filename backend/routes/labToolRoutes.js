const express = require("express");
const router = express.Router();
const labToolController = require("../controllers/labToolController");
const { protect, requireAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { createLabToolRules, updateLabToolRules, validate } = require("../middlewares/validators/labToolValidator.js");

router.get("/", labToolController.getAllLabTools);
router.get("/:id", labToolController.getLabToolById);

router.post("/", protect, requireAdmin, upload.single("image"), createLabToolRules(), validate, labToolController.createLabTool);
router.put("/:id", protect, requireAdmin, upload.single("image"), updateLabToolRules(), validate, labToolController.updateLabTool);
router.delete("/:id", protect, requireAdmin, labToolController.deleteLabTool);

module.exports = router;
