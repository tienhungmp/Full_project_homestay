const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Cập nhật thông tin người dùng
// @route   PUT /api/users/:id
// @access  Private (User can update own profile, Admin can update any)
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Lấy các trường có thể cập nhật từ body
  const { name, email } = req.body;
  const fieldsToUpdate = {};
  if (name) fieldsToUpdate.name = name;
  if (email) fieldsToUpdate.email = email;
  // Không cho phép cập nhật mật khẩu hoặc vai trò qua route này

  // Kiểm tra xem người dùng có tồn tại không và có quyền cập nhật không
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`Không tìm thấy người dùng với id ${req.params.id}`, 404)
    );
  }

  // Kiểm tra quyền: User chỉ được cập nhật profile của chính mình, Admin được cập nhật của bất kỳ ai
  if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Không có quyền thực hiện hành động này', 403));
  }

  // Thực hiện cập nhật
  user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true, // Trả về document đã được cập nhật
    runValidators: true, // Chạy validators của Mongoose
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
    if (req.user.role !== 'admin' && req.params.id !== req.user.id) {
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