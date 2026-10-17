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
  // Nomor urut tampil; TANPA unique/index — sync({ alter: true }) pernah bikin
  // index duplikat dari field unique: true, jangan diulang.
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = GalleryImage;
