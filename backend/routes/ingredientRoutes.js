const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredientController");

// Menghubungkan URL ke fungsi controller yang sesuai
router.get("/", ingredientController.getAllIngredients);
router.post("/", ingredientController.createIngredient);
router.get("/:id", ingredientController.getIngredientById);
router.put("/:id", ingredientController.updateIngredient);
router.delete("/:id", ingredientController.deleteIngredient);

module.exports = router;
