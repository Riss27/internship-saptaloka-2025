const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const GalleryImage = sequelize.define("GalleryImage", {
  title: {
    type: DataTypes.STRING,
    allowNull: false, // Judul wajib diisi
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false, // Gambar wajib diisi
  },
});

module.exports = GalleryImage;
