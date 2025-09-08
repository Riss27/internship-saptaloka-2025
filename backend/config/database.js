const { Sequelize } = require("sequelize");

// Mengambil konfigurasi database dari file .env
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

// Membuat koneksi baru ke database menggunakan Sequelize
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: "mysql",
});

module.exports = sequelize;
