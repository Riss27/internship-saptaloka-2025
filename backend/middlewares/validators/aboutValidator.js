const { body, validationResult } = require("express-validator");

const updateAboutRules = () => {
  return [
    body().custom((value, { req }) => {
      const allowedFields = ["about", "address", "phone", "email", "instagram", "whatsapp"];
      const hasAtLeastOne = allowedFields.some((field) => req.body[field] !== undefined && req.body[field] !== "");
      if (!hasAtLeastOne) {
        throw new Error("Minimal satu field harus diisi");
      }
      return true;
    }),
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
  updateAboutRules,
  validate,
};
