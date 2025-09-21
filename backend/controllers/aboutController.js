const About = require("../models/About");

exports.getAboutContent = async (req, res) => {
};

exports.updateAboutContent = async (req, res) => {
  try {
    let aboutContent = await About.findOne();
    if (!aboutContent) {
      return res.status(404).json({ status: "fail", message: 'Konten "About" tidak ditemukan.' });
    }

    // Ambil data teks dari req.body
    const updateData = { ...req.body };

    if (req.file) {
      updateData.logoFooter = req.file.filename;
    }

    await aboutContent.update(updateData);

    res.status(200).json({ status: "success", data: aboutContent });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
