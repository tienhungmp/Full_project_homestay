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
  getHostDashboard,
  getBookingsByHostId,
  checkAvailability,
  getBookingsByRole,
  getInvoiceInfo,
  sendBookingConfirmation,
  confirmBookingEmail,
} = require("../controllers/bookings");

const Booking = require("../models/Booking");
const { protect, authorize } = require("../middlewares/auth");
const advancedResults = require("../middlewares/advancedResults");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    protect,
    advancedResults(Booking, {
      path: "homestay user",
      select: "name description email address",
    }),
    getBookings
  )
  .post(protect, authorize("user"), createBooking);

router
  .route("/host-dashboard")
  .get(protect, authorize("host"), getHostDashboard);

router
  .route("/create-booking-without-account")
  .post(createBookingWithoutAccount);

router.route("/payment-success").put(paymentSuccess);

router
  .route("/check-availability")
  .get(protect, authorize("host"), checkAvailability);


router.route("/create-payment").post(createPayment);

router.route("/host-revenue").get(protect, authorize("host"), getHostRevenue);

router
  .route("/get-all-bookings-of-host")
  .get(protect, authorize("host"), getBookingsByHostId);

router.route("/get-booking-by-role").get(protect, getBookingsByRole);

router.route("/search-invoice").get(getInvoiceInfo);

router.route("/send-confirmation").post(sendBookingConfirmation);

router.route("/confirm/:token").put(confirmBookingEmail);

router
  .route("/:id")
  .get(getBooking)
  .put(protect, authorize("host", "admin"), updateBooking) // Chỉ user tạo hoặc admin mới sửa được
  .delete(protect, authorize("user", "admin"), deleteBooking); // Chỉ user tạo hoặc admin mới xóa được

module.exports = router;
