const express = require("express");
const router = express.Router();

// Impor rute produk
const productRoutes = require("./productRoutes");

// Atur agar semua request ke /products diarahkan ke productRoutes
router.use("/products", productRoutes);

// Jika nanti ada rute lain (misal: users), bisa ditambahkan di sini
// router.use('/users', userRoutes);

module.exports = router;
