const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Hotel = sequelize.define('Hotel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adminId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

Hotel.belongsTo(User, { as: 'admin', foreignKey: 'adminId' });
User.hasMany(Hotel, { foreignKey: 'adminId' });

module.exports = Hotel;
