const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Vui lòng thêm tiêu đề cho đánh giá'],
    maxlength: 100
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
  }
});

// Ngăn người dùng gửi nhiều hơn một đánh giá cho mỗi homestay
ReviewSchema.index({ homestay: 1, user: 1 }, { unique: true });

// Static method để tính rating trung bình và lưu
ReviewSchema.statics.getAverageRating = async function(homestayId) {
  const obj = await this.aggregate([
    {
      $match: { homestay: homestayId }
    },
    {
      $group: {
        _id: '$homestay',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    // Sử dụng this.model('Homestay') thay vì trực tiếp gọi Homestay
    await this.model('Homestay').findByIdAndUpdate(homestayId, {
        // Nếu không có đánh giá nào, đặt averageRating là undefined hoặc 0 tùy logic
        averageRating: obj[0] ? parseFloat(obj[0].averageRating.toFixed(1)) : undefined
    });
  } catch (err) {
    console.error(`Lỗi khi cập nhật averageRating cho homestay ${homestayId}:`, err);
  }
};

// Gọi getAverageRating sau khi lưu
ReviewSchema.post('save', async function() {
  await this.constructor.getAverageRating(this.homestay);
});

// Gọi getAverageRating trước và sau khi cập nhật/xóa bằng findByIdAndUpdate/Delete
ReviewSchema.pre(/^findOneAnd/, async function(next) {
  // Lưu document hiện tại vào 'this._updateDoc' để truy cập trong post hook
  // Dùng clone() để tránh lỗi khi thực thi query nhiều lần
  this._updateDoc = await this.model.findOne(this.getQuery()).clone();
  next();
});

ReviewSchema.post(/^findOneAnd/, async function() {
  // this._updateDoc sẽ là document *trước* khi update/delete
  if (this._updateDoc) {
      await this._updateDoc.constructor.getAverageRating(this._updateDoc.homestay);
  }
  // Nếu là update, cần chạy lại cho document *sau* khi update (nếu rating thay đổi)
  // Tuy nhiên, hook post('save') đã xử lý trường hợp tạo mới và cập nhật thông thường.
  // Logic này chủ yếu để xử lý khi xóa hoặc khi rating thay đổi qua findByIdAndUpdate.
});

// Xử lý khi xóa bằng document.remove() (ít dùng hơn findByIdAndDelete)
ReviewSchema.post('remove', async function() {
    await this.constructor.getAverageRating(this.homestay);
});


module.exports = mongoose.model('Review', ReviewSchema);