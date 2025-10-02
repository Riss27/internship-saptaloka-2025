const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Event = sequelize.define("Event", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quota: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageBannerUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  participantRoles: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

module.exports = Event;
