const Event = require("../models/Event");
const Article = require("../models/Article");
const Product = require("../models/Product");
const Ingredient = require("../models/Ingredient");
const LabTool = require("../models/LabTool");
const Workshop = require("../models/Workshop");
const GalleryImage = require("../models/GalleryImage");
const LandingPage = require("../models/LandingPage");
const EventRegistration = require("../models/EventRegistration");

// Statistik ringkas untuk dashboard admin: jumlah baris per tabel
// ditambah daftar terbaru (artikel & pendaftar event).
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      events,
      articles,
      products,
      ingredients,
      labTools,
      workshops,
      gallery,
      slides,
      registrations,
      recentArticles,
      recentRegistrations,
    ] = await Promise.all([
      Event.count(),
      Article.count(),
      Product.count(),
      Ingredient.count(),
      LabTool.count(),
      Workshop.count(),
      GalleryImage.count(),
      LandingPage.count(),
      EventRegistration.count(),
      Article.findAll({
        attributes: ["id", "title", "author", "publishedAt"],
        order: [["publishedAt", "DESC"]],
        limit: 5,
      }),
      EventRegistration.findAll({
        attributes: ["id", "name", "email", "createdAt"],
        include: [{ model: Event, as: "Event", attributes: ["title"], required: true }],
        order: [["createdAt", "DESC"]],
        limit: 5,
      }),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        counts: {
          events,
          articles,
          products,
          ingredients,
          labTools,
          workshops,
          gallery,
          slides,
          registrations,
        },
        recentArticles,
        recentRegistrations: recentRegistrations.map((registration) => ({
          id: registration.id,
          name: registration.name,
          email: registration.email,
          eventTitle: registration.Event ? registration.Event.title : null,
          createdAt: registration.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("ERROR di getDashboardStats:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};
