const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  homestay: {
    type: mongoose.Schema.ObjectId,
    ref: 'Homestay',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from adding same homestay to favorites multiple times
FavoriteSchema.index({ user: 1, homestay: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);