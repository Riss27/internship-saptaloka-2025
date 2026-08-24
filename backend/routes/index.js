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
const eventRoutes = require("./eventRoutes");
const workshopRoutes = require("./workshopRoutes");
const categoryRoutes = require("./categoryRoutes");
const authRoutes = require("./authRoutes");
const translateRoutes = require("./translateRoutes");

// Rute publik
router.use("/auth", authRoutes);
router.use("/translate", translateRoutes);
router.use("/products", productRoutes);
router.use("/articles", articleRoutes);
router.use("/events", eventRoutes);
router.use("/workshops", workshopRoutes);
router.use("/ingredients", ingredientRoutes);
router.use("/lab-tools", labToolRoutes);
router.use("/gallery", galleryRoutes);
router.use("/landing-page", landingPageRoutes);
router.use("/categories", categoryRoutes);
router.use("/about", aboutRoutes);

module.exports = router;
