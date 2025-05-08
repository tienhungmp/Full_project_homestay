const Homestay = require('../models/Homestay');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const path = require('path');

// @desc    Lấy tất cả homestay
// @route   GET /api/homestays
// @access  Public
exports.getHomestays = asyncHandler(async (req, res, next) => {
    // Triển khai logic filter, search, pagination ở đây hoặc dùng middleware advancedResults
    // Ví dụ đơn giản:
    const homestays = await Homestay.find().populate('host', 'name email'); // Populate thông tin host

    res.status(200).json({
        success: true,
        total: homestays.length,
        data: homestays
    });
    // Nếu dùng advancedResults:
    // res.status(200).json(res.advancedResults);
});

// @desc    Lấy chi tiết một homestay
// @route   GET /api/homestays/:id
// @access  Public
exports.getHomestay = asyncHandler(async (req, res, next) => {
    const homestay = await Homestay.findById(req.params.id).populate('host', 'name email').populate('reviews'); // Populate thêm reviews nếu cần

    if (!homestay) {
        return next(
            new ErrorResponse(`Không tìm thấy homestay với id ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: homestay
    });
});

// @desc    Tạo mới homestay
// @route   POST /api/homestays
// @access  Private (Chỉ Host)
exports.createHomestay = asyncHandler(async (req, res, next) => {
    // Gán host là người dùng đăng nhập
    req.body.host = req.user.id;

    // Kiểm tra role
    if (req.user.role !== 'host' && req.user.role !== 'admin') {
        return next(new ErrorResponse('Chỉ chủ homestay (host) mới có thể tạo homestay', 403));
    }

    const images = [];

    // Handle image uploads if files are provided
    if (req.files && req.files.images) {
        const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

        // Process each uploaded image
        for (const file of files) {
            // Check if file is an image
            if (!file.mimetype.startsWith('image')) {
                return next(new ErrorResponse('Vui lòng chỉ upload file ảnh', 400));
            }

            // Check file size
            if (file.size > process.env.MAX_FILE_UPLOAD) {
                return next(
                    new ErrorResponse(`Mỗi ảnh phải nhỏ hơn ${process.env.MAX_FILE_UPLOAD / 1024 / 1024}MB`, 400)
                );
            }

            // Create custom filename
            const filename = `homestay_${Date.now()}_${Math.round(Math.random() * 1E9)}${path.parse(file.name).ext}`;

            // Move file to upload directory
            await file.mv(`${process.env.FILE_UPLOAD_PATH}/${filename}`);
            
            // Add filename to images array
            images.push(`/uploads/${filename}`);
        }
    }

    // Handle image URLs if provided in request body
    if (req.body.images) {
        const bodyImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        images.push(...bodyImages);
    }

    // Validate that at least one image is provided
    if (images.length === 0) {
        return next(new ErrorResponse('Vui lòng cung cấp ít nhất một ảnh cho homestay', 400));
    }

    // Add images to req.body
    req.body.images = images;

    // Create homestay with images
    const homestay = await Homestay.create(req.body);

    res.status(201).json({
        success: true,
        data: homestay
    });
});

// @desc    Cập nhật homestay
// @route   PUT /api/homestays/:id
// @access  Private (Chỉ Host sở hữu hoặc Admin)
exports.updateHomestay = asyncHandler(async (req, res, next) => {
    let homestay = await Homestay.findById(req.params.id);

    if (!homestay) {
        return next(
            new ErrorResponse(`Không tìm thấy homestay với id ${req.params.id}`, 404)
        );
    }

    // Đảm bảo người dùng là chủ homestay hoặc admin
    if (homestay.host.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`Người dùng ${req.user.id} không có quyền cập nhật homestay này`, 401)
        );
    }

    homestay = await Homestay.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: homestay
    });
});

// @desc    Xóa homestay
// @route   DELETE /api/homestays/:id
// @access  Private (Chỉ Host sở hữu hoặc Admin)
exports.deleteHomestay = asyncHandler(async (req, res, next) => {
    const homestay = await Homestay.findById(req.params.id);

    if (!homestay) {
        return next(
            new ErrorResponse(`Không tìm thấy homestay với id ${req.params.id}`, 404)
        );
    }

    // Đảm bảo người dùng là chủ homestay hoặc admin
    if (homestay.host.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`Người dùng ${req.user.id} không có quyền xóa homestay này`, 401)
        );
    }

    // Optional: Xóa các booking/review liên quan trước khi xóa homestay (nếu cần)
    // await homestay.remove(); // Sử dụng nếu có pre 'remove' hook trong model
    await Homestay.deleteOne({ _id: req.params.id }); // Xóa trực tiếp


    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Upload ảnh cho homestay
// @route   PUT /api/homestays/:id/photo
// @access  Private (Chỉ Host sở hữu hoặc Admin)
exports.homestayPhotoUpload = asyncHandler(async (req, res, next) => {
    const homestay = await Homestay.findById(req.params.id);

    if (!homestay) {
        return next(
            new ErrorResponse(`Không tìm thấy homestay với id ${req.params.id}`, 404)
        );
    }

    // Đảm bảo người dùng là chủ homestay hoặc admin
    if (homestay.host.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`Người dùng ${req.user.id} không có quyền upload ảnh cho homestay này`, 401)
        );
    }

    if (!req.files) {
        return next(new ErrorResponse(`Vui lòng upload một file ảnh`, 400));
    }

    const file = req.files.file; // Giả sử tên field là 'file'

    // Đảm bảo file là ảnh
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Vui lòng upload file ảnh`, 400));
    }

    // Kiểm tra kích thước file (ví dụ: max 1MB)
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(`Vui lòng upload ảnh nhỏ hơn ${process.env.MAX_FILE_UPLOAD / 1024 / 1024}MB`, 400)
        );
    }

    // Tạo tên file tùy chỉnh để tránh trùng lặp
    file.name = `photo_${homestay._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Lỗi khi upload file`, 500));
        }

        // Lưu đường dẫn ảnh vào database (có thể lưu nhiều ảnh)
        // Ví dụ: cập nhật mảng images
        await Homestay.findByIdAndUpdate(req.params.id, { $push: { images: `/uploads/${file.name}` } });

        res.status(200).json({
            success: true,
            data: `/uploads/${file.name}`
        });
    });
});