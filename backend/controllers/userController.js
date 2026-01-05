const Hotel = require('../models/hotel');
const Room = require('../models/room');
const Booking = require('../models/booking');
const { Op } = require('sequelize');

exports.browseHotels = async (req, res) => {
  try {
    const { city, name, minPrice, maxPrice } = req.query;
    const checkIn = req.query.checkIn;
    const checkOut = req.query.checkOut;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

    const hotelWhere = {};
    if (city) hotelWhere.city = { [Op.like]: `%${city}%` };
    if (name) hotelWhere.name = { [Op.like]: `%${name}%` };

    const roomInclude = {
      model: Room,
      required: false,
      where: {}
    };

    if (minPrice != null || maxPrice != null) {
      roomInclude.required = true;
      if (minPrice != null) roomInclude.where.pricePerNight = { ...roomInclude.where.pricePerNight, [Op.gte]: Number(minPrice) };
      if (maxPrice != null) roomInclude.where.pricePerNight = { ...roomInclude.where.pricePerNight, [Op.lte]: Number(maxPrice) };
    }

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (!isNaN(checkInDate) && !isNaN(checkOutDate) && checkInDate < checkOutDate) {
        // Find bookings that overlap with requested dates
        const overlappingBookings = await Booking.findAll({
          where: {
            status: 'confirmed',
            [Op.and]: [
              { checkIn: { [Op.lt]: checkOutDate } },
              { checkOut: { [Op.gt]: checkInDate } }
            ]
          },
          attributes: ['roomId']
        });
        const bookedRoomIds = overlappingBookings.map(b => b.roomId);

        roomInclude.required = true;
        roomInclude.where.id = { [Op.notIn]: bookedRoomIds };
      }
    }

    const { count, rows: hotels } = await Hotel.findAndCountAll({
      where: hotelWhere,
      include: [roomInclude],
      distinct: true,
      limit: limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      data: hotels,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit) || 1
      }
    });
  } catch (e) {
    res.status(500).json({ message: 'Server error: ' + e.message });
  }
};

exports.hotelDetails = async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    const rooms = await Room.findAll({ where: { hotelId: hotel.id } });
    res.json({ hotel, rooms });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.hotelAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) return res.status(400).json({ message: 'checkIn and checkOut are required' });

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkInDate) || isNaN(checkOutDate) || checkInDate >= checkOutDate) {
      return res.status(400).json({ message: 'Invalid dates' });
    }

    const rooms = await Room.findAll({ where: { hotelId: id } });
    const roomIds = rooms.map(r => r.id);

    const overlappingBookings = await Booking.findAll({
      where: {
        roomId: { [Op.in]: roomIds },
        status: 'confirmed',
        [Op.and]: [
          { checkIn: { [Op.lt]: checkOutDate } },
          { checkOut: { [Op.gt]: checkInDate } }
        ]
      },
      attributes: ['roomId']
    });

    const bookedIdsSet = new Set(overlappingBookings.map(b => b.roomId));
    const availability = rooms.map(r => ({
      roomId: r.id,
      remaining: bookedIdsSet.has(r.id) ? 0 : 1
    }));

    res.json({ availability });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};
