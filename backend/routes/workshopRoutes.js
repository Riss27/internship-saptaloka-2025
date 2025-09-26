const express = require("express");
const router = express.Router();
const workshopController = require("../controllers/workshopController");

// Menghubungkan URL ke fungsi controller yang sesuai
router.get("/", workshopController.getAllWorkshops);
router.post("/", workshopController.createWorkshop);
router.get("/:id", workshopController.getWorkshopById);
router.put("/:id", workshopController.updateWorkshop);
router.delete("/:id", workshopController.deleteWorkshop);

module.exports = router;
