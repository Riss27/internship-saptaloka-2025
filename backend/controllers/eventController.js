const Event = require("../models/Event");
const EventContent = require("../models/EventContent");
const EventRegistration = require("../models/EventRegistration");
const upload = require("../middlewares/upload");
const fs = require("fs");
const path = require("path");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

// Hapus file helper
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

exports.getAllEvents = async (req, res) => {
  try {
    const { search } = req.query;

    const options = {
      order: [["startDateTime", "DESC"]],
      attributes: {
        include: [[sequelize.fn("COUNT", sequelize.col("EventRegistrations.id")), "registeredCount"]],
      },
      include: [
        {
          model: EventRegistration,
          as: "EventRegistrations",
          attributes: [],
        },
      ],
      group: ["Event.id"],
    };

    if (search) {
      options.where = {
        title: {
          [Op.like]: `%${search}%`,
        },
      };
    }

    const events = await Event.findAll(options);
    res.status(200).json({ status: "success", data: events });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      attributes: {
        include: [[sequelize.fn("COUNT", sequelize.col("EventRegistrations.id")), "registeredCount"]],
      },
      include: [
        { model: EventContent, as: "EventContents" },
        { model: EventRegistration, as: "EventRegistrations", attributes: [] },
      ],
      group: ["Event.id", "EventContents.id"],
      order: [["EventContents", "id", "ASC"]],
    });

    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event tidak ditemukan." });
    }
    res.status(200).json({ status: "success", data: event });
  } catch (error) {
    console.error("ERROR di getEventById:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.createEvent = async (req, res) => {
  const uploader = upload.fields([{ name: "imageBanner", maxCount: 1 }, { name: "contentImages" }]);
  uploader(req, res, async function (err) {
    const t = await sequelize.transaction();
    if (err) return res.status(400).json({ status: "fail", message: err.message || err });
    try {
      const { title, quota, location, fee, description, startDateTime, endDateTime, participantRoles, contents } = req.body;
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
        },
        { transaction: t }
      );
      const parsedContents = JSON.parse(contents || "[]");
      const contentImages = req.files.contentImages || [];
      let imageIndex = 0;
      for (const content of parsedContents) {
        const imageUrls = [];
        const imageCount = content.imageCount || 0;
        for (let i = 0; i < imageCount; i++) {
          if (contentImages[imageIndex]) {
            imageUrls.push(`/uploads/${contentImages[imageIndex].filename}`);
            imageIndex++;
          }
        }
        await EventContent.create(
          {
            header: content.header,
            content: content.content,
            imageUrls: imageUrls.length > 0 ? JSON.stringify(imageUrls) : null,
            EventId: newEvent.id,
          },
          { transaction: t }
        );
      }
      await t.commit();
      res.status(201).json({ status: "success", data: newEvent });
    } catch (error) {
      await t.rollback();
      if (req.files.imageBanner) deleteFile(`/uploads/${req.files.imageBanner[0].filename}`);
      if (req.files.contentImages) req.files.contentImages.forEach((f) => deleteFile(`/uploads/${f.filename}`));
      res.status(500).json({ status: "fail", message: error.message });
    }
  });
};

exports.updateEvent = async (req, res) => {
  const uploader = upload.fields([{ name: "imageBanner", maxCount: 1 }, { name: "contentImages" }]);
  uploader(req, res, async function (err) {
    const t = await sequelize.transaction();
    if (err) return res.status(400).json({ status: "fail", message: err.message || err });
    try {
      const event = await Event.findByPk(req.params.id, { include: ["EventContents"], transaction: t });
      if (!event) {
        await t.rollback();
        return res.status(404).json({ status: "fail", message: "Event tidak ditemukan." });
      }
      const { title, quota, location, fee, description, startDateTime, endDateTime, participantRoles } = req.body;
      let imageBannerUrl = event.imageBannerUrl;
      if (req.files.imageBanner) {
        deleteFile(event.imageBannerUrl);
        imageBannerUrl = `/uploads/${req.files.imageBanner[0].filename}`;
      }
      await event.update({ title, quota, location, fee, description, startDateTime, endDateTime, imageBannerUrl, participantRoles: JSON.parse(participantRoles || "[]") }, { transaction: t });
      const clientContents = JSON.parse(req.body.contents || "[]");
      const existingUrlsFromClient = new Set(clientContents.flatMap((c) => c.existingImageUrls || []).map((url) => url.replace("http://localhost:3000", "")));
      for (const oldContent of event.EventContents) {
        if (oldContent.imageUrls) {
          let oldImageUrls = [];
          try {
            oldImageUrls = JSON.parse(oldContent.imageUrls);
          } catch (e) {}
          if (Array.isArray(oldImageUrls)) {
            oldImageUrls.forEach((url) => {
              if (!existingUrlsFromClient.has(url)) {
                deleteFile(url);
              }
            });
          }
        }
      }
      await EventContent.destroy({ where: { EventId: event.id }, transaction: t });
      const newContentImages = req.files.contentImages || [];
      let imageIndex = 0;
      for (const content of clientContents) {
        const imageUrls = content.existingImageUrls.map((url) => url.replace("http://localhost:3000", "")) || [];
        const newImageCount = content.imageCount || 0;
        for (let i = 0; i < newImageCount; i++) {
          if (newContentImages[imageIndex]) {
            imageUrls.push(`/uploads/${newContentImages[imageIndex].filename}`);
            imageIndex++;
          }
        }
        await EventContent.create(
          {
            header: content.header,
            content: content.content,
            imageUrls: imageUrls.length > 0 ? JSON.stringify(imageUrls) : null,
            EventId: event.id,
          },
          { transaction: t }
        );
      }
      await t.commit();
      res.status(200).json({ status: "success", data: event });
    } catch (error) {
      await t.rollback();
      if (req.files.imageBanner) deleteFile(`/uploads/${req.files.imageBanner[0].filename}`);
      if (req.files.contentImages) req.files.contentImages.forEach((f) => deleteFile(`/uploads/${f.filename}`));
      res.status(500).json({ status: "fail", message: error.message });
    }
  });
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
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.registerForEvent = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;

    if (!name || !email || !phone || !role) {
      return res.status(400).json({ status: "fail", message: "Semua field wajib diisi." });
    }

    const event = await Event.findByPk(id, {
      include: { model: EventRegistration, as: "EventRegistrations", attributes: ["id"] },
      transaction: t,
    });

    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event tidak ditemukan." });
    }

    if (event.EventRegistrations.length >= event.quota) {
      return res.status(400).json({ status: "fail", message: "Maaf, kuota untuk event ini sudah penuh." });
    }

    const existingRegistration = await EventRegistration.findOne({
      where: {
        email: email,
        EventId: id,
      },
      transaction: t,
    });

    if (existingRegistration) {
      return res.status(409).json({ status: "fail", message: "Email ini sudah terdaftar untuk event ini." });
    }

    const newRegistration = await EventRegistration.create({ name, email, phone, role, EventId: id }, { transaction: t });

    await t.commit();
    res.status(201).json({ status: "success", data: newRegistration });
  } catch (error) {
    await t.rollback();
    console.error("ERROR di registerForEvent:", error);
    res.status(500).json({ status: "error", message: error.message });
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
    res.status(500).json({ status: "error", message: error.message });
  }
};
