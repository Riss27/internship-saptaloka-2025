const { body, validationResult } = require("express-validator");

const createSlideRules = () => {
  return [
    body("heading").notEmpty().withMessage("Heading tidak boleh kosong"),
    body("paragraph").notEmpty().withMessage("Paragraph tidak boleh kosong"),
  ];
};

const updateSlideRules = () => {
  return [
    body("heading").notEmpty().withMessage("Heading tidak boleh kosong"),
    body("paragraph").notEmpty().withMessage("Paragraph tidak boleh kosong"),
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
  createSlideRules,
  updateSlideRules,
  validate,
};
