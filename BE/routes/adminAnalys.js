const express = require('express');
const {getTotalAnalysis, getAllHomestays, getAllUsers, getAllBookings, getAllReviews} = require('../controllers/adminAnalys');
const { protect, authorize } = require('../middlewares/auth');
const router = express.Router();

router.route('/').get(protect, authorize('admin') ,getTotalAnalysis);
router.route('/list-homestays').get(protect, authorize('admin'), getAllHomestays);
router.route('/all-user').get(protect, authorize('admin'), getAllUsers);
router.route('/all-bookings').get(protect, authorize('admin'), getAllBookings);
router.route('/all-reviews').get(protect, authorize('admin'), getAllReviews);

module.exports = router;