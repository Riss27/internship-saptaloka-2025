const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ArticleContent = sequelize.define("ArticleContent", {
  topic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrls: {
    type: DataTypes.JSON,
    allowNull: true, // Gambar untuk sub-konten boleh kosong
  },
});

module.exports = ArticleContent;
