const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Workshop = sequelize.define("Workshop", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Workshop;
