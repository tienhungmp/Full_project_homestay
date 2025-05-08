const express = require('express');
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviews'); // Sẽ tạo file này sau

const Review = require('../models/Review');

// MergeParams: true để lấy được :homestayId từ router cha (homestays)
const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');

router
  .route('/')
  .get(advancedResults(Review, {
    path: 'homestay user',
    select: 'name description'
  }), getReviews) // Sử dụng advancedResults
  .post(protect, authorize('user', 'admin'), addReview);

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;