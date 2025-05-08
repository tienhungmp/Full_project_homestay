const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // For refresh token generation

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Generate refresh token
const generateRefreshToken = async (userId) => {
    const refreshToken = crypto.randomBytes(40).toString('hex');
    // Default to 7 days if JWT_REFRESH_EXPIRE is not set
    const refreshExpire = process.env.JWT_REFRESH_EXPIRE || '7d';
    const days = parseInt(refreshExpire.replace('d', '') || '7');
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
        user: userId,
        token: refreshToken,
        expires: expires
    });

    return refreshToken;
};

// @desc    Đăng ký người dùng
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirm_password, role } = req.body;
  
  // Check if passwords match
  if (password !== confirm_password) {
    return next(new ErrorResponse('Mật khẩu xác nhận không khớp', 400));
  }

  // Tạo người dùng
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Đăng nhập người dùng
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Vui lòng cung cấp email và mật khẩu', 400));
  }

  // Kiểm tra người dùng
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Thông tin đăng nhập không hợp lệ', 401));
  }

  // Kiểm tra mật khẩu
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Thông tin đăng nhập không hợp lệ', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Lấy thông tin người dùng hiện tại
// @route   GET /api/users/me (Sẽ đổi thành /api/auth/me sau)
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // req.user được gán từ middleware protect
  const user = await User.findById(req.user.id);

  if (!user) {
      return next(new ErrorResponse('Người dùng không tìm thấy', 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (cần refresh token)
exports.refreshToken = asyncHandler(async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new ErrorResponse('Vui lòng cung cấp refresh token', 400));
    }

    // Tìm refresh token trong DB
    const storedToken = await RefreshToken.findOne({ token: refreshToken });

    if (!storedToken) {
        return next(new ErrorResponse('Refresh token không hợp lệ', 401));
    }

    // Kiểm tra token hết hạn
    if (storedToken.expires < new Date()) {
        await storedToken.remove();
        return next(new ErrorResponse('Refresh token đã hết hạn', 401));
    }

    // Tìm người dùng tương ứng
    const user = await User.findById(storedToken.user);
    if (!user) {
        return next(new ErrorResponse('Người dùng không tồn tại', 401));
    }

    // Tạo access token mới
    const accessToken = generateToken(user._id);

    res.status(200).json({
        success: true,
        accessToken
    });
});


// @desc    Đăng xuất người dùng
// @route   POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
    // Client nên xóa access token
    // Nếu sử dụng refresh token, xóa nó khỏi DB
    const { refreshToken } = req.body; // Giả sử client gửi refresh token khi logout
    if (refreshToken) {
        await RefreshToken.deleteOne({ token: refreshToken });
    }

    // Nếu dùng cookie:
    // res.cookie('token', 'none', {
    //     expires: new Date(Date.now() + 10 * 1000),
    //     httpOnly: true
    // });

    res.status(200).json({
        success: true,
        data: {}
    });
});


// Helper function để gửi token response
const sendTokenResponse = async (user, statusCode, res) => {
  // Tạo token
  const token = generateToken(user._id);
  const refreshToken = await generateRefreshToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Không gửi mật khẩu về client
  user.password = undefined;

  res
    .status(statusCode)
    // .cookie('token', token, options) // Option: Gửi token qua cookie
    .json({
      success: true,
      tokens: { access: token, refresh: refreshToken},
      user: user // Gửi thông tin user về client
    });
};