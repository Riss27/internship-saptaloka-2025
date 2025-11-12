const Category = require("../models/Category");
const Workshop = require("../models/Workshop");
const Event = require("../models/Event");

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["name", "ASC"]],
    });
    res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    console.error("ERROR di getAllCategories:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data kategori.",
    });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        status: "fail",
        message: "Nama kategori tidak boleh kosong.",
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
      where: { name: name.trim() },
    });

    if (existingCategory) {
      return res.status(400).json({
        status: "fail",
        message: "Kategori dengan nama tersebut sudah ada.",
      });
    }

    const newCategory = await Category.create({
      name: name.trim(),
    });

    res.status(201).json({
      status: "success",
      message: "Kategori berhasil ditambahkan!",
      data: newCategory,
    });
  } catch (error) {
    console.error("ERROR di createCategory:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Terjadi kesalahan di server.",
    });
  }
};

// Delete category with validation
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        status: "fail",
        message: "Kategori tidak ditemukan.",
      });
    }

    // Check if category is used in Workshop
    const workshopsUsingCategory = await Workshop.count({
      where: { category: category.name },
    });

    // Check if category is used in Event
    const eventsUsingCategory = await Event.count({
      where: { category: category.name },
    });

    if (workshopsUsingCategory > 0 || eventsUsingCategory > 0) {
      return res.status(400).json({
        status: "fail",
        message: `Kategori tidak dapat dihapus karena masih digunakan oleh ${workshopsUsingCategory} workshop dan ${eventsUsingCategory} event.`,
      });
    }

    await category.destroy();

    res.status(200).json({
      status: "success",
      message: "Kategori berhasil dihapus.",
    });
  } catch (error) {
    console.error("ERROR di deleteCategory:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Terjadi kesalahan di server.",
    });
  }
};

