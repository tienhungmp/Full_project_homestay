const Homestay = require('../models/Homestay');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Review = require('../models/Review');
const asyncHandler = require('../middlewares/async');


// @desc    Get total users, homestays, bookings and reviews
// @route   GET /api/v1/admin/analysis/totals
// @access  Private/Admin
exports.getTotalAnalysis = asyncHandler(async (req, res, next) => {
    const totalUsers = await User.countDocuments();
    const totalHomestays = await Homestay.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();

    const currentYear = new Date().getFullYear();
    const bookingsByMonth = await Booking.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(currentYear, 0, 1),
                    $lte: new Date(currentYear, 11, 31)
                }
            }
        },
        {
            $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    const monthNames = [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];

    const monthlyBookings = monthNames.map((name, index) => {
        const monthData = bookingsByMonth.find(item => item._id === index + 1);
        return {
            name: name,
            bookings: monthData ? monthData.count : 0
        };
    });

    const topHomestays = await Booking.aggregate([
        {
            $group: {
                _id: "$homestay",
                bookingCount: { $sum: 1 }
            }
        },
        {
            $sort: { bookingCount: -1 }
        },
        {
            $limit: 4
        },
        {
            $lookup: {
                from: "homestays",
                localField: "_id",
                foreignField: "_id",
                as: "homestayDetails"
            }
        },
        {
            $unwind: "$homestayDetails"
        },
        {
            $project: {
                _id: 1,
                bookingCount: 1,
                homestayDetails: "$homestayDetails"
            }
        }
    ]);

    res.status(200).json({
        success: true,
        data: {
            users: totalUsers,
            homestays: totalHomestays,
            bookings: totalBookings,
            reviews: totalReviews,
            monthlyBookings: monthlyBookings,
            topHomestays: topHomestays
        }
    });
});


// @desc    Get all homestays
// @route   GET /api/v1/admin/analysis/homestays
// @access  Private/Admin
// exports.getAllHomestays = asyncHandler(async (req, res, next) => {
//     // Query parameters for pagination and filtering
//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = parseInt(req.query.limit, 10) || 10;
//     const startIndex = (page - 1) * limit;

//     // Build query
//     const query = {};

//     // Add search by name if provided
//     if (req.query.name) {
//         query.name = { $regex: req.query.name, $options: 'i' };
//     }

//     // Add filter by status if provided
//     if (req.query.status) {
//         query.status = req.query.status;
//     }

//     // Execute query with pagination
//     const total = await Homestay.countDocuments(query);
//     const homestays = await Homestay.find(query)
//         .populate('user', 'name email')
//         .skip(startIndex)
//         .limit(limit)
//         .sort({ createdAt: -1 });

//     res.status(200).json({
//         success: true,
//         data: {
//             count: homestays.length,
//             total,
//             pagination: {
//                 page,
//                 limit,
//                 totalPages: Math.ceil(total / limit)
//             },
//             homestays
//         }
//     });
// });

exports.getAllHomestays = asyncHandler(async (req, res, next) => {
    const homestays = await Homestay.find()
        .populate('host', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: {
            count: homestays.length,
            homestays
        }
    });
});


// @desc    Get all users
// @route   GET /api/v1/admin/analysis/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: {
            count: users.length,
            users
        }
    });
});


// @desc    Get all bookings
// @route   GET /api/v1/admin/analysis/bookings
// @access  Private/Admin
exports.getAllBookings = asyncHandler(async (req, res, next) => {
    const bookings = await Booking.find()
        .populate({
            path: 'homestay',
            select: 'name address price'
        })
        .populate({
            path: 'user',
            select: 'name email'
        })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: {
            count: bookings.length,
            bookings
        }
    });
});


// @desc    Get all reviews
// @route   GET /api/v1/admin/analysis/reviews
// @access  Private/Admin
exports.getAllReviews = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find()
        .populate({
            path: 'homestay',
            select: 'name address'
        })
        .populate({
            path: 'user',
            select: 'name email'
        })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: {
            count: reviews.length,
            reviews
        }
    });
});

