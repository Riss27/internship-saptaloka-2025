const Product = require("../models/Product");
const upload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

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
  const uploader = upload.single("image");

  uploader(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ status: "fail", message: err.message || err });
    }
    try {
      const { name, description, price, category, linkTokopedia, linkShopee } = req.body;
      if (!req.file) {
        return res.status(400).json({ status: "fail", message: "Gambar produk wajib diunggah." });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
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
      res.status(500).json({ status: "fail", message: error.message });
    }
  });
};

// Controller untuk (UPDATE) - Memperbarui produk
exports.updateProduct = async (req, res) => {
  const uploader = upload.single("image");

  uploader(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ status: "fail", message: err.message || err });
    }
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ status: "fail", message: "Produk tidak ditemukan." });
      }

      const oldImagePath = product.imageUrl;
      const updateData = { ...req.body };

      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;

        if (oldImagePath) {
          const fullPathOldImage = path.join(__dirname, "..", "public", oldImagePath);

          if (fs.existsSync(fullPathOldImage)) {
            fs.unlink(fullPathOldImage, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Gagal menghapus gambar lama:", unlinkErr);
              } else {
                console.log("Gambar lama berhasil dihapus:", fullPathOldImage);
              }
            });
          }
        }
      }

      await product.update(updateData);
      res.status(200).json({ status: "success", data: product });
    } catch (error) {
      res.status(500).json({ status: "fail", message: error.message });
    }
  });
};

// Controller untuk (DELETE) - Menghapus produk
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ status: "fail", message: "Produk tidak ditemukan." });
    }

    const imagePath = product.imageUrl;

    await product.destroy();

    if (imagePath) {
      const fullPathImage = path.join(__dirname, "..", "public", imagePath);

      if (fs.existsSync(fullPathImage)) {
        fs.unlink(fullPathImage, (err) => {
          if (err) {
            console.error("Gagal menghapus file gambar:", err);
          } else {
            console.log("File gambar berhasil dihapus:", fullPathImage);
          }
        });
      }
    }

    res.status(204).json();
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
