const { DataTypes } = require("sequelize");
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
    type: DataTypes.TEXT,
    allowNull: false,
  },
  featuredImageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Article;
