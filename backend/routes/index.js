const express = require("express");
const router = express.Router();

// Impor rute dari file lain
const productRoutes = require("./productRoutes");
const aboutRoutes = require("./aboutRoutes");
const galleryRoutes = require("./galleryRoutes");
const ingredientRoutes = require("./ingredientRoutes");
const labToolRoutes = require("./labToolRoutes");
const landingPageRoutes = require("./landingPageRoutes");
const articleRoutes = require("./articleRoutes");

// Atur agar semua request ke /path sesuai diarahkan ke rute yang benar
router.use("/products", productRoutes);
router.use("/about", aboutRoutes);
router.use("/gallery", galleryRoutes);
router.use("/landing-page", landingPageRoutes);
router.use("/articles", articleRoutes);
router.use("/ingredients", ingredientRoutes);
router.use("/lab-tools", labToolRoutes);

module.exports = router;
