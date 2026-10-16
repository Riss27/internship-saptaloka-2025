const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const bcrypt = require("bcryptjs");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "user"),
    defaultValue: "user",
    allowNull: false,
  },
}, {
  // Unique sebagai index bernama eksplisit. Field-level `unique: true`
  // menghasilkan index tanpa nama, dan sync({ alter: true }) membandingkan
  // index lama berdasarkan nama — index tanpa nama selalu dianggap hilang,
  // jadi tiap boot MySQL menambah satu index duplikat sampai tabel mentok
  // batas 64 index dan server gagal start. Dengan nama yang stabil, sync
  // berhenti menambah apa pun setelah index pertama terbentuk.
  indexes: [
    {
      name: "users_email_unique",
      unique: true,
      fields: ["email"],
    },
  ],
});

User.beforeCreate(async (user) => {
  // "Acak" passwordnya dengan bcrypt sebelum disimpan
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

module.exports = User;
