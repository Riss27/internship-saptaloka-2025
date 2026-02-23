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
    type: DataTypes.STRING(5000),
    allowNull: false,
    validate: {
      len: {
        args: [1, 5000],
        msg: "Deskripsi harus antara 1-5000 karakter"
      }
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Workshop;
