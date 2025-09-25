require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/database");
const allRoutes = require("./routes/index");

const Article = require("./models/Article");
const ArticleContent = require("./models/ArticleContent");
const Event = require("./models/Event");
const EventContent = require("./models/EventContent");
const EventRegistration = require("./models/EventRegistration");
const Workshop = require("./models/Workshop");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", allRoutes);

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

// Fungsi untuk menjalankan server
async function startServer() {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Semua model telah disinkronisasi.");
    app.listen(port, () => {
      console.log(`🚀 Server berjalan di http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Gagal menjalankan server:", error);
  }
}

startServer();
