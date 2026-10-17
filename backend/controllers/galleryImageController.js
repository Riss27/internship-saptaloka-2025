const GalleryImage = require("../models/GalleryImage");
const upload = require("../middlewares/upload");
const { deleteFile } = require("../utils/fileHelper");
const { getPagination } = require("../utils/pagination");
const { searchWhere } = require("../utils/search");
const { getSort } = require("../utils/sort");
const { parseIds } = require("../utils/ids");

// MENDAPATKAN SEMUA GAMBAR
exports.getAllImages = async (req, res) => {
  try {
    const options = {
      order: getSort(req.query, ["createdAt", "id", "title"], [["sortOrder", "ASC"], ["id", "ASC"]]),
    };
    const where = searchWhere(req.query.search, ["title"]);
    if (where) {
      options.where = where;
    }
    const pagination = getPagination(req.query);
    let data;
    let meta;
    if (pagination) {
      options.limit = pagination.limit;
      options.offset = pagination.offset;
      const { rows, count } = await GalleryImage.findAndCountAll(options);
      data = rows;
      meta = { page: pagination.page, limit: pagination.limit, total: count, totalPages: Math.ceil(count / pagination.limit) };
    } else {
      data = await GalleryImage.findAll(options);
    }
    res.status(200).json({ status: "success", data, ...(meta && { meta }) });
  } catch (error) {
    console.error("ERROR di getAllImages:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

// MENDAPATKAN GAMBAR BERDASARKAN ID
exports.getImageById = async (req, res) => {
  try {
    const image = await GalleryImage.findByPk(req.params.id);
    if (!image) {
      return res.status(404).json({ status: "fail", message: "Gambar tidak ditemukan." });
    }
    res.status(200).json({ status: "success", data: image });
  } catch (error) {
    console.error("ERROR di getImageById:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

// MEMBUAT GAMBAR BARU (UPLOAD)
exports.createImage = async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file) {
      return res.status(400).json({ status: "fail", message: "Gambar wajib di-upload." });
    }
    // [FIX] Tambahkan /uploads/ di depan nama file
    const newImage = await GalleryImage.create({
      title,
      imageUrl: `/uploads/${req.file.filename}`,
      sortOrder: (await GalleryImage.max("sortOrder") || 0) + 1,
    });
    res.status(201).json({ status: "success", data: newImage });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// MEMPERBARUI GAMBAR (JUDUL + GAMBAR)
exports.updateImage = async (req, res) => {
  try {
    const image = await GalleryImage.findByPk(req.params.id);
    if (!image) {
      return res.status(404).json({ status: "fail", message: "Gambar tidak ditemukan." });
    }

    const oldImagePath = image.imageUrl;
    const updateData = {
      title: req.body.title,
    };

    if (req.file) {
      deleteFile(oldImagePath);
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    await image.update(updateData);
    res.status(200).json({ status: "success", data: image });
  } catch (error) {
    if (req.file) {
      deleteFile(`/uploads/${req.file.filename}`);
    }
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// MENGHAPUS GAMBAR
exports.deleteImage = async (req, res) => {
  try {
    const image = await GalleryImage.findByPk(req.params.id);
    if (!image) {
      return res.status(404).json({ status: "fail", message: "Gambar tidak ditemukan." });
    }

    // [FIX] Hapus file gambar dari server menggunakan path yang benar
    deleteFile(image.imageUrl);

    await image.destroy();
    res.status(204).json();
  } catch (error) {
    console.error("ERROR di deleteImage:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

// MENGHAPUS BANYAK GAMBAR SEKALIGUS
exports.bulkDeleteImages = async (req, res) => {
  try {
    const { ids, error: idsError } = parseIds(req.body.ids);
    if (idsError) {
      return res.status(400).json({ status: "fail", message: idsError });
    }

    const images = await GalleryImage.findAll({ where: { id: ids }, attributes: ["id", "imageUrl"] });
    const deleted = await GalleryImage.destroy({ where: { id: ids } });

    // Best-effort: hapus file gambar dari server (pola sama dengan deleteImage)
    images.forEach((image) => deleteFile(image.imageUrl));

    res.status(200).json({ status: "success", deleted });
  } catch (error) {
    console.error("ERROR di bulkDeleteImages:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

// MENGATUR URUTAN TAMPIL (sortOrder mengikuti urutan array ids, 0-based)
exports.reorderImages = async (req, res) => {
  try {
    const { ids, error: idsError } = parseIds(req.body.ids);
    if (idsError) {
      return res.status(400).json({ status: "fail", message: idsError });
    }

    // Id yang tidak ada di tabel diabaikan secara diam-diam (update 0 baris)
    await Promise.all(ids.map((id, index) => GalleryImage.update({ sortOrder: index }, { where: { id } })));

    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("ERROR di reorderImages:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};
