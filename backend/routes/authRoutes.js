const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const { registerRules, loginRules, validate } = require("../middlewares/validators/authValidator.js");

router.post("/register", registerRules(), validate, authController.register);
router.post("/login", loginRules(), validate, authController.login);

module.exports = router;
