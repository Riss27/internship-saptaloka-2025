const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ArticleContent = sequelize.define("ArticleContent", {
  topic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(10000),
    allowNull: false,
    validate: {
      len: {
        args: [1, 10000],
        msg: "Deskripsi harus antara 1-10000 karakter"
      }
    }
  },
  imageUrls: {
    type: DataTypes.JSON,
    allowNull: true, // Gambar untuk sub-konten boleh kosong
  },
});

module.exports = ArticleContent;
