const LabTool = require("../models/LabTool");
const { deleteFile } = require("../utils/fileHelper");
const { getPagination } = require("../utils/pagination");
const { searchWhere } = require("../utils/search");

// Catatan: upload file sudah ditangani middleware upload.single("image") di route —
// controller hanya membaca req.file.

// Controller untuk (CREATE) - Membuat alat lab baru
exports.createLabTool = async (req, res) => {
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
    console.error("ERROR di createLabTool:", error);
    res.status(500).json({ status: "fail", message: "Terjadi kesalahan pada server." });
  }
};

// Controller untuk (READ) - Mendapatkan semua alat lab
exports.getAllLabTools = async (req, res) => {
  try {
    const where = searchWhere(req.query.search, ["name"]);

    const pagination = getPagination(req.query);
    let data;
    let meta;
    if (pagination) {
      const options = {
        order: [["id", "DESC"]],
        limit: pagination.limit,
        offset: pagination.offset,
      };
      if (where) options.where = where;
      const { rows, count } = await LabTool.findAndCountAll(options);
      data = rows;
      meta = { page: pagination.page, limit: pagination.limit, total: count, totalPages: Math.ceil(count / pagination.limit) };
    } else {
      data = await LabTool.findAll(where ? { where } : undefined);
    }
    res.status(200).json({
      status: "success",
      data,
      ...(meta && { meta }),
    });
  } catch (error) {
    console.error("ERROR di getAllLabTools:", error);
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
    console.error("ERROR di getLabToolById:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

// Controller untuk (UPDATE) - Memperbarui alat lab
exports.updateLabTool = async (req, res) => {
  try {
    const labTool = await LabTool.findByPk(req.params.id);
    if (!labTool) {
      return res.status(404).json({ status: "fail", message: "Alat tidak ditemukan." });
    }

    // Whitelist field yang boleh diubah (mencegah mass assignment); buang undefined
    const { name, description, price, linkTokopedia, linkShopee } = req.body;
    const updateData = Object.fromEntries(
      Object.entries({ name, description, price, linkTokopedia, linkShopee }).filter(([, v]) => v !== undefined)
    );

    if (req.file) {
      deleteFile(labTool.imageUrl);
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    await labTool.update(updateData);
    res.status(200).json({ status: "success", data: labTool });
  } catch (error) {
    console.error("ERROR di updateLabTool:", error);
    res.status(500).json({ status: "fail", message: "Terjadi kesalahan pada server." });
  }
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
    deleteFile(imagePath);
    res.status(204).json();
  } catch (error) {
    console.error("ERROR di deleteLabTool:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};
