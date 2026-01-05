const User = require('../models/user');
const Hotel = require('../models/hotel');
const Booking = require('../models/booking');
const { Op, fn, col } = require('sequelize');

// --- STATS ENDPOINT ---
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'user' } });
    const totalHotelAdmins = await User.count({ where: { role: 'hoteladmin', status: 'approved' } });
    const pendingHotelAdmins = await User.count({ where: { role: 'hoteladmin', status: 'pending' } });
    const totalHotels = await Hotel.count();
    const totalBookings = await Booking.count();

    const totalRevenue = await Booking.sum('totalPrice', {
      where: { status: 'confirmed' }
    });

    res.json({
      totalUsers,
      totalHotelAdmins,
      pendingHotelAdmins,
      totalHotels,
      totalBookings,
      totalRevenue: totalRevenue || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// --- USER MANAGEMENT ---
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'user' },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- HOTEL ADMIN MANAGEMENT ---
exports.getPendingAdmins = async (req, res) => {
  try {
    const pendingAdmins = await User.findAll({
      where: { role: 'hoteladmin', status: 'pending' }
    });
    res.json(pendingAdmins);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveAdmin = async (req, res) => {
  try {
    const admin = await User.findByPk(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    admin.status = 'approved';
    await admin.save();
    res.json({ message: 'Hotel admin approved', admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.rejectAdmin = async (req, res) => {
  try {
    const admin = await User.findByPk(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    admin.status = 'rejected';
    await admin.save();
    res.json({ message: 'Hotel admin rejected', admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findByPk(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    await admin.destroy();
    res.json({ message: 'Hotel admin removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET bookings per hotel
exports.bookingsPerHotel = async (req, res) => {
  try {
    const data = await Booking.findAll({
      where: { status: 'confirmed' },
      attributes: [
        'hotelId',
        [fn('COUNT', col('Booking.id')), 'bookings']
      ],
      include: [
        { model: Hotel, attributes: ['name'] }
      ],
      group: ['hotelId', 'Hotel.id']
    });

    const formattedData = data.map(item => ({
      hotelName: item.Hotel ? item.Hotel.name : 'Unknown',
      bookings: item.get('bookings')
    }));

    res.json(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};
