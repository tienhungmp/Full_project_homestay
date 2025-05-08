const Booking = require('../models/Booking');
const Homestay = require('../models/Homestay');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Lấy tất cả các booking
// @route   GET /api/bookings
// @route   GET /api/homestays/:homestayId/bookings
// @access  Private (Admin, Host, User)
exports.getBookings = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.homestayId) {
        // Lấy booking cho một homestay cụ thể
        query = Booking.find({ homestay: req.params.homestayId });
    } else {
        // Lấy tất cả booking (Admin) hoặc booking của user/host
        if (req.user.role === 'admin') {
            query = Booking.find();
        } else if (req.user.role === 'host') {
            // Host chỉ xem được booking của homestay họ sở hữu
            const hostHomestays = await Homestay.find({ host: req.user.id }).select('_id');
            const hostHomestayIds = hostHomestays.map(h => h._id);
            query = Booking.find({ homestay: { $in: hostHomestayIds } });
        } else { // user
            query = Booking.find({ user: req.user.id });
        }
    }

    query = query.populate('homestay', 'name address').populate('user', 'name email');

    const bookings = await query;

    res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
    });
});

// @desc    Lấy chi tiết một booking
// @route   GET /api/bookings/:id
// @access  Private (Admin, Host sở hữu, User sở hữu)
exports.getBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id)
        .populate('homestay', 'name address host')
        .populate('user', 'name email');

    if (!booking) {
        return next(
            new ErrorResponse(`Không tìm thấy booking với id ${req.params.id}`, 404)
        );
    }

    // Kiểm tra quyền truy cập
    // Admin có thể xem mọi booking
    // Host chỉ xem được booking của homestay mình
    // User chỉ xem được booking của mình
    const isOwner = booking.user._id.toString() === req.user.id;
    const isHostOwner = booking.homestay.host.toString() === req.user.id;

    if (req.user.role !== 'admin' && !isOwner && !(req.user.role === 'host' && isHostOwner)) {
         return next(new ErrorResponse('Không có quyền xem thông tin đặt phòng này', 403));
    }

    res.status(200).json({
        success: true,
        data: booking
    });
});

// @desc    Tạo mới booking
// @route   POST /api/homestays/:homestayId/bookings
// @access  Private (User)
exports.createBooking = asyncHandler(async (req, res, next) => {
    req.body.homestay = req.params.homestayId;
    req.body.user = req.user.id; // Gán user là người đang đăng nhập

    const homestay = await Homestay.findById(req.params.homestayId);

    if (!homestay) {
        return next(
            new ErrorResponse(`Không tìm thấy homestay với id ${req.params.homestayId}`, 404)
        );
    }

    // Tính toán totalPrice dựa trên giá homestay và số ngày ở (cần logic chi tiết hơn)
    const checkIn = new Date(req.body.checkInDate);
    const checkOut = new Date(req.body.checkOutDate);
    const daysOfStay = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (daysOfStay <= 0) {
        return next(new ErrorResponse('Ngày trả phòng phải sau ngày nhận phòng', 400));
    }

    req.body.totalPrice = daysOfStay * homestay.price;

    const booking = await Booking.create(req.body);

    res.status(201).json({
        success: true,
        data: booking
    });
});

// @desc    Hủy đặt phòng
// @route   PUT /api/bookings/:id/cancel
// @access  Private (User sở hữu hoặc Admin)
exports.cancelBooking = asyncHandler(async (req, res, next) => {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
        return next(
            new ErrorResponse(`Không tìm thấy booking với id ${req.params.id}`, 404)
        );
    }

    // Chỉ user tạo booking hoặc admin mới được hủy
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`Không có quyền hủy đặt phòng này`, 401)
        );
    }

    // Kiểm tra xem booking có thể hủy không (ví dụ: chưa đến ngày check-in)
    if (booking.bookingStatus === 'cancelled' || booking.bookingStatus === 'completed') {
        return next(new ErrorResponse(`Booking này không thể hủy`, 400));
    }

    // Cập nhật trạng thái
    booking.bookingStatus = 'cancelled';
    // Có thể thêm logic hoàn tiền ở đây nếu trạng thái thanh toán là 'paid'
    if (booking.paymentStatus === 'paid') {
        // Logic hoàn tiền...
        booking.paymentStatus = 'refunded'; // Ví dụ
    }

    await booking.save();

    res.status(200).json({
        success: true,
        data: booking
    });
});

// @desc    Cập nhật booking (Admin/Host có thể xác nhận)
// @route   PUT /api/bookings/:id
// @access  Private (Admin, Host sở hữu)
exports.updateBooking = asyncHandler(async (req, res, next) => {
    let booking = await Booking.findById(req.params.id).populate('homestay', 'host');

    if (!booking) {
        return next(
            new ErrorResponse(`Không tìm thấy booking với id ${req.params.id}`, 404)
        );
    }

    // Chỉ Admin hoặc Host sở hữu homestay mới được cập nhật (ví dụ: xác nhận booking)
    const isHostOwner = booking.homestay.host.toString() === req.user.id;
    if (req.user.role !== 'admin' && !(req.user.role === 'host' && isHostOwner)) {
        return next(new ErrorResponse('Không có quyền cập nhật đặt phòng này', 403));
    }

    // Chỉ cho phép cập nhật một số trường nhất định, ví dụ: bookingStatus, paymentStatus
    const { bookingStatus, paymentStatus } = req.body;
    const fieldsToUpdate = {};
    if (bookingStatus) fieldsToUpdate.bookingStatus = bookingStatus;
    if (paymentStatus) fieldsToUpdate.paymentStatus = paymentStatus;

    if (Object.keys(fieldsToUpdate).length === 0) {
        return next(new ErrorResponse('Không có thông tin cập nhật nào được cung cấp', 400));
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: booking
    });
});

// @desc    Xóa booking (Admin only - thường không nên xóa hẳn)
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
exports.deleteBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        return next(
            new ErrorResponse(`Không tìm thấy booking với id ${req.params.id}`, 404)
        );
    }

    // Chỉ Admin mới được xóa (cân nhắc kỹ việc xóa hẳn booking)
    if (req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`Không có quyền xóa đặt phòng này`, 403)
        );
    }

    await booking.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});