const productService = require("../services/productService");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts(req.query);
    res.status(200).json({ status: "success", data: products });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Gagal mengambil data produk." });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: "fail", message: "Produk tidak ditemukan." });
    }
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json({
      status: "success",
      message: "Produk berhasil ditambahkan!",
      data: newProduct,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ status: "fail", message: "Produk tidak ditemukan." });
    }
    res.status(200).json({ status: "success", data: updatedProduct });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    if (result === 0) {
      return res.status(404).json({ status: "fail", message: "Produk tidak ditemukan." });
    }
    res.status(204).json(); // 204 No Content untuk delete sukses
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
