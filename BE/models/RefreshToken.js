const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expires: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d', // Tự động xóa token sau 7 ngày
  },
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);