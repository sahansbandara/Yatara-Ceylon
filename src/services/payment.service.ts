import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Booking from "@/models/Booking";
import { BookingStatus } from "@/lib/constants";

export const PaymentService = {
    /**
     * Re-aggregates a booking's true paid amounts vs refunds.
     * Must be called whenever a payment or refund succeeds/is verified.
     */
    async recalculateBookingFinance(bookingId: string) {
        await connectDB();
        
        // Find all successful payments associated with this booking
        const payments = await Payment.find({
            bookingId,
            status: 'SUCCESS',
            isDeleted: { $ne: true }
        });

        const totalPayments = payments
            .filter(p => (!p.type || p.type === 'PAYMENT'))
            .reduce((sum, p) => sum + p.amount, 0);

        const totalRefunds = payments
            .filter(p => p.type === 'REFUND')
            .reduce((sum, p) => sum + p.amount, 0);

        const netPaidAmount = Math.max(0, totalPayments - totalRefunds);

        const booking = await Booking.findById(bookingId);
        if (!booking) return null;

        const totalCost = booking.totalCost || 0;
        const newRemainingBalance = Math.max(0, totalCost - netPaidAmount);

        // Calculate appropriate status
        let newStatus = booking.status;

        if (netPaidAmount === 0 && totalRefunds > 0) {
            newStatus = BookingStatus.REFUNDED;
        } else if (newRemainingBalance <= 0 && netPaidAmount > 0) {
            newStatus = BookingStatus.FULLY_PAID;
        } else if (newRemainingBalance > 0 && netPaidAmount > 0) {
            if (booking.status === BookingStatus.NEW || booking.status === BookingStatus.PAYMENT_PENDING) {
                newStatus = BookingStatus.ADVANCE_PAID;
            } else if (booking.status === BookingStatus.ADVANCE_PAID) {
                newStatus = BookingStatus.BALANCE_PENDING;
            }
            // Retain CONFIRMED or IN_PROGRESS if that was manually set
            if (['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].includes(booking.status)) {
                newStatus = booking.status; // Do not downgrade
            }
        }

        booking.paidAmount = netPaidAmount;
        booking.remainingBalance = newRemainingBalance;
        booking.status = newStatus;

        await booking.save();
        return booking;
    }
};
