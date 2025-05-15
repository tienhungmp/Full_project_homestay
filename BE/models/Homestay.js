const mongoose = require('mongoose');

const HomestaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên homestay'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả'],
  },
  address: {
    type: String,
    required: [true, 'Vui lòng nhập địa chỉ'],
  },
  price: {
    type: Number,
    required: [true, 'Vui lòng nhập giá'],
  },
  images: [
    {
      type: String,
    },
  ],
  amenities: [{
    type: String,
    enum: {
      values: [
        'WiFi',
        'Air Conditioning',
        'TV',
        'Kitchen',
        'Washing Machine',
        'Free Parking',
        'Pool',
        'Garden',
        'BBQ',
        'Hot Water',
        'Refrigerator',
        'Microwave',
        'Security Camera',
        'First Aid Kit',
        'Fire Extinguisher'
      ],
      message: '{VALUE} không phải là tiện ích hợp lệ'
    }
  }],
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
  },
  host: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating phải từ 1 sao trở lên'],
    max: [5, 'Rating không được quá 5 sao'],
  },
  numberOfRooms: {
    type: Number,
    required: [true, 'Vui lòng nhập số phòng'],
    min: [1, 'Phải có ít nhất 1 phòng'],
  },
  maxGuestsPerRoom: {
    type: Number,
    required: [true, 'Vui lòng nhập số khách tối đa mỗi phòng'],
    min: [1, 'Phải có ít nhất 1 khách mỗi phòng'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review' // Liên kết đến collection Review
  }]
});

// Middleware để xóa các booking và review liên quan khi homestay bị xóa (tùy chọn)
// HomestaySchema.pre('remove', async function(next) {
//   console.log(`Bookings being removed from homestay ${this._id}`);
//   await this.model('Booking').deleteMany({ homestay: this._id });
//   console.log(`Reviews being removed from homestay ${this._id}`);
//   await this.model('Review').deleteMany({ homestay: this._id });
//   next();
// });

module.exports = mongoose.model('Homestay', HomestaySchema);