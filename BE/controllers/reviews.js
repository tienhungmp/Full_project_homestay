const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Review = require('../models/Review');
const Homestay = require('../models/Homestay');

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
    req.body.homestay = req.params.homestayId;
    req.body.user = req.user.id; // Gán user là người đang đăng nhập

    const homestay = await Homestay.findById(req.params.homestayId);

    if (!homestay) {
        return next(
            new ErrorResponse(
                `Không tìm thấy homestay với id ${req.params.homestayId}`,
                404
            )
        );
    }

    // Kiểm tra xem user đã review homestay này chưa (nếu cần)
    // const existingReview = await Review.findOne({ homestay: req.params.homestayId, user: req.user.id });
    // if (existingReview) {
    //     return next(new ErrorResponse(`Bạn đã đánh giá homestay này rồi`, 400));
    // }

    const review = await Review.create(req.body);

    res.status(201).json({
        success: true,
        data: review
    });
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