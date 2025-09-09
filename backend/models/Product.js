const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Mendefinisikan model 'Product'
const Product = sequelize.define("Product", {
  // Mendefinisikan atribut/kolom tabel
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
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Parfum", // Nilai default jika tidak diisi
  },
  linkTokopedia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  linkShopee: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Product;
