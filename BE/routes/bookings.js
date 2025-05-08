const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking
} = require('../controllers/bookings'); // Sẽ tạo file này sau

const Booking = require('../models/Booking');

// MergeParams: true để lấy được :homestayId từ router cha (homestays)
const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');

router
  .route('/')
  .get(protect, advancedResults(Booking, {
    path: 'homestay user',
    select: 'name description email address' // Chọn các trường cần populate
  }), getBookings) // Sử dụng advancedResults và protect
  .post(protect, authorize('user'), createBooking); // Chỉ user mới tạo được booking

router
  .route('/:id')
  .get(protect, getBooking) // Chỉ user liên quan hoặc host/admin mới xem được
  .put(protect, authorize('user', 'admin'), updateBooking) // Chỉ user tạo hoặc admin mới sửa được
  .delete(protect, authorize('user', 'admin'), deleteBooking); // Chỉ user tạo hoặc admin mới xóa được

module.exports = router;