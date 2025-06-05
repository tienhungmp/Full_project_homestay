const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Cập nhật thông tin người dùng
// @route   PUT /api/users/:id
// @access  Private (User can update own profile, Admin can update any)
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Lấy các trường có thể cập nhật từ body
  const { name, phone, address } = req.body;
  const fieldsToUpdate = {};
  if (name) fieldsToUpdate.name = name;
  if (phone) fieldsToUpdate.phone = phone;
  if (address) fieldsToUpdate.address = address;
  // Không cho phép cập nhật mật khẩu hoặc vai trò qua route này

  // Kiểm tra xem người dùng có tồn tại không và có quyền cập nhật không
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`Không tìm thấy người dùng với id ${req.params.id}`, 404)
    );
  }

  if (user._id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return next(new ErrorResponse('Không có quyền thực hiện hành động này', 403));
  }

  user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Lấy tất cả người dùng (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    // Chỉ Admin mới có quyền lấy danh sách tất cả người dùng
    if (req.user.role !== 'admin') {
        return next(new ErrorResponse('Không có quyền truy cập route này', 403));
    }
    res.status(200).json(res.advancedResults); // Giả sử có middleware advancedResults
});

// @desc    Lấy một người dùng (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    // Chỉ Admin mới có quyền lấy thông tin người dùng khác
    // Người dùng thông thường nên dùng /api/auth/me
    if (req.user.role !== 'admin' && req.params.id.toString() !== req.user.id.toString()) {
         return next(new ErrorResponse('Không có quyền truy cập thông tin người dùng này', 403));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorResponse(`Không tìm thấy người dùng với id ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// Các hàm khác cho quản lý user (Admin) có thể thêm ở đây: createUser, deleteUser

// @desc    Change user password
// @route   PUT /api/users/:id/changepassword
// @access  Private (User can change own password, Admin can change any)
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Check if passwords are provided
  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse('Please provide current and new password', 400));
  }

  // Get user
  const user = await User.findById(req.params.id).select('+password');

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id ${req.params.id}`, 404)
    );
  }

  // Check permissions: User can only change their own password, Admin can change any
  if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to change this password', 403));
  }

  // Check if current password matches
  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  // Set new password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});


// @desc    Update user account status
// @route   PUT /api/users/update-status/
// @access  Private/Admin
exports.updateUserStatus = asyncHandler(async (req, res, next) => {
  const { status, idUser } = req.body;

  // Check if status is provided
  if (!status) {
    return next(new ErrorResponse('Please provide account status', 400));
  }

  // Only admin can update status
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update account status', 403));
  }

  // Find user and update status
  let user = await User.findById(idUser);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id ${idUser}`, 404)
    );
  }

  user = await User.findByIdAndUpdate(
    idUser,
    { status },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = asyncHandler(async (req, res, next) => {
  const { idUser, role } = req.body;

  // Check if role is provided
  if (!role) {
    return next(new ErrorResponse('Please provide user role', 400));
  }

  // Only admin can update roles
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update user roles', 403));
  }

  // Find user and update role
  let user = await User.findById(idUser);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id ${idUser}`, 404)
    );
  }

  user = await User.findByIdAndUpdate(
    idUser,
    { role },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: user
  });
});
