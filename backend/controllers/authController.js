const User = require("../models/User.js");

// Fungsi untuk mendaftarkan user/admin baru
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input dasar
    if (!name || !email || !password) {
      return res.status(400).json({ status: "fail", message: "Nama, email, dan password wajib diisi." });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json({ status: "fail", message: "Email sudah terdaftar." });
    }

    // Buat user baru (password akan di-hash otomatis oleh hook di model)
    const newUser = await User.create({ name, email, password });

    // Jangan kirim password kembali di respons
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    res.status(201).json({ status: "success", data: userResponse });
  } catch (error) {
    // Tangani error validasi dari Sequelize (misal: email tidak valid)
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ status: "fail", message: error.errors.map((e) => e.message).join(", ") });
    }
    console.error("ERROR di register:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan di server." });
  }
};

// Fungsi untuk login user/admin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ status: "fail", message: "Email dan password wajib diisi." });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ status: "fail", message: "Email atau password salah." }); // Pesan sengaja disamakan demi keamanan
    }

    // Bandingkan password yang dikirim dengan yang ada di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: "fail", message: "Email atau password salah." });
    }

    // Jika cocok, buat "tiket masuk" (Token JWT)
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    // Buat token yang berlaku selama 1 hari
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      status: "success",
      token, // Kirim token ke frontend
    });
  } catch (error) {
    console.error("ERROR di login:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan di server." });
  }
};
