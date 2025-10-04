const Ingredient = require("../models/Ingredient");
const upload = require("../middlewares/upload");
const fs = require("fs");
const path = require("path");

// Controller untuk (CREATE) - Membuat ingredient baru
exports.createIngredient = async (req, res) => {
  const uploader = upload.single("image");

  uploader(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ status: "fail", message: err.message || err });
    }
    try {
      const { name, description, price, category, linkTokopedia, linkShopee } = req.body;
      if (!req.file) {
        return res.status(400).json({ status: "fail", message: "Gambar wajib diunggah." });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      const newIngredient = await Ingredient.create({
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
        message: "Bahan berhasil ditambahkan!",
        data: newIngredient,
      });
    } catch (error) {
      res.status(500).json({ status: "fail", message: error.message });
    }
  });
};

// Controller untuk (READ) - Mendapatkan semua ingredient
exports.getAllIngredients = async (req, res) => {
  try {
    // Ambil query 'category' dari URL
    const { category } = req.query;
    const filterOptions = {};

    // Jika ada query 'category', tambahkan kondisi 'where'
    if (category) {
      filterOptions.where = { category: category };
    }

    // Lakukan pencarian dengan opsi filter
    const ingredients = await Ingredient.findAll(filterOptions);
    res.status(200).json({
      status: "success",
      data: ingredients,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data bahan.",
    });
  }
};

// Controller untuk (READ) - Mendapatkan ingredient by ID
exports.getIngredientById = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByPk(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ status: "fail", message: "Bahan tidak ditemukan." });
    }
    res.status(200).json({ status: "success", data: ingredient });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Controller untuk (UPDATE) - Memperbarui ingredient
exports.updateIngredient = async (req, res) => {
  const uploader = upload.single("image");

  uploader(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ status: "fail", message: err.message || err });
    }
    try {
      const ingredient = await Ingredient.findByPk(req.params.id);
      if (!ingredient) {
        return res.status(404).json({ status: "fail", message: "Bahan tidak ditemukan." });
      }

      const oldImagePath = ingredient.imageUrl;
      const updateData = { ...req.body };

      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
        if (oldImagePath) {
          const fullPathOldImage = path.join(__dirname, "..", "public", oldImagePath);
          if (fs.existsSync(fullPathOldImage)) {
            fs.unlink(fullPathOldImage, (unlinkErr) => {
              if (unlinkErr) console.error("Gagal hapus gambar lama:", unlinkErr);
              else console.log("Gambar lama berhasil dihapus.");
            });
          }
        }
      }

      await ingredient.update(updateData);
      res.status(200).json({ status: "success", data: ingredient });
    } catch (error) {
      res.status(500).json({ status: "fail", message: error.message });
    }
  });
};

// Controller untuk (DELETE) - Menghapus ingredient
exports.deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByPk(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ status: "fail", message: "Bahan tidak ditemukan." });
    }
    const imagePath = ingredient.imageUrl;
    await ingredient.destroy();
    if (imagePath) {
      const fullPathImage = path.join(__dirname, "..", "public", imagePath);
      if (fs.existsSync(fullPathImage)) {
        fs.unlink(fullPathImage, (err) => {
          if (err) console.error("Gagal hapus file gambar:", err);
          else console.log("File gambar berhasil dihapus.");
        });
      }
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
