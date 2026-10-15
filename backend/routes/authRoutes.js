const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const { registerRules, loginRules, validate } = require("../middlewares/validators/authValidator.js");
const { loginLimiter, registerAccountLimiter } = require("../middlewares/rateLimiter");

router.post("/register", registerAccountLimiter, registerRules(), validate, authController.register);
router.post("/login", loginLimiter, loginRules(), validate, authController.login);

module.exports = router;
