const { body, validationResult } = require("express-validator");

const registerRules = () => {
  return [
    body("name").notEmpty().withMessage("Nama tidak boleh kosong"),
    body("email").isEmail().withMessage("Format email tidak valid"),
    body("password").isLength({ min: 6 }).withMessage("Password minimal 6 karakter"),
  ];
};

const loginRules = () => {
  return [
    body("email").isEmail().withMessage("Format email tidak valid"),
    body("password").notEmpty().withMessage("Password tidak boleh kosong"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = errors
    .array()
    .map((err) => err.msg)
    .join(", ");
  return res.status(400).json({
    status: "fail",
    message: extractedErrors,
  });
};

module.exports = {
  registerRules,
  loginRules,
  validate,
};
