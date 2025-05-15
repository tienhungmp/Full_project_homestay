const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Review = require('../models/Review');
const Homestay = require('../models/Homestay');
const Booking = require('../models/Booking');

// @desc    Lấy tất cả các review
// @route   GET /api/reviews
// @route   GET /api/homestays/:homestayId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.homestayId) {
        const reviews = await Review.find({ homestay: req.params.homestayId })
                                    .populate('user', 'name'); // Populate thông tin user
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } else {
        // Nếu không có homestayId, trả về tất cả review (có thể phân quyền sau)
        res.status(200).json(res.advancedResults);
    }
});

// @desc    Lấy chi tiết một review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'homestay',
        select: 'name description'
    }).populate('user', 'name'); // Populate thông tin user

    if (!review) {
        return next(
            new ErrorResponse(`Không tìm thấy review với id ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc    Thêm review
// @route   POST /api/homestays/:homestayId/reviews
// @access  Private (User)
exports.addReview = asyncHandler(async (req, res, next) => {
    console.log(req.user);
    const {userId, homestayId, textReview, rating} = req.body;

    const homestay = await Homestay.findById(homestayId);

    if (!homestay) {
        return next(
            new ErrorResponse(
                `Không tìm thấy homestay với id ${homestayId}`,
                404
            )
        );
    }

    // Kiểm tra xem user đã đặt phòng và thanh toán thành công chưa
    const paidBooking = await Booking.findOne({
        homestay: homestayId,
        user: userId,
        paymentStatus: 'paid',
        bookingStatus: { $in: ['confirmed', 'completed','pending'] }
    });

    if (!paidBooking) {
        return next(
            new ErrorResponse(
                `Bạn cần phải đặt phòng và thanh toán thành công trước khi đánh giá`,
                403
            )
        );
    }

    // Create review first
    const review = await Review.create({
        homestay: homestayId,
        user: userId,
        text: textReview,
        rating
    });

    // Send response first
    res.status(201).json({
        success: true,
        data: review
    });

    // Call sentiment analysis API asynchronously
    try {
        const response = await fetch('https://sentiment-analysis-2yo7.onrender.com/api/sentiment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment: textReview })
        });

        const sentimentData = await response.json();

        // Update review with sentiment data
        await Review.findByIdAndUpdate(
            review._id,
            { sentiment: sentimentData.result.sentiment },
            { runValidators: true }
        );
    } catch (error) {
        console.error('Error getting sentiment analysis:', error);
    }
});

// @desc    Cập nhật review
// @route   PUT /api/reviews/:id
// @access  Private (User sở hữu review hoặc Admin)
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);

    if (!review) {
        return next(
            new ErrorResponse(`Không tìm thấy review với id ${req.params.id}`, 404)
        );
    }

    // Đảm bảo user là người tạo review hoặc là admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `Không có quyền cập nhật review này`,
                401
            )
        );
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc    Xóa review
// @route   DELETE /api/reviews/:id
// @access  Private (User sở hữu review hoặc Admin)
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(
            new ErrorResponse(`Không tìm thấy review với id ${req.params.id}`, 404)
        );
    }

    // Đảm bảo user là người tạo review hoặc là admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `Không có quyền xóa review này`,
                401
            )
        );
    }

    await review.deleteOne(); // Sử dụng deleteOne() thay vì remove()

    res.status(200).json({
        success: true,
        data: {}
    });
});

