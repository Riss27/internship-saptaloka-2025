const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredientController");
const { protect, requireAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { createIngredientRules, updateIngredientRules, validate } = require("../middlewares/validators/ingredientValidator.js");

router.get("/", ingredientController.getAllIngredients);
router.get("/:id", ingredientController.getIngredientById);

router.post("/", protect, requireAdmin, upload.single("image"), createIngredientRules(), validate, ingredientController.createIngredient);
router.put("/:id", protect, requireAdmin, upload.single("image"), updateIngredientRules(), validate, ingredientController.updateIngredient);
router.delete("/:id", protect, requireAdmin, ingredientController.deleteIngredient);

module.exports = router;
