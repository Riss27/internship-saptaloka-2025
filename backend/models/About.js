const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const About = sequelize.define('About', {
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT, // Pakai TEXT untuk konten yang panjang
    allowNull: true,
  },
  imageUrl1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageUrl2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = About;