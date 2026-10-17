const { body, validationResult } = require("express-validator");

const createCategoryRules = () => {
  return [body("name").notEmpty().withMessage("Nama kategori tidak boleh kosong")];
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
    errors: errors.array().map((err) => ({ field: err.path, message: err.msg })),
  });
};

module.exports = {
  createCategoryRules,
  validate,
};
