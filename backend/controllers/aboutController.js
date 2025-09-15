const About = require('../models/About');

// Fungsi untuk mendapatkan data "About"
// Kita akan selalu mengambil baris pertama, atau membuatnya jika belum ada.
exports.getAboutContent = async (req, res) => {
  try {
    let aboutContent = await About.findOne(); // Cari satu baris data

    // Jika tidak ada data sama sekali, buat satu baris kosong
    if (!aboutContent) {
      aboutContent = await About.create({
        title: 'Default Title',
        description: 'Default description.',
        imageUrl1: '',
        imageUrl2: '',
      });
    }

    res.status(200).json({ status: 'success', data: aboutContent });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Fungsi untuk memperbarui data "About"
exports.updateAboutContent = async (req, res) => {
  try {
    let aboutContent = await About.findOne();
    if (!aboutContent) {
      return res.status(404).json({ status: 'fail', message: 'Konten "About" tidak ditemukan.' });
    }

    // Update baris yang ada dengan data dari body request
    await aboutContent.update(req.body);

    res.status(200).json({ status: 'success', data: aboutContent });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};