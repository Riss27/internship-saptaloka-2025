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
    unique: true, // Setiap email harus unik
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "admin",
  },
});

User.beforeCreate(async (user) => {
  // "Acak" passwordnya dengan bcrypt sebelum disimpan
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

module.exports = User;
