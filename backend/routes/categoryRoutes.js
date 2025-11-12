const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Get all categories
router.get("/", categoryController.getAllCategories);

// Create new category
router.post("/", categoryController.createCategory);

// Delete category
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;

