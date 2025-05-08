const express = require('express');
const {
  register,
  login,
  getMe,
  refreshToken,
  logout
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe); // Đã chuyển getMe vào đây thay vì /users/me
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout); // Cần protect để biết user nào logout

module.exports = router;