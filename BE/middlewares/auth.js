const jwt = require('jsonwebtoken');
const asyncHandler = require('./async'); // Sẽ tạo file này sau
const ErrorResponse = require('../utils/errorResponse'); // Sẽ tạo file này sau
const User = require('../models/User');

// Bảo vệ routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } 
  // else if (req.cookies.token) { // Option: Set token from cookie
  //   token = req.cookies.token;
  // }

  // Đảm bảo token tồn tại
  if (!token) {
    return next(new ErrorResponse('Không có quyền truy cập vào route này', 401));
  }

  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
        return next(new ErrorResponse('Người dùng không tồn tại', 401));
    }

    next();
  } catch (err) {
    console.error(err);
    return next(new ErrorResponse('Không có quyền truy cập vào route này', 401));
  }
});

// Cấp quyền truy cập cho các vai trò cụ thể
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
        return next(
            new ErrorResponse('Người dùng chưa đăng nhập', 401)
          );
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Vai trò người dùng (${req.user.role}) không được phép truy cập route này`,
          403
        )
      );
    }
    next();
  };
};