require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const sequelize = require("./config/database");
const allRoutes = require("./routes/index");
const { collectUploadedFiles } = require("./middlewares/upload");

const Article = require("./models/Article");
const ArticleContent = require("./models/ArticleContent");
const Event = require("./models/Event");
const EventContent = require("./models/EventContent");
const EventRegistration = require("./models/EventRegistration");
const Workshop = require("./models/Workshop");

const app = express();
const port = process.env.PORT || 3000;

// Di production (di belakang reverse proxy) agar rate limiter membaca IP asli
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Daftar origin yang boleh mengakses API (pisahkan dengan koma di CORS_ORIGINS)
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Helmet: crossOriginResourcePolicy harus "cross-origin" agar gambar di /uploads
// tetap bisa dimuat frontend yang berjalan di origin/domain berbeda.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      // origin kosong = request non-browser (curl/mobile); tetap diizinkan
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
  })
);
app.use(express.json());
// Uploads selalu pakai nama unik ber-timestamp, jadi aman di-cache lama.
// Tanpa ini setiap kunjungan mengunduh ulang gambar ber-megabyte.
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "7d",
    etag: true,
  })
);

// Sisipkan info upload (ukuran asli vs hasil kompresi) ke payload sukses yang
// membawa file upload — satu wrapping res.json, tanpa menyentuh controller.
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (payload) => {
    if (
      payload &&
      typeof payload === "object" &&
      !Array.isArray(payload) &&
      payload.status === "success"
    ) {
      const uploaded = collectUploadedFiles(req);
      if (uploaded.length > 0) {
        const file = uploaded[0];
        payload.uploadInfo = {
          originalSize: file.originalSize,
          size: file.size,
          mimetype: file.mimetype,
        };
      }
    }
    return originalJson(payload);
  };
  next();
});

app.use("/api", allRoutes);

// 404 khusus API
app.use("/api", (req, res) => {
  res.status(404).json({ status: "fail", message: "Endpoint tidak ditemukan." });
});

// Error middleware terpusat: log detail di server, kirim pesan generik ke client
app.use((error, req, res, next) => {
  console.error(`[error] ${req.method} ${req.originalUrl}:`, error);
  if (res.headersSent) return next(error);
  const status = error.status || (error.name === "MulterError" ? 400 : 500);
  // Pesan 4xx berasal dari kode kita sendiri (validasi/upload) — aman dikirim;
  // 5xx disembunyikan agar detail internal tidak bocor.
  const message = status < 500 ? error.message : "Terjadi kesalahan pada server.";
  res.status(status).json({ status: "fail", message });
});

// Relasi antar model
// Satu Article punya banyak ArticleContent
Article.hasMany(ArticleContent, { onDelete: "CASCADE", hooks: true });
ArticleContent.belongsTo(Article);

// Satu Event punya banyak Content
Event.hasMany(EventContent, { onDelete: "CASCADE", hooks: true });
EventContent.belongsTo(Event);
// Satu Event punya banyak Pendaftar
Event.hasMany(EventRegistration, { onDelete: "CASCADE", hooks: true });
EventRegistration.belongsTo(Event);

// Hubungan Many-to-Many antara Workshop dan Event
Workshop.belongsToMany(Event, { through: "WorkshopEvents" });
Event.belongsToMany(Workshop, { through: "WorkshopEvents" });

// Sinkronisasi skema dijalankan sekali; test menunggu lewat module.exports.ready
const ready = (async () => {
  if (process.env.NODE_ENV === "production") {
    // Di production jangan pakai alter: true (berisiko mengubah/menghapus kolom).
    // Gunakan migration untuk perubahan skema.
    await sequelize.authenticate();
  } else {
    await sequelize.sync({ alter: true });
    console.log("✅ Semua model telah disinkronisasi.");
  }
})();

// Fungsi untuk menjalankan server
async function startServer() {
  try {
    await ready;
    app.listen(port, () => {
      console.log(`🚀 Server berjalan di http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Gagal menjalankan server:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.ready = ready;
