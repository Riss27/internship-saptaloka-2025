require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const allRoutes = require("./routes/index");
const About = require('./models/About');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", allRoutes);

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
