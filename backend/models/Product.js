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
    type: DataTypes.STRING(1000),
    allowNull: false,
    validate: {
      len: {
        args: [1, 1000],
        msg: "Deskripsi harus antara 1-1000 karakter"
      }
    }
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
    allowNull: true,
  },
  linkShopee: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Product;
