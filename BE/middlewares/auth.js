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


// Check if device is already logged in
exports.checkDevice = asyncHandler(async (req, res, next) => {
  // Get device info from request
  const deviceId = req.headers['device-id'];
  const deviceType = req.headers['device-type'];

  if (!deviceId || !deviceType) {
    return next(new ErrorResponse('Device information is required', 400));
  }

  try {
    // Check if user exists
    if (!req.user) {
      return next(new ErrorResponse('User not found', 401));
    }

    // Check if device is in user's devices list
    const isDeviceRegistered = req.user.devices.some(
      device => device.deviceId === deviceId && device.deviceType === deviceType
    );

    if (!isDeviceRegistered) {
      // Add new device to user's devices list
      req.user.devices.push({
        deviceId,
        deviceType,
        lastLogin: Date.now()
      });
      await req.user.save();
    } else {
      // Update last login time for existing device
      await User.updateOne(
        { 
          _id: req.user._id,
          'devices.deviceId': deviceId 
        },
        { 
          $set: { 'devices.$.lastLogin': Date.now() }
        }
      );
    }

    next();
  } catch (err) {
    console.error(err);
    return next(new ErrorResponse('Error processing device information', 500));
  }
});

// Remove device from user's devices list
exports.removeDevice = asyncHandler(async (req, res, next) => {
  const { deviceId } = req.params;

  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Remove device from devices array
    user.devices = user.devices.filter(device => device.deviceId !== deviceId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Device removed successfully'
    });
  } catch (err) {
    console.error(err);
    return next(new ErrorResponse('Error removing device', 500));
  }
});
