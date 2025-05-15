const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxlength: 100,
    default: 'Đánh giá homestay'
  },
  text: {
    type: String,
    required: [true, 'Vui lòng thêm nội dung đánh giá']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Vui lòng cho điểm đánh giá từ 1 đến 5']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  homestay: {
    type: mongoose.Schema.ObjectId,
    ref: 'Homestay',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral' 
  }
});

// Cập nhật điểm trung bình đánh giá
ReviewSchema.statics.getAverageRating = async function (homestayId) {
  const obj = await this.aggregate([
    {
      $match: { homestay: homestayId }
    },
    {
      $sort: { user: 1, createdAt: -1 }
    },
    {
      $group: {
        _id: '$user',
        latestRating: { $first: '$rating' }
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$latestRating' }
      }
    }
  ]);

  try {
    await this.model('Homestay').findByIdAndUpdate(homestayId, {
      averageRating: obj[0] ? parseFloat(obj[0].averageRating.toFixed(1)) : undefined
    });
  } catch (err) {
    console.error(`Lỗi khi cập nhật averageRating cho homestay ${homestayId}:`, err);
  }
};

// Sau khi lưu review mới
ReviewSchema.post('save', async function () {
  const reviewId = this._id;
  const homestayId = this.homestay;

  // Push vào mảng reviews của Homestay
  await this.model('Homestay').findByIdAndUpdate(homestayId, {
    $addToSet: { reviews: reviewId }
  });

  // Cập nhật averageRating
  await this.constructor.getAverageRating(homestayId);
});

// Trước khi update/delete qua findOneAnd*
ReviewSchema.pre(/^findOneAnd/, async function (next) {
  this._updateDoc = await this.model.findOne(this.getQuery()).clone();
  next();
});

// Sau khi update/delete qua findOneAnd*
ReviewSchema.post(/^findOneAnd/, async function () {
  if (this._updateDoc) {
    const homestayId = this._updateDoc.homestay;

    // Pull nếu bị xóa
    if (this.op === 'findOneAndDelete' || this.op === 'findOneAndRemove') {
      await this.model('Homestay').findByIdAndUpdate(homestayId, {
        $pull: { reviews: this._updateDoc._id }
      });
    }

    // Cập nhật điểm đánh giá
    await this._updateDoc.constructor.getAverageRating(homestayId);
  }
});

// Khi xóa bằng document.remove()
ReviewSchema.post('remove', async function () {
  const homestayId = this.homestay;

  // Xoá review khỏi Homestay
  await this.model('Homestay').findByIdAndUpdate(homestayId, {
    $pull: { reviews: this._id }
  });

  // Cập nhật lại averageRating
  await this.constructor.getAverageRating(homestayId);
});

module.exports = mongoose.model('Review', ReviewSchema);
