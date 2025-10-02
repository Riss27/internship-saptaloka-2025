const LabTool = require("../models/LabTool");
const upload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

// Controller untuk (CREATE) - Membuat alat lab baru
exports.createLabTool = async (req, res) => {
  const uploader = upload.single("image");

  uploader(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ status: "fail", message: err.message || err });
    }
    try {
      const { name, description, price, linkTokopedia, linkShopee } = req.body;
      if (!req.file) {
        return res.status(400).json({ status: "fail", message: "Gambar wajib diunggah." });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      const newLabTool = await LabTool.create({
        name,
        description,
        price,
        imageUrl,
        linkTokopedia,
        linkShopee,
      });
      res.status(201).json({
        status: "success",
        message: "Alat berhasil ditambahkan!",
        data: newLabTool,
      });
    } catch (error) {
      res.status(500).json({ status: "fail", message: error.message });
    }
  });
};

// Controller untuk (READ) - Mendapatkan semua alat lab
exports.getAllLabTools = async (req, res) => {
  try {
    const labTools = await LabTool.findAll();
    res.status(200).json({
      status: "success",
      data: labTools,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data alat.",
    });
  }
};

// Controller untuk (READ) - Mendapatkan alat lab by ID
exports.getLabToolById = async (req, res) => {
  try {
    const labTool = await LabTool.findByPk(req.params.id);
    if (!labTool) {
      return res.status(404).json({ status: "fail", message: "Alat tidak ditemukan." });
    }
    res.status(200).json({ status: "success", data: labTool });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Controller untuk (UPDATE) - Memperbarui alat lab
exports.updateLabTool = async (req, res) => {
  const uploader = upload.single("image");

  uploader(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ status: "fail", message: err.message || err });
    }
    try {
      const labTool = await LabTool.findByPk(req.params.id);
      if (!labTool) {
        return res.status(404).json({ status: "fail", message: "Alat tidak ditemukan." });
      }

      const oldImagePath = labTool.imageUrl;
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

      await labTool.update(updateData);
      res.status(200).json({ status: "success", data: labTool });
    } catch (error) {
      res.status(500).json({ status: "fail", message: error.message });
    }
  });
};

// Controller untuk (DELETE) - Menghapus alat lab
exports.deleteLabTool = async (req, res) => {
  try {
    const labTool = await LabTool.findByPk(req.params.id);
    if (!labTool) {
      return res.status(404).json({ status: "fail", message: "Alat tidak ditemukan." });
    }
    const imagePath = labTool.imageUrl;
    await labTool.destroy();
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
