const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Mendefinisikan model 'Product'
const Product = sequelize.define("Product", {
  // Mendefinisikan atribut/kolom tabel
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Kolom ini tidak boleh kosong
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
    allowNull: true, // Boleh kosong jika gambar tidak ada
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
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
