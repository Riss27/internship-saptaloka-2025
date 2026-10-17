const LandingPage = require("../models/LandingPage");
const { deleteFile } = require("../utils/fileHelper");
const { parseIds } = require("../utils/ids");

// Catatan: upload file sudah ditangani middleware upload.single("image") di route —
// controller hanya membaca req.file.

// Mendapatkan semua slide
exports.getAllSlides = async (req, res) => {
  try {
    const slides = await LandingPage.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] });
    res.status(200).json({ status: "success", data: slides });
  } catch (error) {
    console.error("ERROR di getAllSlides:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
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
    console.error("ERROR di getSlideById:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

// Membuat slide baru
exports.createSlide = async (req, res) => {
  try {
    const { heading, paragraph } = req.body;
    if (!req.file) {
      return res.status(400).json({ status: "fail", message: "Gambar wajib diunggah." });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    const newSlide = await LandingPage.create({
      heading,
      paragraph,
      imageUrl,
      sortOrder: (await LandingPage.max("sortOrder") || 0) + 1,
    });
    res.status(201).json({ status: "success", data: newSlide });
  } catch (error) {
    console.error("ERROR di createSlide:", error);
    res.status(500).json({ status: "fail", message: "Terjadi kesalahan pada server." });
  }
};

// Memperbarui slide
exports.updateSlide = async (req, res) => {
  try {
    const slide = await LandingPage.findByPk(req.params.id);
    if (!slide) {
      return res.status(404).json({ status: "fail", message: "Slide tidak ditemukan." });
    }

    // Whitelist field yang boleh diubah (mencegah mass assignment); buang undefined
    const { heading, paragraph } = req.body;
    const updateData = Object.fromEntries(
      Object.entries({ heading, paragraph }).filter(([, v]) => v !== undefined)
    );

    if (req.file) {
      deleteFile(slide.imageUrl);
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    await slide.update(updateData);
    res.status(200).json({ status: "success", data: slide });
  } catch (error) {
    console.error("ERROR di updateSlide:", error);
    res.status(500).json({ status: "fail", message: "Terjadi kesalahan pada server." });
  }
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
    deleteFile(imagePath);
    res.status(204).json();
  } catch (error) {
    console.error("ERROR di deleteSlide:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

// MENGATUR URUTAN TAMPIL (sortOrder mengikuti urutan array ids, 0-based)
exports.reorderSlides = async (req, res) => {
  try {
    const { ids, error: idsError } = parseIds(req.body.ids);
    if (idsError) {
      return res.status(400).json({ status: "fail", message: idsError });
    }

    // Id yang tidak ada di tabel diabaikan secara diam-diam (update 0 baris)
    await Promise.all(ids.map((id, index) => LandingPage.update({ sortOrder: index }, { where: { id } })));

    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("ERROR di reorderSlides:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};
