const { body, validationResult } = require("express-validator");

const createWorkshopRules = () => {
  return [
    body("title").notEmpty().withMessage("Judul tidak boleh kosong"),
    body("description").notEmpty().withMessage("Deskripsi tidak boleh kosong"),
  ];
};

const updateWorkshopRules = () => {
  return [
    body("title").notEmpty().withMessage("Judul tidak boleh kosong"),
    body("description").notEmpty().withMessage("Deskripsi tidak boleh kosong"),
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
  createWorkshopRules,
  updateWorkshopRules,
  validate,
};
