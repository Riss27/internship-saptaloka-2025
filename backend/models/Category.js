const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Unique sebagai index bernama eksplisit. Field-level `unique: true`
// menghasilkan index tanpa nama, dan sync({ alter: true }) membandingkan
// index lama berdasarkan nama — index tanpa nama selalu dianggap hilang,
// jadi tiap boot MySQL menambah satu index duplikat sampai tabel mentok
// batas 64 index dan server gagal start. Dengan nama yang stabil, sync
// berhenti menambah apa pun setelah index pertama terbentuk.
const Category = sequelize.define("Category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  indexes: [
    {
      name: "categories_name_unique",
      unique: true,
      fields: ["name"],
    },
  ],
});

module.exports = Category;
