const LandingPage = require("../models/LandingPage");
const upload = require("../middlewares/upload");
const fs = require("fs");
const path = require("path");

// Mendapatkan semua slide
exports.getAllSlides = async (req, res) => {
  try {
    const slides = await LandingPage.findAll();
    res.status(200).json({ status: "success", data: slides });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Mendapatkan satu slide by ID
exports.getSlideById = async (req, res) => {
  try {
    const slide = await LandingPage.findByPk(req.params.id);
    if (!slide) {
      return res.status(404).json({ status: "fail", message: "Slide tidak ditemukan." });
    }
    res.status(200).json({ status: "success", data: slide });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Membuat slide baru
exports.createSlide = async (req, res) => {
  const uploader = upload.single("image");
  uploader(req, res, async function (err) {
    if (err) return res.status(400).json({ status: "fail", message: err });
    try {
      const { heading, paragraph } = req.body;
      if (!req.file) {
        return res.status(400).json({ status: "fail", message: "Gambar wajib diunggah." });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      const newSlide = await LandingPage.create({ heading, paragraph, imageUrl });
      res.status(201).json({ status: "success", data: newSlide });
    } catch (error) {
      res.status(500).json({ status: "fail", message: error.message });
    }
  });
};

// Memperbarui slide
exports.updateSlide = async (req, res) => {
  const uploader = upload.single("image");
  uploader(req, res, async function (err) {
    if (err) return res.status(400).json({ status: "fail", message: err });
    try {
      const slide = await LandingPage.findByPk(req.params.id);
      if (!slide) {
        return res.status(404).json({ status: "fail", message: "Slide tidak ditemukan." });
      }
      const oldImagePath = slide.imageUrl;
      const updateData = { ...req.body };
      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
        if (oldImagePath) {
          const fullPathOldImage = path.join(__dirname, "..", "public", oldImagePath);
          if (fs.existsSync(fullPathOldImage)) {
            fs.unlink(fullPathOldImage, (e) => {
              if (e) console.error("Gagal hapus gambar lama:", e);
            });
          }
        }
      }
      await slide.update(updateData);
      res.status(200).json({ status: "success", data: slide });
    } catch (error) {
      res.status(500).json({ status: "fail", message: error.message });
    }
  });
};

// Menghapus slide
exports.deleteSlide = async (req, res) => {
  try {
    const slide = await LandingPage.findByPk(req.params.id);
    if (!slide) {
      return res.status(404).json({ status: "fail", message: "Slide tidak ditemukan." });
    }
    const imagePath = slide.imageUrl;
    await slide.destroy();
    if (imagePath) {
      const fullPathImage = path.join(__dirname, "..", "public", imagePath);
      if (fs.existsSync(fullPathImage)) {
        fs.unlink(fullPathImage, (e) => {
          if (e) console.error("Gagal hapus file gambar:", e);
        });
      }
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
