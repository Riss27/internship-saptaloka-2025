const { body, validationResult } = require("express-validator");

// Aturan validasi untuk membuat produk baru
const createProductRules = () => {
  return [
    body("name").notEmpty().withMessage("Nama produk tidak boleh kosong"),
    body("price").isInt({ min: 1 }).withMessage("Harga harus angka dan minimal 1"),
    body("description").notEmpty().withMessage("Deskripsi tidak boleh kosong"),
    body("category").isIn(["Parfum", "Aromaterapi"]).withMessage("Kategori tidak valid"),
    body("linkTokopedia").isURL().optional({ checkFalsy: true }).withMessage("Link Tokopedia harus URL yang valid"),
    body("linkShopee").isURL().optional({ checkFalsy: true }).withMessage("Link Shopee harus URL yang valid"),
  ];
};

// Fungsi untuk menangani error validasi
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ status: "fail", errors: errors.array() });
};

module.exports = {
  createProductRules,
  validate,
};
