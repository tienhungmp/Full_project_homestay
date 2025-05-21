const Homestay = require('../models/Homestay');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const path = require('path');
const Booking = require('../models/Booking');

// @desc    Lấy tất cả homestay
// @route   GET /api/homestays
// @access  Public
exports.getHomestays = asyncHandler(async (req, res, next) => {
    console.log(req.query)
// Build filter object based on query parameters
    let filter = {};

    // Location filter
    if (req.query.location) {
        filter.location = { $regex: req.query.location, $options: 'i' };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};
        if (req.query.minPrice) filter.price.$gte = parseInt(req.query.minPrice);
        if (req.query.maxPrice) filter.price.$lte = parseInt(req.query.maxPrice);
    }

    // Types filter
    if (req.query.types) {
        const typeArray = req.query.types.split(',');
        filter.type = { $in: typeArray };
    }

    // Amenities filter
    if (req.query['amenities[]']) {
        const amenities = Array.isArray(req.query['amenities[]']) 
            ? req.query['amenities[]'] 
            : [req.query['amenities[]']];
        filter.amenities = { $all: amenities };
    }

    // Rating filter
    if (req.query.minRating) {
        filter.averageRating = { $gte: parseFloat(req.query.minRating) };
    }

    console.log("Filter object:", filter);
    // Get page and limit from query params, set defaults if not provided
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Homestay.countDocuments();

    // Get paginated homestays with host information
    const homestays = await Homestay.find(filter)
        .populate('host', 'name email')
        .skip(startIndex)
        .limit(limit);

    // Prepare pagination object
    const pagination = {};

    // Add next page if available
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    // Add previous page if available
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.status(200).json({
        success: true,
        total,
        pagination,
        data: homestays,
    });
});

// @desc    Lấy chi tiết một homestay
// @route   GET /api/homestays/:id
// @access  Public
exports.getHomestay = asyncHandler(async (req, res, next) => {
    const homestay = await Homestay.findById(req.params.id)
    .populate('host', 'name email') // populate host với name & email
    .populate({
        path: 'reviews',              // populate reviews
        populate: {
        path: 'user',               // populate user trong từng review
        select: 'name avatar'       // chỉ lấy trường cần thiết của user
        }
    });

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
    console.log("Uploaded files:", req.body);
    // Gán host là người dùng đăng nhập
    req.body.host = req.user._id;
  
    // Kiểm tra role
    if (req.user.role !== 'host' && req.user.role !== 'admin') {
      return next(new ErrorResponse('Chỉ chủ homestay (host) mới có thể tạo homestay', 403));
    }
  
    const images = [];
    // Hỗ trợ cả 2 kiểu key: "images" và "images[]"
    const uploadField = (req.files?.images) || (req.files?.['images[]']);
  
    // Handle image uploads nếu có files
    if (uploadField) {
      // Chuẩn hoá thành mảng
      const files = Array.isArray(uploadField) ? uploadField : [uploadField];
  
      for (const file of files) {
        // Kiểm tra đúng file ảnh
        if (!file.mimetype.startsWith('image')) {
          return next(new ErrorResponse('Vui lòng chỉ upload file ảnh', 400));
        }
  
        // Kiểm tra dung lượng
        if (file.size > parseInt(process.env.MAX_FILE_UPLOAD, 10)) {
          return next(
            new ErrorResponse(
              `Mỗi ảnh phải nhỏ hơn ${process.env.MAX_FILE_UPLOAD / 1024 / 1024}MB`,
              400
            )
          );
        }
  
        // Tạo filename
        const ext = path.parse(file.name).ext;
        const filename = `homestay_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
  
        // Move file
        await file.mv(path.join(process.env.FILE_UPLOAD_PATH, filename));
  
        images.push(`/uploads/${filename}`);
      }
    }
  
    // Handle image URLs nếu có trong body (ví dụ bạn truyền URL từ client)
    if (req.body.images) {
      const bodyImages = Array.isArray(req.body.images)
        ? req.body.images
        : [req.body.images];
      images.push(...bodyImages);
    }
  
    // Nếu không có ảnh nào
    if (images.length === 0) {
      return next(new ErrorResponse('Vui lòng cung cấp ít nhất một ảnh cho homestay', 400));
    }
  
    // Gán lại images vào req.body trước khi create
    req.body.images = images;
    req.body.amenities = Array.isArray(req.body['amenities[]']) 
    ? req.body['amenities[]'] 
    : [req.body['amenities[]']];
    // Tạo homestay
    const homestay = await Homestay.create(req.body);
  
    res.status(201).json({
      success: true,
      data: homestay,
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


exports.getTopRatedHomestays = asyncHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 6;
    
    const topHomestays = await Homestay.find({
        // Only include homestays that have at least one review/rating
        averageRating: { $exists: true, $ne: null }
    })
    .sort({ averageRating: -1 }) // Sort by rating in descending order
    .limit(limit)
    .populate('host', 'name email')
    .populate('reviews');

    res.status(200).json({
        success: true,
        count: topHomestays.length,
        data: topHomestays
    });
});


// @desc    Get homestays by host ID
// @route   GET /api/homestays/host/:hostId
// @access  Public
exports.getHomestaysByHost = asyncHandler(async (req, res, next) => {
    const hostId = req.user._id;

    // Get all homestays for the host
    const homestays = await Homestay.find({ host: hostId })
        .populate('host', 'name email');

    if (!homestays || homestays.length === 0) {
        return next(
            new ErrorResponse(`No homestays found for host with ID ${hostId}`, 404)
        );
    }

    // Get booking counts for each homestay from the Booking model
    const bookingCounts = await Promise.all(
        homestays.map(async (homestay) => {
            const count = await Booking.countDocuments({ 
                homestay: homestay._id,
                paymentStatus: 'paid'
            });
            return {
                homestayId: homestay._id,
                bookingCount: count
            };
        })
    );

    // Create a map of homestayId to booking count for easier lookup
    const bookingCountMap = bookingCounts.reduce((map, item) => {
        map[item.homestayId.toString()] = item.bookingCount;
        return map;
    }, {});

    // Transform homestays to include booking count
    const homestaysWithBookingCount = homestays.map(homestay => {
        const homestayObj = homestay.toObject();
        homestayObj.bookingCount = bookingCountMap[homestay._id.toString()] || 0;
        return homestayObj;
    });

    res.status(200).json({
        success: true,
        count: homestays.length,
        data: homestaysWithBookingCount
    });
});
