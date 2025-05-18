const Booking = require('../models/Booking');
const Homestay = require('../models/Homestay');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const sortObject = require('../utils/objectHelpers');
const { ProductCode, VnpLocale, dateFormat, VNPay, ignoreLogger } = require('vnpay');

const vnpay = new VNPay({
    tmnCode: "H0CR4KOU",
    secureSecret: "BK3LD51V5KHBV5TWWNYNQGN0XASUV7ZU",
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true, // tùy chọn, ghi đè vnpayHost thành sandbox nếu là true
    hashAlgorithm: 'SHA512', // tùy chọn
    enableLog: true, // tùy chọn
    loggerFn: ignoreLogger, // tùy chọn
    endpoints: {
        paymentEndpoint: 'paymentv2/vpcpay.html',
        queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
        getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
    }, // tùy chọn
});

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

    res.status(200).json({
        success: true,
        data: booking
    });
});

// @desc    Tạo mới booking
// @route   POST /api/homestays/:homestayId/bookings
// @access  Private (User)
exports.createBooking = asyncHandler(async (req, res, next) => {
    const {
        userId,
        propertyId,
        checkIn,
        checkOut,
        guestCount,
        totalPrice,
        bookingStatus,
        paymentStatus
    } = req.body;

    // console.log(req.user._id.toString())

    // 1. Kiểm tra homestay tồn tại
    const homestay = await Homestay.findById(propertyId);
    if (!homestay) {
        return next(
            new ErrorResponse(`Không tìm thấy homestay với id ${propertyId}`, 404)
        );
    }

    // 2. Kiểm tra ngày hợp lệ
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const daysOfStay = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (daysOfStay <= 0) {
        return next(new ErrorResponse('Ngày trả phòng phải sau ngày nhận phòng', 400));
    }

    // 3. Kiểm tra xem đã có người đặt và thanh toán trong khoảng thời gian này chưa
    const existingBooking = await Booking.findOne({
        homestay: propertyId,
        paymentStatus: 'paid',
        $or: [
            {
                checkInDate: { $lt: checkOutDate },
                checkOutDate: { $gt: checkInDate }
            }
        ]
    });

    if (existingBooking) {
        return next(new ErrorResponse('Homestay này đã được đặt trong khoảng thời gian bạn chọn.', 400));
    }

    // 4. Tạo booking
    const booking = await Booking.create({
        user: userId,
        homestay: propertyId,
        checkInDate,
        checkOutDate,
        numberOfGuests: guestCount,
        totalPrice,
        bookingStatus,
        paymentStatus,
    });

    res.status(201).json({
        success: true,
        data: booking
    });
});

exports.createPayment = asyncHandler(async (req, res, next) => {
    const { totalPrice, orderId } = req.body;

    const tomorrow = new Date();
    tomorrow.setMinutes(tomorrow.getMinutes() + 15);
    
    const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: totalPrice,
        vnp_IpAddr: '13.160.92.202',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: 'Thanh toan don hang 123456',
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: `http://localhost:8080/payment-success?orderid=${orderId}`,
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(tomorrow),
    });

    
    res.json({
        success: true,
        data: paymentUrl
    });
})

exports.paymentSuccess = asyncHandler(async (req, res, next) => {
    const { status, orderId } = req.body;

    if (status === 'success') {
        const booking = await Booking.findOne({ _id: orderId });

        if (!booking) {
            return next(new ErrorResponse('Không tìm thấy đơn đặt phòng', 404));
        }

        booking.paymentStatus = 'paid';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Cập nhật trạng thái thanh toán thành công',
            data: booking
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'Thanh toán không thành công hoặc bị huỷ'
        });
    }
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

// @desc    Get revenue statistics
// @route   GET /api/bookings/revenue
// @access  Private (Admin)
exports.getRevenue = asyncHandler(async (req, res, next) => {
    const { periodType, count } = req.query;
    
    // Only admin can access revenue data
    if (req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to access revenue data', 403));
    }

    let startDate = new Date();
    let groupFormat;
    
    // Set date range based on period type
    switch(periodType) {
        case 'day':
            startDate.setDate(startDate.getDate() - count);
            groupFormat = { $dateToString: { format: "%Y-%m-%d", date: "$checkInDate" } };
            break;
        case 'month':
            startDate.setMonth(startDate.getMonth() - count);
            groupFormat = { $dateToString: { format: "%Y-%m", date: "$checkInDate" } };
            break;
        case 'year':
            startDate.setFullYear(startDate.getFullYear() - count);
            groupFormat = { $dateToString: { format: "%Y", date: "$checkInDate" } };
            break;
        default:
            return next(new ErrorResponse('Invalid period type. Use day, month, or year', 400));
    }

    const revenue = await Booking.aggregate([
        {
            $match: {
                checkInDate: { $gte: startDate },
                paymentStatus: 'paid'
            }
        },
        {
            $group: {
                _id: groupFormat,
                revenue: { $sum: "$totalPrice" }
            }
        },
        {
            $project: {
                _id: 0,
                date: "$_id",
                revenue: 1,
                name: "$_id"
            }
        },
        {
            $sort: { date: 1 }
        }
    ]);

    res.status(200).json({
        success: true,
        count: revenue.length,
        data: revenue
    });
});


// @desc    Get revenue statistics for host
// @route   GET /api/bookings/host-revenue
// @access  Private (Host)
exports.getHostRevenue = asyncHandler(async (req, res, next) => {
    const { periodType, count, hostId} = req.query;
    
    if (!hostId) {
        return next(new ErrorResponse('Host ID is required', 400));
    }

    let startDate = new Date();
    let groupFormat;
    
    // Set date range based on period type
    switch(periodType) {
        case 'day':
            startDate.setDate(startDate.getDate() - count);
            groupFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
            break;
        case 'month':
            startDate.setMonth(startDate.getMonth() - count);
            groupFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
            break;
        case 'year':
            startDate.setFullYear(startDate.getFullYear() - count);
            groupFormat = { $dateToString: { format: "%Y", date: "$createdAt" } };
            break;
        default:
            return next(new ErrorResponse('Invalid period type. Use day, month, or year', 400));
    }

    // Get all homestays owned by the specified host
    const hostHomestays = await Homestay.find({ host: hostId }).select('_id');
    const hostHomestayIds = hostHomestays.map(h => h._id);

    const revenue = await Booking.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate },
                paymentStatus: 'paid',
                homestay: { $in: hostHomestayIds }
            }
        },
        {
            $group: {
                _id: groupFormat,
                revenue: { $sum: "$totalPrice" }
            }
        },
        {
            $project: {
                _id: 0,
                date: "$_id",
                revenue: 1,
                name: "$_id"
            }
        },
        {
            $sort: { date: 1 }
        }
    ]);

    res.status(200).json({
        success: true,
        count: revenue.length,
        data: revenue
    });
});


exports.createBookingWithoutAccount = asyncHandler(async (req, res, next) => {
    const {
      propertyId,
      checkIn,
      checkOut,
      guestCount,
      totalPrice,
      bookingStatus,
      paymentStatus,
      guestName,
      guestEmail,
      guestPhone,
      guestAddress
    } = req.body;
  
    // Kiểm tra thông tin cơ bản
    if (!guestName || !guestEmail || !guestPhone || !guestAddress) {
      return next(new ErrorResponse('Vui lòng nhập đầy đủ tên, email và số điện thoại.', 400));
    }
  
    // Kiểm tra homestay tồn tại
    const homestay = await Homestay.findById(propertyId);
    if (!homestay) {
      return next(new ErrorResponse(`Không tìm thấy homestay với id ${propertyId}`, 404));
    }
  
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const daysOfStay = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  
    if (daysOfStay <= 0) {
      return next(new ErrorResponse('Ngày trả phòng phải sau ngày nhận phòng', 400));
    }
  
    // Kiểm tra trùng booking đã thanh toán
    const existingBooking = await Booking.findOne({
      homestay: propertyId,
      paymentStatus: 'paid',
      $or: [
        {
          checkInDate: { $lt: checkOutDate },
          checkOutDate: { $gt: checkInDate }
        }
      ]
    });
  
    if (existingBooking) {
      return next(new ErrorResponse('Homestay này đã được đặt trong khoảng thời gian bạn chọn.', 400));
    }
  
    // Tạo booking
    const booking = await Booking.create({
      homestay: propertyId,
      checkInDate,
      checkOutDate,
      numberOfGuests: guestCount,
      totalPrice,
      bookingStatus,
      paymentStatus,
      guestName,
      guestEmail,
      guestPhone,
      guestAddress
    });
  
    res.status(201).json({
      success: true,
      message: 'Tạo booking thành công',
      data: booking
    });
  });
  

// @desc    Get host dashboard statistics
// @route   GET /api/bookings/host-dashboard
// @access  Private (Host)
exports.getHostDashboard = asyncHandler(async (req, res, next) => {
    const hostId  = req.user._id;

    if (!hostId) {
        return next(new ErrorResponse('Host ID is required', 400));
    }

    // Get current month's start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get all homestays owned by the host
    const hostHomestays = await Homestay.find({ host: hostId });
    const hostHomestayIds = hostHomestays.map(h => h._id);

    // Get current month's revenue
    const monthlyRevenue = await Booking.aggregate([
        {
            $match: {
                homestay: { $in: hostHomestayIds },
                paymentStatus: 'paid',
                createdAt: {
                    $gte: startOfMonth,
                    $lte: endOfMonth
                }
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalPrice" }
            }
        }
    ]);

    // Get current month's bookings
    const monthlyBookings = await Booking.countDocuments({
        homestay: { $in: hostHomestayIds },
        createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
        }
    });

    // Calculate average rating for host's homestays
// Calculate average rating and total comments for host's homestays this month
const monthlyRatings = await Homestay.aggregate([
    {
      $match: {
        _id: { $in: hostHomestayIds }
      }
    },
    {
      $lookup: {
        from: "reviews",
        localField: "reviews",
        foreignField: "_id",
        as: "fullReviews"
      }
    },
    {
      $unwind: "$fullReviews"
    },
    {
      $match: {
        "fullReviews.createdAt": {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$fullReviews.rating" },
        totalComments: { $sum: 1 }
      }
    }
  ]);

const monthlyRatingStats = monthlyRatings.length > 0 ? {
    averageRating: monthlyRatings[0].averageRating,
    totalComments: monthlyRatings[0].totalComments
} : {
    averageRating: 0,
    totalComments: 0
};

    res.status(200).json({
        success: true,
        data: {
            monthlyRevenue: monthlyRevenue.length > 0 ? monthlyRevenue[0].totalRevenue : 0,
            monthlyBookings,
            totalHomestays: hostHomestays.length,
            averageRating: monthlyRatingStats
        }
    });
});
