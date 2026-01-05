// backend/routes/bookingRoutes.js
const router = require('express').Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
  bookRoom,
  cancelBooking,
  myBookings,
  hotelBookings,
  allBookings,
  cancelBookingByHotelAdmin,
  cancelBookingBySuperAdmin
} = require('../controllers/bookingController');

// User routes
router.use(protect);

// User: Book a room
router.post('/book-room', authorize('user'), bookRoom);

// User: Cancel booking
router.put('/cancel/:id', authorize('user'), cancelBooking);

// User: My bookings
router.get('/my-bookings', authorize('user'), myBookings);

// Hotel Admin: bookings for their hotels
router.get('/hotel/bookings', authorize('hoteladmin'), hotelBookings);
// Hotel Admin: cancel a booking for their hotel (within policy window)
router.put('/admin/cancel/:id', authorize('hoteladmin'), cancelBookingByHotelAdmin);

// Super Admin: all bookings
router.get('/all', authorize('superadmin'), allBookings);
// Super Admin: cancel any booking (within policy window)
router.put('/superadmin/cancel/:id', authorize('superadmin'), cancelBookingBySuperAdmin);

module.exports = router;
