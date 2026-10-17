const { body, validationResult } = require("express-validator");

const createArticleRules = () => {
  return [
    body("title").notEmpty().withMessage("Judul tidak boleh kosong"),
    body("author").notEmpty().withMessage("Penulis tidak boleh kosong"),
    body("mainDescription").notEmpty().withMessage("Deskripsi utama tidak boleh kosong"),
  ];
};

const updateArticleRules = () => {
  return [
    body("title").notEmpty().withMessage("Judul tidak boleh kosong"),
    body("author").notEmpty().withMessage("Penulis tidak boleh kosong"),
    body("mainDescription").notEmpty().withMessage("Deskripsi utama tidak boleh kosong"),
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
    // Detail per-field untuk frontend (field = path express-validator)
    errors: errors.array().map((err) => ({ field: err.path, message: err.msg })),
  });
};

module.exports = {
  createArticleRules,
  updateArticleRules,
  validate,
};
