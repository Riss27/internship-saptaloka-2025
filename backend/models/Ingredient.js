const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Mendefinisikan model 'Ingredient'
const Ingredient = sequelize.define("Ingredient", {
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Wajib diisi
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false, // Wajib diisi
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false, // Wajib diisi
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true, // Boleh kosong
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false, // Wajib diisi
  },
  linkTokopedia: {
    type: DataTypes.STRING,
    allowNull: true, // Boleh kosong
  },
  linkShopee: {
    type: DataTypes.STRING,
    allowNull: true, // Boleh kosong
  },
});

module.exports = Ingredient;
