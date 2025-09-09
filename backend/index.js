require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const allRoutes = require("./routes/index"); // <-- 1. Impor pengatur rute utama

const app = express();
const port = process.env.PORT || 3000;

// Middleware PENTING agar Express bisa membaca body request dalam format JSON
app.use(cors());
app.use(express.json()); // <-- 2. Tambahkan ini

// Arahkan semua request yang masuk ke /api ke pengatur rute utama
app.use("/api", allRoutes); // <-- 3. Gunakan rute utama

// Fungsi untuk menjalankan server
async function startServer() {
  try {
    await sequelize.sync({ force: false });
    console.log("✅ Semua model telah disinkronisasi.");
    app.listen(port, () => {
      console.log(`🚀 Server berjalan di http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Gagal menjalankan server:", error);
  }
}

startServer();
