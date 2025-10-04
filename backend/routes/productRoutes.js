// backend/routes/productRoutes.js

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController.js");
const upload = require("../middlewares/upload");

const { createProductRules, validate } = require("../middlewares/validators/productValidator.js");

// Alamat: GET /api/products/
router.get("/", productController.getAllProducts);

// Alamat: POST /api/products/
router.post("/", upload.single("image"), createProductRules(), validate, productController.createProduct);

// Alamat: GET /api/products/:id
router.get("/:id", productController.getProductById);

// Alamat: PUT /api/products/:id
router.put("/:id", upload.single("image"), createProductRules(), validate, productController.updateProduct);

// Alamat: DELETE /api/products/:id
router.delete("/:id", productController.deleteProduct);

module.exports = router;
