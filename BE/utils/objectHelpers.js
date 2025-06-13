const Booking = require("../models/Booking");
const Homestay = require("../models/Homestay");

function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => (sorted[key] = obj[key]));
    return sorted;
}

const checkHomestayAvailabilityRoom = async (homestayId, checkIn, checkOut) => {
    // Validate required parameters
    if (!homestayId || !checkIn || !checkOut) {
        throw new Error('Please provide homestay ID, check-in and check-out dates');
    }

    // Convert dates to Date objects
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validate dates
    if (checkInDate >= checkOutDate) {
        throw new Error('Check-out date must be after check-in date');
    }

    // Get homestay details
    const homestay = await Homestay.findById(homestayId);
    if (!homestay) {
        throw new Error(`Homestay not found with id ${homestayId}`);
    }

    // Find overlapping bookings that are paid
    const existingBookings = await Booking.find({
        homestay: homestayId,
        paymentStatus: 'paid',
        $or: [
            {
                checkInDate: { $lt: checkOutDate },
                checkOutDate: { $gt: checkInDate }
            }
        ]
    });


    if (!existingBookings || existingBookings.length === 0) {
        return {
            isAvailable: true,
            totalRooms: homestay.numberOfRooms,
            bookedRooms: 0,
            remainingRooms: homestay.numberOfRooms
        };
    }

    // Calculate total booked rooms
    const totalBookedRooms = existingBookings.reduce((sum, booking) => {
        return sum + (booking.numberOfRooms || 1);
    }, 0);

    // Calculate availability
    const isAvailable = totalBookedRooms < homestay.numberOfRooms;
    const remainingRooms = homestay.numberOfRooms - totalBookedRooms;

    return {
        isAvailable,
        totalRooms: homestay.numberOfRooms,
        bookedRooms: totalBookedRooms,
        remainingRooms: remainingRooms > 0 ? remainingRooms : 0
    };
};

module.exports = {
    sortObject,
    checkHomestayAvailabilityRoom
};