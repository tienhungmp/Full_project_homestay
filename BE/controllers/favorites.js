const Favorite = require('../models/Favorite');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Get user's favorites
// @route   GET /api/v1/favorites
// @access  Private
exports.getFavorites = asyncHandler(async (req, res, next) => {
  const favorites = await Favorite.find({ user: req.user._id })
    .populate({
      path: 'homestay'
    });

  res.status(200).json({
    success: true,
    count: favorites.length,
    data: favorites
  });
});

// @desc    Add homestay to favorites
// @route   POST /api/v1/favorites/:homestayId
// @access  Private
exports.addToFavorites = asyncHandler(async (req, res, next) => {
  const favorite = await Favorite.create({
    user: req.user._id,
    homestay: req.params.homestayId
  });

  res.status(201).json({
    success: true,
    data: favorite
  });
});

// @desc    Remove homestay from favorites
// @route   DELETE /api/v1/favorites/:homestayId
// @access  Private
exports.removeFromFavorites = asyncHandler(async (req, res, next) => {
  const favorite = await Favorite.findOne({
    user: req.user._id,
    homestay: req.params.homestayId
  });

  if (!favorite) {
    return next(new ErrorResponse('Homestay not found in favorites', 404));
  }

  await favorite.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Check if homestay is in user's favorites
// @route   GET /api/v1/favorites/:homestayId/check
// @access  Private
exports.checkFavorite = asyncHandler(async (req, res, next) => {
  const favorite = await Favorite.findOne({
    user: req.user._id,
    homestay: req.params.homestayId
  });

  res.status(200).json({
    success: true,
    isFavorite: !!favorite
  });
});