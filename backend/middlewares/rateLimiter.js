const rateLimit = require("express-rate-limit");

const buildLimiter = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: "fail", message },
  });

// Batasi percobaan login (anti brute-force)
exports.loginLimiter = buildLimiter(15 * 60 * 1000, 10, "Terlalu banyak percobaan login. Coba lagi nanti.");

// Batasi pembuatan akun
exports.registerAccountLimiter = buildLimiter(60 * 60 * 1000, 10, "Terlalu banyak pendaftaran akun. Coba lagi nanti.");

// Batasi pendaftaran event publik (anti spam)
exports.eventRegisterLimiter = buildLimiter(60 * 60 * 1000, 20, "Terlalu banyak pendaftaran. Coba lagi nanti.");

// Batasi pemakaian endpoint terjemahan publik
exports.translateLimiter = buildLimiter(15 * 60 * 1000, 60, "Terlalu banyak permintaan terjemahan. Coba lagi nanti.");
