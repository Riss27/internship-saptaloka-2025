const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EventContent = sequelize.define("EventContent", {
  header: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrls: {
    // Menyimpan banyak gambar sebagai array JSON
    type: DataTypes.JSON,
    allowNull: true,
  },
});

module.exports = EventContent;
