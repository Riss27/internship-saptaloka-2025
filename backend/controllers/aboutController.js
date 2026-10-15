const About = require("../models/About");
const { deleteFile } = require("../utils/fileHelper");

// Field yang boleh diubah lewat request (whitelist, mencegah mass assignment)
const ALLOWED_FIELDS = ["about", "address", "phone", "email", "instagram", "whatsapp", "logoFooter"];

// Fungsi untuk MENGAMBIL data About (read-only: tidak membuat baris baru)
exports.getAboutContent = async (req, res) => {
  try {
    const aboutContent = await About.findOne();

    res.status(200).json({
      status: "success",
      data: aboutContent,
    });
  } catch (error) {
    console.error("ERROR di getAboutContent:", error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server.",
    });
  }
};

// Fungsi untuk MEMPERBARUI data About
exports.updateAboutContent = async (req, res) => {
  try {
    const aboutContent = await About.findOne();
    if (!aboutContent) {
      return res.status(404).json({ status: "fail", message: 'Konten "About" tidak ditemukan.' });
    }

    const oldLogoPath = aboutContent.logoFooter;

    // Hanya ambil field yang diizinkan, buang undefined
    const updateData = Object.fromEntries(
      Object.entries(req.body).filter(([key, value]) => ALLOWED_FIELDS.includes(key) && value !== undefined)
    );

    if (req.file) {
      updateData.logoFooter = `/uploads/${req.file.filename}`;
      deleteFile(oldLogoPath);
    }

    await aboutContent.update(updateData);

    res.status(200).json({
      status: "success",
      message: "Informasi 'About' berhasil diperbarui!",
      data: aboutContent,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ status: "fail", message: error.errors.map((e) => e.message).join(", ") });
    }
    console.error("ERROR di updateAboutContent:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};
