const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LandingPage = sequelize.define("LandingPage", {
  heading: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: {
        args: [1, 100],
        msg: "Heading harus antara 1-100 karakter"
      }
    }
  },
  paragraph: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      len: {
        args: [1, 500],
        msg: "Paragraph harus antara 1-500 karakter"
      }
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = LandingPage;
