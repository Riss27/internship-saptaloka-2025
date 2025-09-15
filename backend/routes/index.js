const express = require("express");
const router = express.Router();

// Impor rute produk
const productRoutes = require("./productRoutes");
const aboutRoutes = require('./aboutRoutes');

// Atur agar semua request ke /products diarahkan ke productRoutes
router.use("/products", productRoutes);
router.use("/about", aboutRoutes);

// Jika nanti ada rute lain (misal: users), bisa ditambahkan di sini
// router.use('/users', userRoutes);

module.exports = router;
