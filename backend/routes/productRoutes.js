// backend/routes/productRoutes.js

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController.js");
const upload = require("../middlewares/upload");
const { protect, requireAdmin } = require("../middlewares/authMiddleware");

const { createProductRules, validate } = require("../middlewares/validators/productValidator.js");

// Alamat: GET /api/products/
router.get("/", productController.getAllProducts);

// Alamat: GET /api/products/:id
router.get("/:id", productController.getProductById);

// Alamat: POST /api/products/
router.post("/", protect, requireAdmin, upload.single("image"), createProductRules(), validate, productController.createProduct);

// Alamat: PUT /api/products/:id
router.put("/:id", protect, requireAdmin, upload.single("image"), createProductRules(), validate, productController.updateProduct);

// Alamat: DELETE /api/products/:id
router.delete("/:id", protect, requireAdmin, productController.deleteProduct);

module.exports = router;
