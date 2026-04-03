import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Booking from "@/models/Booking";
import Invoice from "@/models/Invoice";
import { rankOutstandingBookings } from "@/lib/finance-dashboard";

export const FinanceService = {
    async getFinanceData(dateFrom?: string, dateTo?: string) {
        try {
            await connectDB();

            const paymentDateMatch: Record<string, unknown> = {};
            if (dateFrom) paymentDateMatch.$gte = new Date(`${dateFrom}T00:00:00.000Z`);
            if (dateTo) paymentDateMatch.$lte = new Date(`${dateTo}T23:59:59.999Z`);
            const hasDateFilter = Object.keys(paymentDateMatch).length > 0;
            const paymentBaseMatch: Record<string, unknown> = { status: 'SUCCESS', type: 'PAYMENT', isDeleted: false };
            if (hasDateFilter) paymentBaseMatch.createdAt = paymentDateMatch;
            const allPaymentMatch: Record<string, unknown> = { isDeleted: false };
            if (hasDateFilter) allPaymentMatch.createdAt = paymentDateMatch;
            const invoiceBaseMatch: Record<string, unknown> = { isDeleted: { $ne: true } };
            if (hasDateFilter) invoiceBaseMatch.createdAt = paymentDateMatch;

            const revenueByMonthPipeline: any[] = hasDateFilter
                ? [
                    { $match: paymentBaseMatch },
                    { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, total: { $sum: "$amount" }, count: { $sum: 1 } } },
                    { $sort: { _id: 1 } },
                ]
                : [
                    { $match: paymentBaseMatch },
                    { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, total: { $sum: "$amount" }, count: { $sum: 1 } } },
                    { $sort: { _id: -1 } },
                    { $limit: 6 },
                    { $sort: { _id: 1 } },
                ];

            const [
                totalRevenueAgg,
                pendingBalancesAgg,
                advancePaidAgg,
                recentPayments,
                recentInvoices,
                invoiceStatusSummary,
                bookingsWithBalance,
                revenueByMonth,
                agingBucketsData,
            ] = await Promise.all([
                Payment.aggregate([
                    { $match: paymentBaseMatch },
                    { $group: { _id: null, total: { $sum: "$amount" } } }
                ]),
                Booking.aggregate([
                    { $match: { isDeleted: false, remainingBalance: { $gt: 0 } } },
                    { $group: { _id: null, total: { $sum: "$remainingBalance" }, count: { $sum: 1 } } }
                ]),
                Booking.aggregate([
                    { $match: { isDeleted: false, paidAmount: { $gt: 0 } } },
                    { $group: { _id: null, total: { $sum: "$paidAmount" }, count: { $sum: 1 } } }
                ]),
                Payment.find(allPaymentMatch)
                    .sort({ createdAt: -1 })
                    .limit(10)
                    .populate('bookingId', 'bookingNo customerName')
                    .lean(),
                Invoice.find(invoiceBaseMatch)
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .populate('bookingId', 'bookingNo customerName')
                    .lean(),
                Invoice.aggregate([
                    { $match: invoiceBaseMatch },
                    { $group: { _id: "$status", count: { $sum: 1 }, total: { $sum: "$total" } } },
                ]),
                Booking.find({ isDeleted: false, remainingBalance: { $gt: 0 } })
                    .select('bookingNo customerName totalCost paidAmount remainingBalance status dates createdAt')
                    .lean(),
                Payment.aggregate(revenueByMonthPipeline),
                Booking.aggregate([
                    { $match: { isDeleted: false, remainingBalance: { $gt: 0 } } },
                    { $addFields: { daysOverdue: { $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60 * 24] } } },
                    {
                        $facet: {
                            "0-7": [{ $match: { daysOverdue: { $lte: 7 } } }, { $count: "count" }],
                            "8-14": [{ $match: { daysOverdue: { $gt: 7, $lte: 14 } } }, { $count: "count" }],
                            "15-30": [{ $match: { daysOverdue: { $gt: 14, $lte: 30 } } }, { $count: "count" }],
                            "30+": [{ $match: { daysOverdue: { $gt: 30 } } }, { $count: "count" }]
                        }
                    }
                ])
            ]);

            const agingData = agingBucketsData[0] || {};
            const invoiceSummaryMap = new Map(
                invoiceStatusSummary.map((row: any) => [row._id, row])
            );

            const rankedOutstandingBalances = rankOutstandingBookings(
                JSON.parse(JSON.stringify(bookingsWithBalance))
            ).slice(0, 10);

            return {
                totalRevenue: totalRevenueAgg[0]?.total || 0,
                pendingBalances: pendingBalancesAgg[0]?.total || 0,
                pendingCount: pendingBalancesAgg[0]?.count || 0,
                advancePaid: advancePaidAgg[0]?.total || 0,
                advanceCount: advancePaidAgg[0]?.count || 0,
                recentPayments: JSON.parse(JSON.stringify(recentPayments)),
                recentInvoices: JSON.parse(JSON.stringify(recentInvoices)),
                invoiceSummary: {
                    DRAFT: invoiceSummaryMap.get('DRAFT')?.count || 0,
                    FINAL: invoiceSummaryMap.get('FINAL')?.count || 0,
                    VOID: invoiceSummaryMap.get('VOID')?.count || 0,
                },
                bookingsWithBalance: rankedOutstandingBalances,
                revenueByMonth: JSON.parse(JSON.stringify(revenueByMonth)),
                aging: {
                    "0-7": agingData["0-7"]?.[0]?.count || 0,
                    "8-14": agingData["8-14"]?.[0]?.count || 0,
                    "15-30": agingData["15-30"]?.[0]?.count || 0,
                    "30+": agingData["30+"]?.[0]?.count || 0,
                }
            };
        } catch (error) {
            console.error("Finance data fetch error:", error);
            return {
                totalRevenue: 0, pendingBalances: 0, pendingCount: 0,
                advancePaid: 0, advanceCount: 0, recentPayments: [], recentInvoices: [], bookingsWithBalance: [],
                invoiceSummary: { DRAFT: 0, FINAL: 0, VOID: 0 },
                revenueByMonth: [], aging: { "0-7": 0, "8-14": 0, "15-30": 0, "30+": 0 }
            };
        }
    }
};
