const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Alamat: GET /api/products/
// Fungsi: Mengambil semua produk
router.get("/", productController.getAllProducts);

// Alamat: POST /api/products/
// Fungsi: Membuat produk baru
router.post("/", productController.createProduct);

// Alamat: GET /api/products/:id
// Fungsi: Mengambil satu produk berdasarkan ID
router.get("/:id", productController.getProductById);

// Alamat: PUT /api/products/:id
// Fungsi: Memperbarui produk berdasarkan ID
router.put("/:id", productController.updateProduct);

// Alamat: DELETE /api/products/:id
// Fungsi: Menghapus produk berdasarkan ID
router.delete("/:id", productController.deleteProduct);

module.exports = router;
