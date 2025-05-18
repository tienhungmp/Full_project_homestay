const express = require("express");

const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  createPayment,
  paymentSuccess,
  getHostRevenue,
  createBookingWithoutAccount,
  getHostDashboard
} = require("../controllers/bookings"); // Sẽ tạo file này sau

const Booking = require("../models/Booking");

// MergeParams: true để lấy được :homestayId từ router cha (homestays)
const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middlewares/auth");
const advancedResults = require("../middlewares/advancedResults");

// Base route handlers
router
  .route("/")
  .get(
    protect,
    advancedResults(Booking, {
      path: "homestay user",
      select: "name description email address", // Chọn các trường cần populate
    }),
    getBookings
  ) // Sử dụng advancedResults và protect
  .post(protect, authorize("user"), createBooking); // Chỉ user mới tạo được booking

router.route("/host-dashboard").get(protect, authorize("host"), getHostDashboard);

router 
 .route("/create-booking-without-account").post(createBookingWithoutAccount)

router
  .route("/payment-success")
  .put(paymentSuccess);

// Payment route handlers
router.route("/create-payment").post(createPayment);

router.route("/host-revenue").get(protect,authorize("host"),getHostRevenue);

// Individual booking route handlers
router
  .route("/:id")
  .get(getBooking)
  .put(protect, authorize("user", "admin"), updateBooking) // Chỉ user tạo hoặc admin mới sửa được
  .delete(protect, authorize("user", "admin"), deleteBooking); // Chỉ user tạo hoặc admin mới xóa được

module.exports = router;
