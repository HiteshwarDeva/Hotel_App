const router = require('express').Router();
const {
  browseHotels,
  hotelDetails,
  hotelAvailability
} = require('../controllers/userController');

// Browse hotels
router.get('/hotels', browseHotels);

// Get hotel details + rooms
router.get('/hotels/:id', hotelDetails);

// Get date-aware availability per room for a hotel
router.get('/hotels/:id/availability', hotelAvailability);


module.exports = router;
