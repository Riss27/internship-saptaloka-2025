const { body, validationResult } = require("express-validator");

const createIngredientRules = () => {
  return [
    body("name").notEmpty().withMessage("Nama tidak boleh kosong"),
    body("price").isInt({ min: 0 }).withMessage("Harga harus angka dan minimal 0"),
  ];
};

const updateIngredientRules = () => {
  return [
    body("name").notEmpty().withMessage("Nama tidak boleh kosong"),
    body("price").isInt({ min: 0 }).withMessage("Harga harus angka dan minimal 0"),
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
  createIngredientRules,
  updateIngredientRules,
  validate,
};
