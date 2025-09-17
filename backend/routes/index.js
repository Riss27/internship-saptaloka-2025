const express = require("express");
const router = express.Router();

// Impor rute produk
const productRoutes = require("./productRoutes");
const aboutRoutes = require("./aboutRoutes");
const galleryRoutes = require("./galleryRoutes");

// Atur agar semua request ke /products diarahkan ke productRoutes
router.use("/products", productRoutes);
router.use("/about", aboutRoutes);
router.use("/gallery", galleryRoutes);

module.exports = router;
