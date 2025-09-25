const Event = require("../models/Event");
const EventContent = require("../models/EventContent");
const EventRegistration = require("../models/EventRegistration");
const upload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

// Helper untuk menghapus file
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

// --- Controller Functions ---

// Mengambil semua event dengan pencarian dan jumlah pendaftar
exports.getAllEvents = async (req, res) => {
  try {
    const { search } = req.query;
    let options = {
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
        title: { [Op.like]: `%${search}%` },
      };
    }

    const events = await Event.findAll(options);
    res.status(200).json({ status: "success", data: events });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Mengambil detail satu event beserta konten dan pendaftarnya
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        { model: EventContent, as: "EventContents" },
        { model: EventRegistration, as: "EventRegistrations" },
      ],
      order: [
        [sequelize.col("EventContents"), "id", "ASC"],
        [sequelize.col("EventRegistrations"), "createdAt", "ASC"],
      ],
    });
    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event tidak ditemukan." });
    }
    res.status(200).json({ status: "success", data: event });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Membuat event baru
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

// Menghapus event
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

// Menghapus seorang pendaftar dari event
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

// Placeholder untuk fungsi update
exports.updateEvent = async (req, res) => {
  res.status(501).json({ status: "info", message: "Fitur update belum diimplementasikan." });
};
