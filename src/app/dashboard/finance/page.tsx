import FinanceStats from '@/components/dashboard/FinanceStats';
import InvoiceTable from '@/components/dashboard/InvoiceTable';
import PaymentTable from '@/components/dashboard/PaymentTable';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import Payment from '@/models/Payment';
import { Download } from 'lucide-react';

async function getFinanceData() {
    try {
        await connectDB();

        const [invoices, payments, refundStats, invoiceStats, revenueStats] = await Promise.all([
            Invoice.find({ isDeleted: false })
                .populate('bookingId', 'bookingNo customerName')
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),
            Payment.find({ isDeleted: false })
                .populate('bookingId', 'bookingNo customerName')
                .sort({ paidAt: -1 })
                .limit(10)
                .lean(),
            Payment.aggregate([
                { $match: { type: 'REFUND', isDeleted: false } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Invoice.aggregate([
                { $match: { status: 'DRAFT', isDeleted: false } },
                { $count: "count" }
            ]),
            Payment.aggregate([
                { $match: { type: 'PAYMENT', isDeleted: false } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ])
        ]);

        return {
            invoices: JSON.parse(JSON.stringify(invoices)),
            payments: JSON.parse(JSON.stringify(payments)),
            totalRefunds: refundStats[0]?.total || 0,
            pendingInvoices: invoiceStats[0]?.count || 0,
            totalRevenue: revenueStats[0]?.total || 0
        };

    } catch (error) {
        console.error("Failed to fetch finance data:", error);
        return {
            invoices: [],
            payments: [],
            totalRefunds: 0,
            pendingInvoices: 0,
            totalRevenue: 0
        };
    }
}

export default async function FinancePage() {
    const data = await getFinanceData();

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
                    <p className="text-muted-foreground">Overview of earnings, invoices, and expenses.</p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export Report
                </Button>
            </div>

            <FinanceStats
                revenue={data.totalRevenue}
                pendingInvoices={data.pendingInvoices}
                totalRefunds={data.totalRefunds}
            />

            <Tabs defaultValue="invoices" className="w-full">
                <TabsList>
                    <TabsTrigger value="invoices">Recent Invoices</TabsTrigger>
                    <TabsTrigger value="payments">Recent Transactions</TabsTrigger>
                </TabsList>
                <TabsContent value="invoices" className="mt-4">
                    <InvoiceTable invoices={data.invoices} />
                </TabsContent>
                <TabsContent value="payments" className="mt-4">
                    <PaymentTable payments={data.payments} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
