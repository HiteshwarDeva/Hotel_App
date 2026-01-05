const Hotel = require('../models/hotel');
const Room = require('../models/room');
const Booking = require('../models/booking');
const User = require('../models/user');
const { Op, fn, col } = require('sequelize');

exports.addHotel = async (req, res) => {
  const { name, city } = req.body;
  try {
    const hotel = await Hotel.create({ name, city, adminId: req.user.id });
    res.json(hotel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addRoom = async (req, res) => {
  const { hotelId, roomNumber, type, pricePerNight } = req.body;
  try {
    const room = await Room.create({ hotelId, roomNumber, type, pricePerNight });
    res.json(room);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Room number already exists for this hotel' });
    }
    res.status(500).json({ error: 'Failed to add room: ' + e.message });
  }
};

exports.getMyHotels = async (req, res) => {
  try {
    const hotels = await Hotel.findAll({ where: { adminId: req.user.id } });
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.viewBookings = async (req, res) => {
  try {
    const hotels = await Hotel.findAll({ where: { adminId: req.user.id }, attributes: ['id'] });
    const hotelIds = hotels.map(h => h.id);
    const bookings = await Booking.findAll({
      where: { hotelId: { [Op.in]: hotelIds } },
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: Room }
      ]
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRevenue = async (req, res) => {
  try {
    const hotels = await Hotel.findAll({ where: { adminId: req.user.id }, attributes: ['id'] });
    const hotelIds = hotels.map(h => h.id);
    const revenue = await Booking.sum('totalPrice', {
      where: {
        hotelId: { [Op.in]: hotelIds },
        status: 'confirmed'
      }
    });
    res.json({ totalRevenue: revenue || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const hotels = await Hotel.findAll({ where: { adminId: req.user.id }, attributes: ['id'] });
    const hotelIds = hotels.map(h => h.id);

    const totalHotels = hotelIds.length;
    const totalRooms = await Room.count({ where: { hotelId: { [Op.in]: hotelIds } } });

    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);

    const occupiedRoomsToday = await Booking.count({
      where: {
        hotelId: { [Op.in]: hotelIds },
        status: 'confirmed',
        checkIn: { [Op.lte]: endOfDay },
        checkOut: { [Op.gt]: startOfDay }
      }
    });

    const in7 = new Date(startOfDay); in7.setDate(in7.getDate() + 7);
    const upcomingCheckins = await Booking.count({
      where: {
        hotelId: { [Op.in]: hotelIds },
        status: 'confirmed',
        checkIn: { [Op.gte]: startOfDay, [Op.lte]: in7 }
      }
    });

    const totalRevenue = await Booking.sum('totalPrice', {
      where: { hotelId: { [Op.in]: hotelIds }, status: 'confirmed' }
    });

    const since30 = new Date(); since30.setDate(since30.getDate() - 30);
    const revenueLast30 = await Booking.sum('totalPrice', {
      where: {
        hotelId: { [Op.in]: hotelIds },
        status: 'confirmed',
        createdAt: { [Op.gte]: since30 }
      }
    });

    const recentBookings = await Booking.findAll({
      where: { hotelId: { [Op.in]: hotelIds } },
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: Hotel, attributes: ['name'] },
        { model: Room }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({
      totals: {
        totalHotels,
        totalRooms,
        occupiedRoomsToday,
        upcomingCheckins,
        totalRevenue: totalRevenue || 0,
        revenueLast30: revenueLast30 || 0
      },
      recentBookings
    });
  } catch (e) {
    res.status(500).json({ message: 'Server error: ' + e.message });
  }
};
