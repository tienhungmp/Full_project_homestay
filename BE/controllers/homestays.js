const Homestay = require('../models/Homestay');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const path = require('path');
const Booking = require('../models/Booking');
const Category = require('../models/Category');
const sortObject = require('../utils/objectHelpers');

// @desc    Lấy tất cả homestay
// @route   GET /api/homestays
// @access  Public
exports.getHomestays = asyncHandler(async (req, res, next) => {
// Build filter object based on query parameters
    let filter = {};

    // Location filter
    if (req.query.location) {
        filter.address = { $regex: req.query.location, $options: 'i' };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};
        if (req.query.minPrice) filter.price.$gte = parseInt(req.query.minPrice);
        if (req.query.maxPrice) filter.price.$lte = parseInt(req.query.maxPrice);
    }

    // Types filter
    if (req.query.types) {
        let typeArray = req.query.types.split(',')
        const categoryIds = await Category.find({ name: { $in: typeArray } }).distinct('_id');
        typeArray = categoryIds;
        typeArray = typeArray.map(id => id.toString());
        filter.category = { $in: typeArray };
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

    // Get page and limit from query params, set defaults if not provided
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Homestay.countDocuments();

    // Get paginated homestays with host information
    const homestays = await Homestay.find({ ...filter, status: 'hoạt động' })
        .populate('host', 'name email').populate('category')
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

    // Xử lý upload ảnh mới nếu có
    if (req.files) {
        const images = [...homestay.images]; // Giữ lại ảnh cũ
        
        // Hỗ trợ cả 2 kiểu key: "images" và "images[]"
        const uploadField = (req.files?.images) || (req.files?.['images[]']);
        
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
        
        // Cập nhật mảng ảnh trong req.body
        req.body.images = images;
    }
    
    // Xử lý amenities nếu có
    if (req.body['amenities[]']) {
        req.body.amenities = Array.isArray(req.body['amenities[]']) 
            ? req.body['amenities[]'] 
            : [req.body['amenities[]']];
    }
    
    // Xử lý trường hợp client gửi mảng images mới (URLs)
    if (req.body.images && !req.files) {
        const bodyImages = Array.isArray(req.body.images)
            ? req.body.images
            : [req.body.images];
            
        req.body.images = bodyImages;
    }

    // Cập nhật homestay
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

    // Delete the homestay permanently
    await Homestay.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Homestay has been deactivated successfully'
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
        averageRating: { $exists: true, $ne: null },
        status: 'hoạt động'
    })
    .sort({ averageRating: -1 }) // Sort by rating in descending order
    .limit(limit)
    .populate('host', 'name email')
    .populate('reviews').populate('category');

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


// @desc    Check homestay availability for a specific date
// @route   GET /api/homestays/:id/check-availability
// @access  Public
exports.checkHomestayAvailability = asyncHandler(async (req, res, next) => {
    const { checkIn, checkOut, homestayId } = req.query;

    if (!checkIn || !checkOut) {
        return next(new ErrorResponse('Please provide both check-in and check-out dates', 400));
    }

    // Convert date strings to Date objects
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Validate date format
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        return next(new ErrorResponse('Invalid date format', 400));
    }

    // Validate check-out is after check-in
    if (checkOutDate <= checkInDate) {
        return next(new ErrorResponse('Check-out date must be after check-in date', 400));
    }

    // Find homestay first to check if it exists
    const homestay = await Homestay.findById(homestayId);
    
    if (!homestay) {
        return next(new ErrorResponse(`Homestay not found with id ${homestayId}`, 404));
    }

    // Check for any overlapping bookings
    const {isAvailable,totalRooms, bookedRooms, remainingRooms} = await sortObject.checkHomestayAvailabilityRoom(homestayId, checkIn, checkOut)

    res.status(200).json({
        success: true,
        data: {
            isAvailable,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            homestayId: homestayId
        }
    });
});


// @desc    Get available dates for a homestay in a specific month
// @route   GET /api/homestays/:id/available-dates/:month
// @access  Public
exports.getAvailableDates = asyncHandler(async (req, res, next) => {
    const {homestayId, monthYear} = req.query

    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(monthYear)) {
        return next(new ErrorResponse('Invalid month format. Use YYYY-MM', 400));
    }

    // Get first and last day of the month
    const [year, month] = monthYear.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1); // Month is 0-based in JS
    startDate.setHours(startDate.getHours() + 7); // Convert to GMT+7

    const endDate = new Date(year, month, 0); // Last day of month
    endDate.setHours(endDate.getHours() + 7); // Convert to GMT+7

    // Get today's date at start of day (Vietnam time)
    const today = new Date();
    today.setHours(7, 0, 0, 0); // Set to 00:00:00 Vietnam time (GMT+7)

    // Use today's date if startDate is before today
    const effectiveStartDate = startDate < today ? today : startDate;

    // Find homestay
    const homestay = await Homestay.findById(homestayId);
    if (!homestay) {
        return next(new ErrorResponse(`Homestay not found with id ${homestayId}`, 404));
    }

    // Get all bookings for this homestay in the specified month
    const bookings = await Booking.find({
        homestay: homestayId,
        paymentStatus: 'paid',
        $or: [
            {
                checkInDate: { $gte: effectiveStartDate, $lte: endDate }
            },
            {
                checkOutDate: { $gte: effectiveStartDate, $lte: endDate }
            },
            {
                checkInDate: { $lte: effectiveStartDate },
                checkOutDate: { $gte: endDate }
            }
        ]
    }).select('checkInDate checkOutDate');

    // Create array of all days in month from today onwards
    const allDates = [];
    let currentDate = new Date(effectiveStartDate);
    while (currentDate <= endDate) {
        allDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Mark booked dates
    const bookedDates = new Set();
    bookings.forEach(booking => {
        let current = new Date(Math.max(booking.checkInDate, effectiveStartDate));
        const bookingEnd = new Date(Math.min(booking.checkOutDate, endDate));
        
        while (current <= bookingEnd) {
            // Convert to Vietnam timezone before formatting
            const vietnamDate = new Date(current);
            vietnamDate.setHours(vietnamDate.getHours() + 7);
            bookedDates.add(vietnamDate.toISOString().split('T')[0]);
            current.setDate(current.getDate() + 1);
        }
    });

    // Create final array of available dates (in Vietnam timezone)
    const availableDates = allDates
        .map(date => {
            const vietnamDate = new Date(date);
            vietnamDate.setHours(vietnamDate.getHours() + 7);
            return vietnamDate.toISOString().split('T')[0];
        })
        .filter(date => !bookedDates.has(date));

    res.status(200).json({
        success: true,
        data: {
            homestayId,
            month: monthYear,
            availableDates
        }
    });
});

// @desc    Update homestay status
// @route   PUT /api/homestays/update-status
// @access  Private (Admin only)
exports.updateHomestayStatus = asyncHandler(async (req, res, next) => {
    const { status, idHomestay } = req.body;

    if (!status) {
        return next(new ErrorResponse('Please provide a status', 400));
    }

    // Validate status value
    const validStatuses = ['hoạt động', 'bảo trì', 'ngừng hoạt động'];
    if (!validStatuses.includes(status)) {
        return next(new ErrorResponse('Invalid status value', 400));
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
        return next(new ErrorResponse('Only admin can update homestay status', 403));
    }

    let homestay = await Homestay.findById(idHomestay);

    if (!homestay) {
        return next(
            new ErrorResponse(`Homestay not found with id ${idHomestay}`, 404)
        );
    }

    // Update homestay status
    homestay = await Homestay.findByIdAndUpdate(
        idHomestay, // Use idHomestay from req.body instead of req.params.id
        { status },
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        success: true,
        data: homestay
    });
});
