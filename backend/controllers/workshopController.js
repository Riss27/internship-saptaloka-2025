const { Workshop, Event } = require("../models");
const upload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");
const sequelize = require("../config/database");

// Hapus file secara fisik dari folder public/uploads
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

// Controller Workshop

// Ambil semua workshop + daftar event terkait
exports.getAllWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.findAll({
      include: {
        model: Event,
        as: "Events",
        attributes: ["id", "title", "startDateTime"],
        through: { attributes: [] },
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: "success", data: workshops });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Ambil detail workshop berdasarkan ID
exports.getWorkshopById = async (req, res) => {
  try {
    const workshop = await Workshop.findByPk(req.params.id, {
      include: { model: Event, as: "Events" },
    });
    if (!workshop) {
      return res.status(404).json({ status: "fail", message: "Workshop tidak ditemukan." });
    }
    res.status(200).json({ status: "success", data: workshop });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Buat workshop baru + upload poster + relasi ke event
exports.createWorkshop = async (req, res) => {
  const uploader = upload.single("imageUrl");

  uploader(req, res, async function (err) {
    const t = await sequelize.transaction();
    if (err) return res.status(400).json({ status: "fail", message: err.message || err });

    try {
      const { title, description, status, eventIds } = req.body;

      if (!req.file) {
        return res.status(400).json({ status: "fail", message: "Gambar poster workshop wajib diunggah." });
      }
      const imageUrl = `/uploads/${req.file.filename}`;

      const newWorkshop = await Workshop.create({ title, description, status, imageUrl }, { transaction: t });

      // Set relasi event jika ada
      if (eventIds) {
        const parsedEventIds = JSON.parse(eventIds);
        if (Array.isArray(parsedEventIds) && parsedEventIds.length > 0) {
          await newWorkshop.setEvents(parsedEventIds, { transaction: t });
        }
      }

      await t.commit();
      res.status(201).json({ status: "success", data: newWorkshop });
    } catch (error) {
      await t.rollback();
      if (req.file) deleteFile(`/uploads/${req.file.filename}`);
      res.status(500).json({ status: "fail", message: error.message });
    }
  });
};

// Hapus workshop + file poster
exports.deleteWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findByPk(req.params.id);
    if (!workshop) {
      return res.status(404).json({ status: "fail", message: "Workshop tidak ditemukan." });
    }
    deleteFile(workshop.imageUrl);
    await workshop.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Update workshop
// Update workshop (edit data, ganti poster, update relasi event)
exports.updateWorkshop = async (req, res) => {
  const uploader = upload.single("imageUrl");

  uploader(req, res, async function (err) {
    const t = await sequelize.transaction();
    if (err) return res.status(400).json({ status: "fail", message: err.message || err });

    try {
      const workshop = await Workshop.findByPk(req.params.id, { transaction: t });
      if (!workshop) {
        await t.rollback();
        return res.status(404).json({ status: "fail", message: "Workshop tidak ditemukan." });
      }

      const { title, description, status, eventIds } = req.body;
      let imageUrl = workshop.imageUrl;

      // Jika ada poster baru, hapus yang lama lalu ganti
      if (req.file) {
        deleteFile(workshop.imageUrl);
        imageUrl = `/uploads/${req.file.filename}`;
      }

      // Update data workshop
      await workshop.update({ title, description, status, imageUrl }, { transaction: t });

      // Update relasi event
      if (eventIds) {
        const parsedEventIds = JSON.parse(eventIds);
        await workshop.setEvents(parsedEventIds, { transaction: t });
      }

      await t.commit();
      res.status(200).json({ status: "success", data: workshop });
    } catch (error) {
      await t.rollback();
      if (req.file) deleteFile(`/uploads/${req.file.filename}`);
      res.status(500).json({ status: "fail", message: error.message });
    }
  });
};
