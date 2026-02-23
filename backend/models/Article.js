const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/database");

const Article = sequelize.define("Article", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mainDescription: {
    type: DataTypes.STRING(5000),
    allowNull: false,
    validate: {
      len: {
        args: [1, 5000],
        msg: "Deskripsi utama harus antara 1-5000 karakter"
      }
    }
  },
  featuredImageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
});

module.exports = Article;
