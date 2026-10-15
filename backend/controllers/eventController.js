const Event = require("../models/Event");
const EventContent = require("../models/EventContent");
const EventRegistration = require("../models/EventRegistration");
const { deleteFile } = require("../utils/fileHelper");
const { getPagination } = require("../utils/pagination");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

// Buang origin dari URL gambar yang dikirim client, simpan sebagai path relatif
// (mis. "http://localhost:3000/uploads/x.png" -> "/uploads/x.png")
const toRelativeUploadPath = (url) => (typeof url === "string" ? url.replace(/^https?:\/\/[^/]+/, "") : url);

exports.getAllEvents = async (req, res) => {
  try {
    const { search } = req.query;

    const options = {
      order: [["startDateTime", "DESC"]],
      // Subquery korrelated: aman dipakai bersama limit/offset (group+include
      // membuat Sequelize memecah query ke derived table yang kehilangan join)
      attributes: {
        include: [
          [
            sequelize.literal(
              "(SELECT COUNT(*) FROM `EventRegistrations` WHERE `EventRegistrations`.`EventId` = `Event`.`id`)"
            ),
            "registeredCount",
          ],
        ],
      },
    };

    if (search) {
      options.where = {
        title: {
          [Op.like]: `%${search}%`,
        },
      };
    }

    const pagination = getPagination(req.query);
    let data;
    let meta;
    if (pagination) {
      options.limit = pagination.limit;
      options.offset = pagination.offset;
      data = await Event.findAll(options);
      const total = await Event.count({ where: options.where });
      meta = { page: pagination.page, limit: pagination.limit, total, totalPages: Math.ceil(total / pagination.limit) };
    } else {
      data = await Event.findAll(options);
    }
    res.status(200).json({ status: "success", data, ...(meta && { meta }) });
  } catch (error) {
    console.error("ERROR di getAllEvents:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{ model: EventContent, as: "EventContents" }],
      order: [["EventContents", "id", "ASC"]],
    });

    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event tidak ditemukan." });
    }

    // Endpoint publik: hanya kirim jumlah pendaftar, bukan data pendaftar (PII)
    const registeredCount = await EventRegistration.count({ where: { EventId: event.id } });
    const payload = { ...event.toJSON(), registeredCount };

    res.status(200).json({ status: "success", data: payload });
  } catch (error) {
    console.error("ERROR di getEventById:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

// Data pendaftar (nama, email, telepon) hanya untuk admin
exports.getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      attributes: ["id", "title", "quota"],
      include: [
        {
          model: EventRegistration,
          as: "EventRegistrations",
          attributes: ["id", "name", "email", "phone", "role", "createdAt"],
        },
      ],
      order: [["EventRegistrations", "createdAt", "ASC"]],
    });

    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event tidak ditemukan." });
    }
    res.status(200).json({ status: "success", data: event });
  } catch (error) {
    console.error("ERROR di getEventRegistrations:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

exports.createEvent = async (req, res) => {
  const t = await sequelize.transaction();
  try {
      const { title, quota, location, fee, description, startDateTime, endDateTime, participantRoles, contents, category, status } = req.body;
      if (!req.files || !req.files.imageBanner) {
        return res.status(400).json({ status: "fail", message: "Image Banner wajib diunggah." });
      }
      const imageBannerUrl = `/uploads/${req.files.imageBanner[0].filename}`;
      const newEvent = await Event.create(
        {
          title,
          quota,
          location,
          fee,
          description,
          imageBannerUrl,
          startDateTime,
          endDateTime,
          participantRoles: JSON.parse(participantRoles || "[]"),
          category,
          status,
        },
        { transaction: t }
      );
      const parsedContents = JSON.parse(contents || "[]");
      const contentImages = req.files.contentImages || [];
      let imageIndex = 0;
      const contentRows = [];
      for (const content of parsedContents) {
        const imageUrls = [];
        const imageCount = content.imageCount || 0;
        for (let i = 0; i < imageCount; i++) {
          if (contentImages[imageIndex]) {
            imageUrls.push(`/uploads/${contentImages[imageIndex].filename}`);
            imageIndex++;
          }
        }
        contentRows.push({
          header: content.header,
          content: content.content,
          imageUrls: imageUrls.length > 0 ? JSON.stringify(imageUrls) : null,
          EventId: newEvent.id,
        });
      }
      if (contentRows.length > 0) {
        await EventContent.bulkCreate(contentRows, { transaction: t });
      }
      await t.commit();
      res.status(201).json({ status: "success", data: newEvent });
  } catch (error) {
    await t.rollback();
    if (req.files?.imageBanner) deleteFile(`/uploads/${req.files.imageBanner[0].filename}`);
    if (req.files?.contentImages) req.files.contentImages.forEach((f) => deleteFile(`/uploads/${f.filename}`));
    console.error("ERROR di createEvent:", error);
    res.status(500).json({ status: "fail", message: "Terjadi kesalahan pada server." });
  }
};

exports.updateEvent = async (req, res) => {
  const t = await sequelize.transaction();
  try {
      const event = await Event.findByPk(req.params.id, { include: ["EventContents"], transaction: t });
      if (!event) {
        await t.rollback();
        return res.status(404).json({ status: "fail", message: "Event tidak ditemukan." });
      }
      const { title, quota, location, fee, description, startDateTime, endDateTime, participantRoles, category, status } = req.body;
      let imageBannerUrl = event.imageBannerUrl;
      // File lama dihapus hanya SETELAH commit sukses; kalau rollback, file tetap ada
      const filesToDelete = [];
      if (req.files?.imageBanner) {
        filesToDelete.push(event.imageBannerUrl);
        imageBannerUrl = `/uploads/${req.files.imageBanner[0].filename}`;
      }
      await event.update({ title, quota, location, fee, description, startDateTime, endDateTime, imageBannerUrl, participantRoles: JSON.parse(participantRoles || "[]"), category, status }, { transaction: t });
      const clientContents = JSON.parse(req.body.contents || "[]");
      const existingUrlsFromClient = new Set(clientContents.flatMap((c) => c.existingImageUrls || []).map(toRelativeUploadPath));
      for (const oldContent of event.EventContents) {
        if (oldContent.imageUrls) {
          let oldImageUrls = [];
          try {
            oldImageUrls = JSON.parse(oldContent.imageUrls);
          } catch (e) {}
          if (Array.isArray(oldImageUrls)) {
            oldImageUrls.forEach((url) => {
              if (!existingUrlsFromClient.has(url)) {
                filesToDelete.push(url);
              }
            });
          }
        }
      }
      await EventContent.destroy({ where: { EventId: event.id }, transaction: t });
      const newContentImages = req.files.contentImages || [];
      let imageIndex = 0;
      const contentRows = [];
      for (const content of clientContents) {
        const imageUrls = (content.existingImageUrls || []).map(toRelativeUploadPath);
        const newImageCount = content.imageCount || 0;
        for (let i = 0; i < newImageCount; i++) {
          if (newContentImages[imageIndex]) {
            imageUrls.push(`/uploads/${newContentImages[imageIndex].filename}`);
            imageIndex++;
          }
        }
        contentRows.push({
          header: content.header,
          content: content.content,
          imageUrls: imageUrls.length > 0 ? JSON.stringify(imageUrls) : null,
          EventId: event.id,
        });
      }
      if (contentRows.length > 0) {
        await EventContent.bulkCreate(contentRows, { transaction: t });
      }
      await t.commit();
      filesToDelete.forEach((url) => deleteFile(url));
      res.status(200).json({ status: "success", data: event });
  } catch (error) {
    await t.rollback();
    if (req.files?.imageBanner) deleteFile(`/uploads/${req.files.imageBanner[0].filename}`);
    if (req.files?.contentImages) req.files.contentImages.forEach((f) => deleteFile(`/uploads/${f.filename}`));
    console.error("ERROR di updateEvent:", error);
    res.status(500).json({ status: "fail", message: "Terjadi kesalahan pada server." });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{ model: EventContent, as: "EventContents" }],
    });
    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event tidak ditemukan." });
    }
    deleteFile(event.imageBannerUrl);
    if (event.EventContents) {
      event.EventContents.forEach((content) => {
        if (content.imageUrls) {
          try {
            const imageUrlsArray = JSON.parse(content.imageUrls);
            if (Array.isArray(imageUrlsArray)) {
              imageUrlsArray.forEach((url) => deleteFile(url));
            }
          } catch (e) {}
        }
      });
    }
    await event.destroy();
    res.status(204).json();
  } catch (error) {
    console.error("ERROR di deleteEvent:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

exports.deleteRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const registration = await EventRegistration.findByPk(registrationId);
    if (!registration) {
      return res.status(404).json({ status: "fail", message: "Data pendaftar tidak ditemukan." });
    }
    await registration.destroy();
    res.status(204).json();
  } catch (error) {
    console.error("ERROR di deleteRegistration:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

exports.registerForEvent = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params; // ID Event
    const { name, email, phone, role } = req.body;

    // 1. Validasi input dasar
    if (!name || !email || !phone || !role) {
      return res.status(400).json({ status: "fail", message: "Semua field wajib diisi." });
    }

    // 2. Kunci baris event untuk cegah race condition saat cek kuota
    const event = await Event.findByPk(id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event tidak ditemukan." });
    }

    // 3. Cek apakah kuota sudah penuh (COUNT, bukan memuat semua baris)
    const registeredCount = await EventRegistration.count({
      where: { EventId: id },
      transaction: t,
    });
    if (registeredCount >= event.quota) {
      return res.status(400).json({ status: "fail", message: "Maaf, kuota untuk event ini sudah penuh." });
    }

    // 4. Cek apakah email sudah terdaftar di event ini
    const existingRegistration = await EventRegistration.findOne({
      where: {
        email: email,
        EventId: id,
      },
      transaction: t,
    });

    if (existingRegistration) {
      // Kirim status 409 Conflict jika email sudah ada
      return res.status(409).json({ status: "fail", message: "Email ini sudah terdaftar untuk event ini." });
    }

    // 5. Jika semua validasi lolos, buat pendaftaran baru
    const newRegistration = await EventRegistration.create({ name, email, phone, role, EventId: id }, { transaction: t });

    await t.commit();
    res.status(201).json({ status: "success", data: newRegistration });
  } catch (error) {
    await t.rollback();
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ status: "fail", message: "Email ini sudah terdaftar untuk event ini." });
    }
    console.error("ERROR di registerForEvent:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};
