const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  homestay: {
    type: mongoose.Schema.ObjectId,
    ref: 'Homestay',
    required: true,
  },
  checkInDate: {
    type: Date,
    required: [true, 'Vui lòng nhập ngày nhận phòng'],
  },
  checkOutDate: {
    type: Date,
    required: [true, 'Vui lòng nhập ngày trả phòng'],
  },
  numberOfGuests: {
    type: Number,
    required: [true, 'Vui lòng nhập số lượng khách'],
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  // Thêm thông tin thanh toán nếu cần (paymentIntentId, paymentMethod, etc.)
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Đảm bảo ngày trả phòng phải sau ngày nhận phòng
BookingSchema.pre('validate', function(next) {
  if (this.checkOutDate <= this.checkInDate) {
    next(new Error('Ngày trả phòng phải sau ngày nhận phòng'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Booking', BookingSchema);