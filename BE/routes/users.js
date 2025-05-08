const express = require('express');
const {
  updateUser,
  getUsers, // Thêm hàm này nếu bạn muốn admin lấy danh sách users
  getUser   // Thêm hàm này nếu bạn muốn admin lấy chi tiết user
} = require('../controllers/users');

const User = require('../models/User'); // Cần thiết nếu dùng advancedResults

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');

// Tất cả các route dưới đây đều yêu cầu đăng nhập
router.use(protect);

// Chỉ admin mới có quyền xem danh sách hoặc chi tiết người dùng khác
router.route('/')
  .get(authorize('admin'), advancedResults(User), getUsers);

router.route('/:id')
  .get(authorize('admin'), getUser);

// Người dùng có thể cập nhật thông tin của chính họ, admin có thể cập nhật của bất kỳ ai
router.route('/:id').put(updateUser);

module.exports = router;