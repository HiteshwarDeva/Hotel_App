const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Hotel = require('./hotel');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  hotelId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Hotel,
      key: 'id',
    },
  },
  roomNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pricePerNight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['hotelId', 'roomNumber'],
    },
  ],
});

Room.belongsTo(Hotel, { foreignKey: 'hotelId' });
Hotel.hasMany(Room, { foreignKey: 'hotelId' });

module.exports = Room;
