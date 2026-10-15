const GalleryImage = require("../models/GalleryImage");
const upload = require("../middlewares/upload");
const { deleteFile } = require("../utils/fileHelper");

// MENDAPATKAN SEMUA GAMBAR
exports.getAllImages = async (req, res) => {
  try {
    const images = await GalleryImage.findAll({ order: [["id", "DESC"]] });
    res.status(200).json({ status: "success", data: images });
  } catch (error) {
    console.error("ERROR di getAllImages:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
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
    console.error("ERROR di getImageById:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

// MEMBUAT GAMBAR BARU (UPLOAD)
exports.createImage = async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file) {
      return res.status(400).json({ status: "fail", message: "Gambar wajib di-upload." });
    }
    // [FIX] Tambahkan /uploads/ di depan nama file
    const newImage = await GalleryImage.create({
      title,
      imageUrl: `/uploads/${req.file.filename}`,
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

    // [FIX] Hapus file gambar dari server menggunakan path yang benar
    deleteFile(image.imageUrl);

    await image.destroy();
    res.status(204).json();
  } catch (error) {
    console.error("ERROR di deleteImage:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};
