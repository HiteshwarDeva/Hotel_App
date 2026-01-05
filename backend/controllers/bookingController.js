const Booking = require('../models/booking');
const Room = require('../models/room');
const Hotel = require('../models/hotel');
const User = require('../models/user');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

const generateBookingRef = () => {
  return 'BOOK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

exports.bookRoom = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { hotelId, roomId, checkIn, checkOut } = req.body;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      await transaction.rollback();
      return res.status(400).json({ message: "Check-out must be after check-in" });
    }

    const room = await Room.findByPk(roomId, { transaction });
    if (!room) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Room not found' });
    }

    const overlappingCount = await Booking.count({
      where: {
        roomId: roomId,
        status: 'confirmed',
        [Op.and]: [
          { checkIn: { [Op.lt]: checkOutDate } },
          { checkOut: { [Op.gt]: checkInDate } }
        ]
      },
      transaction
    });

    if (overlappingCount > 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'No rooms available for the selected dates' });
    }

    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const totalPrice = nights * room.pricePerNight;

    const booking = await Booking.create({
      userId: req.user.id,
      hotelId,
      roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      status: "confirmed",
    }, { transaction });

    await transaction.commit();
    const bookingRef = generateBookingRef();
    res.status(201).json({ ...booking.toJSON(), bookingRef });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const cutoff = new Date(booking.checkIn); cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - 1);

    if (today >= cutoff) {
      return res.status(400).json({ message: 'Cancellation window has passed' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelBookingByHotelAdmin = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const hotels = await Hotel.findAll({ where: { adminId: req.user.id }, attributes: ['id'] });
    const ownedIds = hotels.map(h => h.id);

    if (!ownedIds.includes(booking.hotelId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const cutoff = new Date(booking.checkIn); cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - 1);
    if (today >= cutoff) return res.status(400).json({ message: 'Cancellation window passed' });

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Cancelled by hotel admin', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelBookingBySuperAdmin = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Cancelled by super admin', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.myBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [Hotel, Room],
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.hotelBookings = async (req, res) => {
  try {
    const hotels = await Hotel.findAll({ where: { adminId: req.user.id }, attributes: ['id'] });
    const hotelIds = hotels.map(h => h.id);
    const bookings = await Booking.findAll({
      where: { hotelId: { [Op.in]: hotelIds } },
      include: [User, Hotel, Room],
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.allBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [User, Hotel, Room],
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
