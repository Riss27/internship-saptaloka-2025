const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Mendefinisikan model 'LabTool'
const LabTool = sequelize.define("LabTool", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkTokopedia: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkShopee: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = LabTool;
