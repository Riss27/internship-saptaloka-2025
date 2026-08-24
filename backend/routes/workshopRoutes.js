const express = require("express");
const router = express.Router();
const workshopController = require("../controllers/workshopController");
const { protect, requireAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { createWorkshopRules, updateWorkshopRules, validate } = require("../middlewares/validators/workshopValidator.js");

router.get("/", workshopController.getAllWorkshops);
router.get("/:id", workshopController.getWorkshopById);

router.post("/", protect, requireAdmin, upload.single("imageUrl"), createWorkshopRules(), validate, workshopController.createWorkshop);
router.put("/:id", protect, requireAdmin, upload.single("imageUrl"), updateWorkshopRules(), validate, workshopController.updateWorkshop);
router.delete("/:id", protect, requireAdmin, workshopController.deleteWorkshop);

module.exports = router;
