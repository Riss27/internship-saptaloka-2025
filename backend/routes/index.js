const express = require("express");
const router = express.Router();

// Impor rute dari file lain
const productRoutes = require("./productRoutes");
const aboutRoutes = require("./aboutRoutes");
const galleryRoutes = require("./galleryRoutes");
const ingredientRoutes = require("./ingredientRoutes");
const labToolRoutes = require("./labToolRoutes");

// Atur agar semua request ke /path sesuai diarahkan ke rute yang benar
router.use("/products", productRoutes);
router.use("/about", aboutRoutes);
router.use("/gallery", galleryRoutes);
router.use("/ingredients", ingredientRoutes);
router.use("/lab-tools", labToolRoutes);

module.exports = router;
