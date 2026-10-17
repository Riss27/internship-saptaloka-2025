const Product = require("../models/Product");
const upload = require("../middlewares/upload");
const fs = require("fs");
const path = require("path");
const { getPagination } = require("../utils/pagination");
const { searchWhere } = require("../utils/search");
const { getSort } = require("../utils/sort");
const { parseIds } = require("../utils/ids");

// Controller untuk (READ) - Mendapatkan semua produk DENGAN FILTER
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    const filterOptions = {
      where: {
        ...(category && { category }),
        ...searchWhere(search, ["name", "description", "category"]),
      },
    };

    // Default: tanpa ORDER (perilaku lama dipertahankan)
    const order = getSort(req.query, ["name", "createdAt", "price"], undefined);
    if (order) {
      filterOptions.order = order;
    }

    const pagination = getPagination(req.query);
    let data;
    let meta;
    if (pagination) {
      filterOptions.limit = pagination.limit;
      filterOptions.offset = pagination.offset;
      const { rows, count } = await Product.findAndCountAll(filterOptions);
      data = rows;
      meta = { page: pagination.page, limit: pagination.limit, total: count, totalPages: Math.ceil(count / pagination.limit) };
    } else {
      data = await Product.findAll(filterOptions);
    }
    res.status(200).json({
      status: "success",
      data,
      ...(meta && { meta }),
    });
  } catch (error) {
    // Tambahkan ini untuk melihat error detail di terminal backend
    console.error("ERROR di getAllProducts:", error);
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
    console.error("ERROR di getProductById:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

// Controller untuk (CREATE) - Membuat produk baru
exports.createProduct = async (req, res) => {
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
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error("ERROR di createProduct:", error);
    res.status(500).json({ status: "fail", message: "Terjadi kesalahan pada server." });
  }
};

// Controller untuk (UPDATE) - Memperbarui produk
exports.updateProduct = async (req, res) => {
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
          fs.unlink(fullPathOldImage, (err) => {
            if (err) console.error("Gagal hapus gambar lama:", err);
          });
        }
      }
    }

    await product.update(updateData);
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    console.error("ERROR di updateProduct:", error);
    res.status(500).json({ status: "fail", message: "Terjadi kesalahan pada server." });
  }
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
    console.error("ERROR di deleteProduct:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

// Controller untuk (DELETE) - Menghapus banyak produk sekaligus
exports.bulkDeleteProducts = async (req, res) => {
  try {
    const { ids, error: idsError } = parseIds(req.body.ids);
    if (idsError) {
      return res.status(400).json({ status: "fail", message: idsError });
    }

    const products = await Product.findAll({ where: { id: ids }, attributes: ["id", "imageUrl"] });
    const deleted = await Product.destroy({ where: { id: ids } });

    // Pola sama dengan deleteProduct: hapus file gambar best-effort
    products.forEach((product) => {
      if (!product.imageUrl) return;
      const fullPathImage = path.join(__dirname, "..", "public", product.imageUrl);
      if (fs.existsSync(fullPathImage)) {
        fs.unlink(fullPathImage, (err) => {
          if (err) console.error("Gagal menghapus file gambar:", err);
        });
      }
    });

    res.status(200).json({ status: "success", deleted });
  } catch (error) {
    console.error("ERROR di bulkDeleteProducts:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};
