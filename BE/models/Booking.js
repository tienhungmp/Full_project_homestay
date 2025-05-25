const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false,
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
  invoiceCode: {
    type: String,
    unique: true,
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  guestName: {
    type: String,
    required: function () {
      return !this.user;
    },
  },
  guestEmail: {
    type: String,
    required: function () {
      return !this.user;
    },
  },
  guestPhone: {
    type: String,
    required: function () {
      return !this.user;
    },
  },
  guestAddress: {
    type: String,
    required: function () {
      return !this.user;
    },
  },
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

BookingSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  function generateCode() {
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return '#IV' + code;
  }

  let code;
  let exists = true;

  do {
    code = generateCode();
    exists = await mongoose.models.Booking.exists({ invoiceCode: code });
  } while (exists);

  this.invoiceCode = code;
  next();
});

BookingSchema.virtual('createdAtFormatted').get(function () {
  return this.createdAt?.toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

BookingSchema.set('toJSON', { virtuals: true });
BookingSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Booking', BookingSchema);