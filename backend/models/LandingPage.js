const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LandingPage = sequelize.define("LandingPage", {
  heading: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paragraph: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = LandingPage;
