require("dotenv").config();
const express = require("express");
const sequelize = require("./config/database");

const app = express();
const port = 3000;

// Fungsi untuk menguji koneksi database
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Koneksi ke database berhasil.");
  } catch (error) {
    console.error("❌ Gagal terkoneksi ke database:", error);
  }
}

testDatabaseConnection();

app.get("/", (req, res) => {
  res.send("🎉 Selamat! Server backend Saptaloka berhasil berjalan!");
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
