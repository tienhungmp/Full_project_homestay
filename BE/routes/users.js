const express = require('express');
const {
  updateUser,
  getUsers,
  getUser,
  changePassword,
  updateUserStatus
} = require('../controllers/users');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');

router.use(protect);

// Chỉ admin mới có quyền xem danh sách hoặc chi tiết người dùng khác
router.route('/')
  .get(authorize('admin'), advancedResults(User), getUsers);

router.route('/update-status')
  .put(protect, authorize('admin'), updateUserStatus);

router.route('/:id/change-password').put(changePassword);

router.route('/:id').put(updateUser);

router.route('/:id')
  .get(protect, getUser);

module.exports = router;