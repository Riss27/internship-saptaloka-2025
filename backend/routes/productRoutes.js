const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
// Impor validator kita
const { createProductRules, validate } = require('../middlewares/validators/productValidator');

// Alamat: GET /api/products/
router.get('/', productController.getAllProducts);

// Alamat: POST /api/products/
// Pasang middleware sebelum controller. createProductRules() untuk aturan, validate untuk eksekusi.
router.post('/', createProductRules(), validate, productController.createProduct);

// Alamat: GET /api/products/:id
router.get('/:id', productController.getProductById);

// Alamat: PUT /api/products/:id
// Aturan validasi bisa dipakai ulang untuk update
router.put('/:id', createProductRules(), validate, productController.updateProduct);

// Alamat: DELETE /api/products/:id
router.delete('/:id', productController.deleteProduct);

module.exports = router;