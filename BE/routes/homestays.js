const express = require('express');
const {
  getHomestays,
  getHomestay,
  createHomestay,
  updateHomestay,
  deleteHomestay,
  homestayPhotoUpload,
  getTopRatedHomestays,
  getHomestaysByHost,
  checkHomestayAvailability,
  getAvailableDates
} = require('../controllers/homestays');

const Homestay = require('../models/Homestay'); // Cần cho advancedResults nếu dùng

// Include other resource routers
const bookingRouter = require('./bookings');
const reviewRouter = require('./reviews');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');

// Re-route into other resource routers
router.use('/:homestayId/bookings', bookingRouter);
router.use('/:homestayId/reviews', reviewRouter);

// Route cho upload ảnh (cần middleware upload)
// Ví dụ: router.route('/:id/photo').put(protect, authorize('host', 'admin'), homestayPhotoUpload);
// Cần cài đặt và cấu hình multer trước khi dùng route này

router
  .route('/')
  .get(advancedResults(Homestay,  {
    path: 'reviews',
    populate: {
      path: 'user',
      select: 'name avatar' 
    }
  }), getHomestays) // Sử dụng advancedResults, populate reviews
  .post(protect, authorize('host', 'admin'), createHomestay);


router.get('/top-rated', getTopRatedHomestays);

router.route('/getHomestaysByHost').get(protect, authorize('host'), getHomestaysByHost)

router.route('/check-availability').get(checkHomestayAvailability)

router.route('/available-dates').get(getAvailableDates)

router
  .route('/:id')
  .get(getHomestay)
  .put(protect, authorize('host', 'admin'), updateHomestay)
  .delete(protect, authorize('host', 'admin'), deleteHomestay);


module.exports = router;