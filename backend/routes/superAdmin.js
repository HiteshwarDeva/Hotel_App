// backend/routes/superAdmin.js
const router = require('express').Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
  getStats,
  getAllUsers,
  deleteUser,
  getPendingAdmins,
  approveAdmin,
  rejectAdmin,
  deleteAdmin,
  bookingsPerHotel
} = require('../controllers/superAdminController');

router.use(protect, authorize('superadmin'));

// Stats
router.get('/stats', getStats);

// Users
router.get('/manage-users', getAllUsers);
router.delete('/manage-users/:id', deleteUser);

// Hotel Admins
router.get('/pending-admins', getPendingAdmins);
router.put('/pending-admins/:id/approve', approveAdmin);
router.put('/pending-admins/:id/reject', rejectAdmin);
router.delete('/manage-admins/:id', deleteAdmin);

router.get('/bookings-per-hotel', bookingsPerHotel);

module.exports = router;
