const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { protect, requireAdmin } = require("../middlewares/authMiddleware");
const { createCategoryRules, validate } = require("../middlewares/validators/categoryValidator.js");

router.get("/", categoryController.getAllCategories);

router.post("/", protect, requireAdmin, createCategoryRules(), validate, categoryController.createCategory);

router.delete("/:id", protect, requireAdmin, categoryController.deleteCategory);

module.exports = router;

