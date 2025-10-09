const GalleryImage = require("../models/GalleryImage");
const fs = require("fs");
const path = require("path");
const upload = require("../middlewares/upload");

// Helper untuk menghapus file
const deleteFile = (filePath) => {
  if (filePath) {
    const fullPath = path.join(__dirname, "..", "public", filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlink(fullPath, (err) => {
        if (err) console.error(`Gagal menghapus file: ${fullPath}`, err);
      });
    }
  }
};

// MENDAPATKAN SEMUA GAMBAR
exports.getAllImages = async (req, res) => {
  try {
    const images = await GalleryImage.findAll({ order: [["id", "DESC"]] });
    res.status(200).json({ status: "success", data: images });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// MENDAPATKAN GAMBAR BERDASARKAN ID
exports.getImageById = async (req, res) => {
  try {
    const image = await GalleryImage.findByPk(req.params.id);
    if (!image) {
      return res.status(404).json({ status: "fail", message: "Gambar tidak ditemukan." });
    }
    res.status(200).json({ status: "success", data: image });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// MEMBUAT GAMBAR BARU (UPLOAD)
exports.createImage = async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file) {
      return res.status(400).json({ status: "fail", message: "Gambar wajib di-upload." });
    }
    const newImage = await GalleryImage.create({
      title,
      imageUrl: req.file.filename,
    });
    res.status(201).json({ status: "success", data: newImage });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// MEMPERBARUI GAMBAR (JUDUL + GAMBAR)
exports.updateImage = async (req, res) => {
  try {
    const image = await GalleryImage.findByPk(req.params.id);
    if (!image) {
      return res.status(404).json({ status: "fail", message: "Gambar tidak ditemukan." });
    }

    const oldImagePath = image.imageUrl;
    const updateData = {
      title: req.body.title,
    };

    if (req.file) {
      deleteFile(oldImagePath);
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    await image.update(updateData);
    res.status(200).json({ status: "success", data: image });
  } catch (error) {
    if (req.file) {
      deleteFile(`/uploads/${req.file.filename}`);
    }
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// MENGHAPUS GAMBAR
exports.deleteImage = async (req, res) => {
  try {
    const image = await GalleryImage.findByPk(req.params.id);
    if (!image) {
      return res.status(404).json({ status: "fail", message: "Gambar tidak ditemukan." });
    }

    // Hapus file gambar dari server
    const imagePath = path.join(__dirname, "..", "public", "uploads", image.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await image.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
