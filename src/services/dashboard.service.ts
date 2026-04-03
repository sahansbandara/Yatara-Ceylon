import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Package from "@/models/Package";
import User from "@/models/User";
import Vehicle from "@/models/Vehicle";
import Partner from "@/models/Partner";
import Payment from "@/models/Payment";
import AuditLog from "@/models/AuditLog";
import PartnerRequest from "@/models/PartnerRequest";

export const DashboardService = {
    async getDashboardStats() {
        try {
            await connectDB();

            const [
                totalBookings,
                pendingBookings,
                activePackages,
                totalUsers,
                availableVehicles,
                totalPartners,
                revenueAgg,
                pendingPaymentsAgg,
                recentBookings,
                bookingsByStatus,
                revenueByStatus,
                upcomingDepartures,
                pendingPartnerRequests,
                pendingVehicles,
                recentActivityLogs,
            ] = await Promise.all([
                Booking.countDocuments({ isDeleted: false }),
                Booking.countDocuments({ isDeleted: false, status: { $in: ['NEW', 'PAYMENT_PENDING', 'CONTACTED'] } }),
                Package.countDocuments({ isPublished: true, isDeleted: false }),
                User.countDocuments({ isDeleted: false }),
                Vehicle.countDocuments({ status: 'AVAILABLE' }),
                Partner.countDocuments({ status: 'ACTIVE' }),
                Payment.aggregate([
                    { $match: { status: 'SUCCESS', type: 'PAYMENT', isDeleted: false } },
                    { $group: { _id: null, total: { $sum: "$amount" } } }
                ]),
                Booking.aggregate([
                    { $match: { isDeleted: false, remainingBalance: { $gt: 0 } } },
                    { $group: { _id: null, total: { $sum: "$remainingBalance" } } }
                ]),
                Booking.find({ isDeleted: false })
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .populate('packageId', 'title')
                    .lean(),
                Booking.aggregate([
                    { $match: { isDeleted: false } },
                    { $group: { _id: "$status", count: { $sum: 1 }, revenue: { $sum: "$totalCost" } } }
                ]),
                Booking.aggregate([
                    { $match: { isDeleted: false } },
                    { $group: { _id: "$status", revenue: { $sum: "$totalCost" }, count: { $sum: 1 } } }
                ]),
                Booking.find({
                    isDeleted: false,
                    'dates.from': {
                        $gte: new Date(),
                        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    }
                })
                    .sort({ 'dates.from': 1 })
                    .limit(5)
                    .populate('packageId', 'title')
                    .lean(),
                PartnerRequest.countDocuments({ status: 'PENDING' }),
                Vehicle.countDocuments({ status: { $ne: 'AVAILABLE' } }),
                AuditLog.find()
                    .sort({ at: -1 })
                    .limit(5)
                    .lean()
            ]);

            return {
                totalBookings,
                pendingBookings,
                activePackages,
                totalUsers,
                availableVehicles,
                totalPartners,
                totalRevenue: revenueAgg[0]?.total || 0,
                pendingBalances: pendingPaymentsAgg[0]?.total || 0,
                recentBookings: JSON.parse(JSON.stringify(recentBookings)),
                bookingsByStatus: JSON.parse(JSON.stringify(bookingsByStatus)),
                revenueByStatus: JSON.parse(JSON.stringify(revenueByStatus)),
                upcomingDepartures: JSON.parse(JSON.stringify(upcomingDepartures)),
                recentActivityLogs: JSON.parse(JSON.stringify(recentActivityLogs)),
                pendingPartnerRequests,
                pendingVehicles,
            };
        } catch (error) {
            console.error("Failed to fetch dashboard stats:", error);
            return {
                totalBookings: 0,
                pendingBookings: 0,
                activePackages: 0,
                totalUsers: 0,
                availableVehicles: 0,
                totalPartners: 0,
                totalRevenue: 0,
                pendingBalances: 0,
                recentBookings: [],
                bookingsByStatus: [],
                revenueByStatus: [],
                upcomingDepartures: [],
                recentActivityLogs: [],
                pendingPartnerRequests: 0,
                pendingVehicles: 0,
            };
        }
    }
};
