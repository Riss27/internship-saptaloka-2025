const Workshop = require("../models/Workshop");
const Event = require("../models/Event");
const upload = require("../middlewares/upload");
const sequelize = require("../config/database");
const { deleteFile } = require("../utils/fileHelper");
const { getPagination } = require("../utils/pagination");

// Controller Workshop
// Ambil semua workshop + daftar event terkait (sudah ada filter kategori)
exports.getAllWorkshops = async (req, res) => {
  try {
    const { category, source } = req.query;

    const filterOptions = {
      include: {
        model: Event,
        as: "Events",
        attributes: ["id", "title", "startDateTime", "imageBannerUrl"],
        through: { attributes: [] },
      },
      order: [["createdAt", "DESC"]],
    };

    if (category) {
      filterOptions.where = { category: category };
    }

    if (source !== "admin") {
      filterOptions.limit = 1;
    }

    const pagination = getPagination(req.query);
    let data;
    let meta;
    if (pagination) {
      filterOptions.limit = pagination.limit;
      filterOptions.offset = pagination.offset;
      filterOptions.distinct = true;
      const { rows, count } = await Workshop.findAndCountAll(filterOptions);
      data = rows;
      meta = { page: pagination.page, limit: pagination.limit, total: count, totalPages: Math.ceil(count / pagination.limit) };
    } else {
      data = await Workshop.findAll(filterOptions);
    }
    res.status(200).json({ status: "success", data, ...(meta && { meta }) });
  } catch (error) {
    console.error("ERROR di getAllWorkshops:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
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
    console.error("ERROR di getWorkshopById:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

// Buat workshop baru + upload poster + relasi ke event
exports.createWorkshop = async (req, res) => {
  const t = await sequelize.transaction();
  try {
      // UBAH: Tambahkan `category` di sini
      const { title, description, eventIds, category } = req.body;

      if (!req.file) {
        return res.status(400).json({ status: "fail", message: "Gambar poster workshop wajib diunggah." });
      }
      const imageUrl = `/uploads/${req.file.filename}`;

      // UBAH: Tambahkan `category` saat membuat workshop baru
      const newWorkshop = await Workshop.create({ title, description, imageUrl, category }, { transaction: t });

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
    console.error("ERROR di createWorkshop:", error);
    res.status(500).json({ status: "fail", message: "Terjadi kesalahan pada server." });
  }
};

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
    console.error("ERROR di deleteWorkshop:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

// Update workshop
exports.updateWorkshop = async (req, res) => {
  const t = await sequelize.transaction();
  try {
      const workshop = await Workshop.findByPk(req.params.id, { transaction: t });
      if (!workshop) {
        await t.rollback();
        return res.status(404).json({ status: "fail", message: "Workshop tidak ditemukan." });
      }

      // UBAH: Tambahkan `category` di sini
      const { title, description, eventIds, category } = req.body;
      let imageUrl = workshop.imageUrl;

      if (req.file) {
        deleteFile(workshop.imageUrl);
        imageUrl = `/uploads/${req.file.filename}`;
      }

      // UBAH: Tambahkan `category` saat update data
      await workshop.update({ title, description, imageUrl, category }, { transaction: t });

      if (eventIds) {
        const parsedEventIds = JSON.parse(eventIds);
        await workshop.setEvents(parsedEventIds, { transaction: t });
      }

      await t.commit();
      res.status(200).json({ status: "success", data: workshop });
  } catch (error) {
    await t.rollback();
    if (req.file) deleteFile(`/uploads/${req.file.filename}`);
    console.error("ERROR di updateWorkshop:", error);
    res.status(500).json({ status: "fail", message: "Terjadi kesalahan pada server." });
  }
};
