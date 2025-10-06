const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Fungsi untuk mendaftarkan user/admin baru
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: "fail", message: "Nama, email, dan password wajib diisi." });
    }

    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json({ status: "fail", message: "Email sudah terdaftar." });
    }

    const newUser = await User.create({ name, email, password });

    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    res.status(201).json({ status: "success", data: userResponse });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ status: "fail", message: error.errors.map((e) => e.message).join(", ") });
    }
    console.error("ERROR di register:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan di server." });
  }
};

// Fungsi untuk login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: "fail", message: "Email dan password wajib diisi." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ status: "fail", message: "Email atau password salah." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: "fail", message: "Email atau password salah." });
    }

    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    console.error("ERROR di login:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan di server." });
  }
};
