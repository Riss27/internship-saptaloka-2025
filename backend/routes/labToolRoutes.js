const express = require("express");
const router = express.Router();
const labToolController = require("../controllers/labToolController");

// Menghubungkan URL ke fungsi controller yang sesuai
router.get("/", labToolController.getAllLabTools);
router.post("/", labToolController.createLabTool);
router.get("/:id", labToolController.getLabToolById);
router.put("/:id", labToolController.updateLabTool);
router.delete("/:id", labToolController.deleteLabTool);

module.exports = router;
