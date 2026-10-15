const express = require("express");
const router = express.Router();
const translateController = require("../controllers/translateController");
const { translateLimiter } = require("../middlewares/rateLimiter");

router.post("/", translateLimiter, translateController.translateText);

module.exports = router;
