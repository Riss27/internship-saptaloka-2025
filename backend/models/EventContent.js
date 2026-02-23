const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EventContent = sequelize.define("EventContent", {
  header: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING(10000),
    allowNull: false,
    validate: {
      len: {
        args: [1, 10000],
        msg: "Konten harus antara 1-10000 karakter"
      }
    }
  },
  imageUrls: {
    // Menyimpan banyak gambar sebagai array JSON
    type: DataTypes.JSON,
    allowNull: true,
  },
});

module.exports = EventContent;
