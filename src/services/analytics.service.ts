import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import Package from "@/models/Package";

export const AnalyticsService = {
    async getAnalyticsData(dateFrom: string, dateTo: string) {
        try {
            await connectDB();

            const rangeStart = new Date(`${dateFrom}T00:00:00.000Z`);
            const rangeEnd = new Date(`${dateTo}T23:59:59.999Z`);

            // Fetch Monthly Bookings Volume
            const bookingsByMonth = await Booking.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        createdAt: { $gte: rangeStart, $lte: rangeEnd }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        count: { $sum: 1 },
                        gbv: { $sum: "$totalCost" }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]);

            // Fetch Monthly Actual Revenue (Payments)
            const revenueByMonth = await Payment.aggregate([
                {
                    $match: {
                        status: 'SUCCESS',
                        type: 'PAYMENT',
                        isDeleted: false,
                        createdAt: { $gte: rangeStart, $lte: rangeEnd }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        revenue: { $sum: "$amount" }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]);

            // Fetch Top Packages by Request/Booking Volume
            const topPackages = await Booking.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        packageId: { $exists: true, $ne: null },
                        createdAt: { $gte: rangeStart, $lte: rangeEnd }
                    }
                },
                {
                    $group: {
                        _id: "$packageId",
                        bookingsCount: { $sum: 1 },
                        totalRevenue: { $sum: "$totalCost" }
                    }
                },
                { $sort: { bookingsCount: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: "packages",
                        localField: "_id",
                        foreignField: "_id",
                        as: "packageDetails"
                    }
                },
                { $unwind: { path: "$packageDetails", preserveNullAndEmptyArrays: true } }
            ]);

            return {
                monthlyBookings: JSON.parse(JSON.stringify(bookingsByMonth)),
                monthlyRevenue: JSON.parse(JSON.stringify(revenueByMonth)),
                topPackages: JSON.parse(JSON.stringify(topPackages))
            };
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
            return {
                monthlyBookings: [],
                monthlyRevenue: [],
                topPackages: []
            };
        }
    }
};
