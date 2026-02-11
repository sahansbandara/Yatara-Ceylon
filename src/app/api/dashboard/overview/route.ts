import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Package from '@/models/Package';
import Vehicle from '@/models/Vehicle';
import Payment from '@/models/Payment';
import SupportTicket from '@/models/SupportTicket';
import { staffOrAdmin } from '@/lib/rbac';

export const GET = staffOrAdmin(async () => {
    try {
        await connectDB();
        const [
            totalBookings,
            newBookings,
            confirmedBookings,
            totalPackages,
            publishedPackages,
            totalVehicles,
            availableVehicles,
            openTickets,
            recentBookings,
            recentPayments,
        ] = await Promise.all([
            Booking.countDocuments({ isDeleted: false }),
            Booking.countDocuments({ isDeleted: false, status: 'NEW' }),
            Booking.countDocuments({ isDeleted: false, status: 'CONFIRMED' }),
            Package.countDocuments({ isDeleted: false }),
            Package.countDocuments({ isDeleted: false, isPublished: true }),
            Vehicle.countDocuments({ isDeleted: false }),
            Vehicle.countDocuments({ isDeleted: false, status: 'AVAILABLE' }),
            SupportTicket.countDocuments({ isDeleted: { $ne: true }, status: 'OPEN' }),
            Booking.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5).lean(),
            Payment.find({ isDeleted: { $ne: true } }).sort({ paidAt: -1 }).limit(5)
                .populate('bookingId', 'bookingNo customerName').lean(),
        ]);

        // Revenue this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const monthPayments = await Payment.find({
            isDeleted: { $ne: true },
            type: 'PAYMENT',
            paidAt: { $gte: startOfMonth },
        }).lean();
        const monthlyRevenue = monthPayments.reduce((s, p) => s + p.amount, 0);

        return NextResponse.json({
            stats: {
                totalBookings, newBookings, confirmedBookings,
                totalPackages, publishedPackages,
                totalVehicles, availableVehicles,
                openTickets, monthlyRevenue,
            },
            recentBookings,
            recentPayments,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
