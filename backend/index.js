require("dotenv").config();

const express = require("express");
const app = express();

const port = 3000;

app.get("/", (req, res) => {
  res.send("🎉 Selamat! Server backend Saptaloka berhasil berjalan!");
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
