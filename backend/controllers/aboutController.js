const About = require("../models/About");
const fs = require("fs");
const path = require("path");

// Fungsi untuk MENGAMBIL data About
exports.getAboutContent = async (req, res) => {
  try {
    // Cari data 'About'. Standarnya, kita asumsikan hanya ada satu baris data.
    let aboutContent = await About.findOne();

    // Jika belum ada data sama sekali di database, buat baris data kosong
    if (!aboutContent) {
      aboutContent = await About.create({});
    }

    res.status(200).json({
      status: "success",
      data: aboutContent,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
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

    // Simpan path logo lama sebelum diupdate
    const oldLogoPath = aboutContent.logoFooter;
    const updateData = { ...req.body };

    if (req.file) {
      // Path baru akan disimpan di database
      updateData.logoFooter = `/uploads/${req.file.filename}`;

      // Hapus file logo lama jika ada
      if (oldLogoPath) {
        const fullPathOldLogo = path.join(__dirname, "..", "public", oldLogoPath);
        if (fs.existsSync(fullPathOldLogo)) {
          fs.unlink(fullPathOldLogo, (err) => {
            if (err) console.error("Gagal menghapus logo lama:", err);
          });
        }
      }
    }

    await aboutContent.update(updateData);

    res.status(200).json({
      status: "success",
      message: "Informasi 'About' berhasil diperbarui!",
      data: aboutContent,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
