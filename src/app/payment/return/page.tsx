import { Metadata } from 'next';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Download, ChevronLeft } from 'lucide-react';
import ReceiptClient from './ReceiptClient';

export const metadata: Metadata = {
    title: 'Payment Successful | Yatara Ceylon',
};

async function getPaymentDetails(orderId: string) {
    await connectDB();

    // Find the payment
    const payment = await Payment.findOne({ orderId }).lean();
    if (!payment) return null;

    // Find the associated booking
    const booking = await Booking.findById((payment as any).bookingId)
        .populate('packageId')
        .populate('vehicleId')
        .lean();

    if (!booking) return null;

    // Build receipt payload
    return {
        payment: JSON.parse(JSON.stringify(payment)),
        booking: JSON.parse(JSON.stringify(booking))
    };
}

export default async function PaymentReturnPage({ searchParams }: { searchParams: Promise<{ order_id?: string }> }) {
    const params = await searchParams;
    const orderId = params.order_id;

    if (!orderId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid Request</h1>
                    <p className="text-gray-600 mb-6">No order ID was found in this request.</p>
                    <Link href="/">
                        <Button className="w-full">Return Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const data = await getPaymentDetails(orderId);

    if (!data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Not Found</h1>
                    <p className="text-gray-600 mb-6">We could not locate the details for this transaction.</p>
                    <Link href="/dashboard/my-bookings">
                        <Button className="w-full">Go to My Bookings</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* Success Header (Hidden during print) */}
                <div className="text-center print:hidden">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Payment Successful</h1>
                    <p className="mt-2 text-gray-600">
                        Thank you! Your payment for booking <strong>{data.booking.bookingNo}</strong> has been received.
                    </p>
                </div>

                {/* Printable Receipt Area */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <ReceiptClient data={data} />
                </div>

                {/* Bottom Actions (Hidden during print) */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
                    <Link href="/dashboard/my-bookings">
                        <Button variant="outline" className="w-full sm:w-auto gap-2">
                            <ChevronLeft className="h-4 w-4" /> Go to My Bookings
                        </Button>
                    </Link>
                    <ReceiptClient.PrintButton />
                </div>

            </div>
        </div>
    );
}
