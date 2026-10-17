const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { protect, requireAdmin } = require("../middlewares/authMiddleware");

// Alamat: GET /api/dashboard/stats (admin)
router.get("/stats", protect, requireAdmin, dashboardController.getDashboardStats);

module.exports = router;
