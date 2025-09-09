const Product = require("../models/Product");

// Controller untuk (READ) - Mendapatkan semua produk
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data produk.",
    });
  }
};

// Controller untuk (READ) - Mendapatkan produk by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ status: "fail", message: "Produk tidak ditemukan." });
    }
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Controller untuk (CREATE) - Membuat produk baru
exports.createProduct = async (req, res) => {
  try {
    // Mengambil data dari body request
    const { name, description, price, imageUrl } = req.body;
    const newProduct = await Product.create({ name, description, price, imageUrl });
    res.status(201).json({
      status: "success",
      message: "Produk berhasil ditambahkan!",
      data: newProduct,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Controller untuk (UPDATE) - Memperbarui produk
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ status: "fail", message: "Produk tidak ditemukan." });
    }
    await product.update(req.body);
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Controller untuk (DELETE) - Menghapus produk
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ status: "fail", message: "Produk tidak ditemukan." });
    }
    await product.destroy();
    res.status(204).json(); // 204 No Content -> sukses tapi tidak ada data balikan
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
