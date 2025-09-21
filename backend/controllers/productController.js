const Product = require("../models/Product");

// Controller untuk (READ) - Mendapatkan semua produk DENGAN FILTER
exports.getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filterOptions = {};

    if (category) {
      filterOptions.where = { category: category };
    }

    const products = await Product.findAll(filterOptions);
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
    const { name, description, price, imageUrl, category, linkTokopedia, linkShopee } = req.body;
    const newProduct = await Product.create({
      name,
      description,
      price,
      imageUrl,
      category,
      linkTokopedia,
      linkShopee,
    });
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
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};