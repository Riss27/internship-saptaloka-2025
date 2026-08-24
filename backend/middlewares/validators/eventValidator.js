const { body, validationResult } = require("express-validator");

const createEventRules = () => {
  return [
    body("title").notEmpty().withMessage("Judul tidak boleh kosong"),
    body("quota").isInt({ min: 1 }).withMessage("Kuota harus angka dan minimal 1"),
    body("location").notEmpty().withMessage("Lokasi tidak boleh kosong"),
  ];
};

const updateEventRules = () => {
  return [
    body("title").notEmpty().withMessage("Judul tidak boleh kosong"),
    body("quota").isInt({ min: 1 }).withMessage("Kuota harus angka dan minimal 1"),
    body("location").notEmpty().withMessage("Lokasi tidak boleh kosong"),
  ];
};

const registerEventRules = () => {
  return [
    body("name").notEmpty().withMessage("Nama tidak boleh kosong"),
    body("email").isEmail().withMessage("Format email tidak valid"),
    body("phone").notEmpty().withMessage("Telepon tidak boleh kosong"),
    body("role").notEmpty().withMessage("Role tidak boleh kosong"),
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
  createEventRules,
  updateEventRules,
  registerEventRules,
  validate,
};
