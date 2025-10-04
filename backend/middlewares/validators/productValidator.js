const { body, validationResult } = require("express-validator");

// Aturan validasi untuk membuat produk baru
const createProductRules = () => {
  return [
    body("name").notEmpty().withMessage("Nama produk tidak boleh kosong"),
    body("price").isInt({ min: 1 }).withMessage("Harga harus angka dan minimal 1"),
    body("description").notEmpty().withMessage("Deskripsi tidak boleh kosong"),
    body("category").isIn(["Parfum", "Aromaterapi"]).withMessage("Kategori tidak valid"),
    body("linkTokopedia").optional({ checkFalsy: true }).isURL({ require_protocol: false, require_host: true }).withMessage("Link Tokopedia harus URL yang valid"),
    body("linkShopee").optional({ checkFalsy: true }).isURL({ require_protocol: false, require_host: true }).withMessage("Link Shopee harus URL yang valid"),
  ];
};

// Fungsi untuk menangani error validasi
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
  createProductRules,
  validate,
};
