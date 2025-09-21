const GalleryImage = require("../models/GalleryImage");
const fs = require("fs");
const path = require("path");

// MENDAPATKAN SEMUA GAMBAR
exports.getAllImages = async (req, res) => {
  try {
    const images = await GalleryImage.findAll({ order: [["id", "DESC"]] });
    res.status(200).json({ status: "success", data: images });
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
      imageUrl: req.file.filename, // Simpan nama file dari Multer
    });
    res.status(201).json({ status: "success", data: newImage });
  } catch (error) {
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
    res.status(204).json(); // No Content
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
