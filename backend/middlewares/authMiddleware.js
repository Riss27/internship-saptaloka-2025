const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Ambil token dari header
      token = req.headers.authorization.split(" ")[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Temukan user berdasarkan ID di token (tanpa password)
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      // Jika user ditemukan, lanjutkan ke controller
      if (req.user) {
        next();
      } else {
        return res.status(401).json({ status: "fail", message: "Not authorized, user not found" });
      }
    } catch (error) {
      return res.status(401).json({ status: "fail", message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ status: "fail", message: "Not authorized, no token" });
  }
};

module.exports = { protect };
