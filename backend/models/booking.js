const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Hotel = require('./hotel');
const Room = require('./room');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  hotelId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Hotel,
      key: 'id',
    },
  },
  roomId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Room,
      key: 'id',
    },
  },
  checkIn: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  checkOut: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('confirmed', 'cancelled'),
    defaultValue: 'confirmed',
  },
}, {
  timestamps: true,
});

Booking.belongsTo(User, { foreignKey: 'userId' });
Booking.belongsTo(Hotel, { foreignKey: 'hotelId' });
Booking.belongsTo(Room, { foreignKey: 'roomId' });

User.hasMany(Booking, { foreignKey: 'userId' });
Hotel.hasMany(Booking, { foreignKey: 'hotelId' });
Room.hasMany(Booking, { foreignKey: 'roomId' });

module.exports = Booking;
