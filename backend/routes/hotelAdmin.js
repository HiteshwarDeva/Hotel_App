const router = require('express').Router();
const { protect, authorize, requireApprovedHotelAdmin } = require('../middlewares/authMiddleware');
const {
  addHotel,
  addRoom,
  getMyHotels,
  viewBookings,
  getRevenue,
  getDashboardStats
} = require('../controllers/hotelAdminController');

router.use(protect, authorize('hoteladmin'), requireApprovedHotelAdmin);

// Hotel management
router.post('/add-hotel', addHotel);
router.get('/my-hotels', getMyHotels);

// Room management
router.post('/add-room', addRoom);

// View bookings & revenue
router.get('/bookings', viewBookings);
router.get('/revenue', getRevenue);
router.get('/dashboard/stats', getDashboardStats);

module.exports = router;
