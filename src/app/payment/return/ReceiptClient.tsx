'use client';

import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function ReceiptClient({ data }: { data: any }) {
    const { payment, booking } = data;

    // Safely handle missing package/vehicle objects or missing properties
    const pkgName = booking?.packageId?.title
        || (booking?.vehicleId?.model ? `${booking.vehicleId.model} Transfer` : 'Custom Tour');

    // Safely handle dates which might be missing in some db records
    const fromDate = booking?.dates?.from ? new Date(booking.dates.from) : null;
    const toDate = booking?.dates?.to ? new Date(booking.dates.to) : null;
    const paymentDate = payment?.createdAt ? new Date(payment.createdAt) : new Date();

    return (
        <div className="p-8 print:p-0 print:shadow-none print:border-none" id="receipt-area">
            {/* Receipt Header */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
                <div>
                    <h2 className="text-2xl font-display font-bold text-deep-emerald tracking-tight">Yatara Ceylon</h2>
                    <p className="text-sm text-gray-500 mt-1">Official Payment Receipt</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">Receipt No: <span className="font-normal text-gray-600">{payment?.orderId?.substring(0, 12) || 'N/A'}</span></p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">Date: <span className="font-normal text-gray-600">{format(paymentDate, 'PPP')}</span></p>
                </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
                    <p className="text-sm font-medium text-gray-900">{booking.customerName}</p>
                    {booking.email && <p className="text-sm text-gray-600">{booking.email}</p>}
                    <p className="text-sm text-gray-600">{booking.phone}</p>
                </div>
                <div className="text-right">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Booking Info</h3>
                    <p className="text-sm font-medium text-gray-900">Ref: {booking?.bookingNo || 'N/A'}</p>
                    <p className="text-sm text-gray-600">From: {fromDate ? format(fromDate, 'PP') : 'TBD'}</p>
                    <p className="text-sm text-gray-600">To: {toDate ? format(toDate, 'PP') : 'TBD'}</p>
                </div>
            </div>

            {/* Line Items */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">Payment For</span>
                    <span className="text-sm font-medium text-gray-900">Amount</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Advance/Payment for {pkgName}</span>
                    <span className="text-sm text-gray-900">LKR {Number(payment?.amount || 0).toLocaleString()}</span>
                </div>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 flex flex-col items-end gap-2">
                <div className="flex justify-between w-full sm:w-1/2">
                    <span className="text-sm text-gray-600">Total Booking Value:</span>
                    <span className="text-sm text-gray-900">LKR {Number(booking?.totalCost || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-full sm:w-1/2">
                    <span className="text-sm font-bold text-gray-900">Amount Paid:</span>
                    <span className="text-sm font-bold text-emerald-600">LKR {Number(payment?.amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-full sm:w-1/2 pt-2 border-t border-gray-100 mt-1">
                    <span className="text-sm text-gray-600">Remaining Balance:</span>
                    <span className="text-sm text-gray-900">LKR {Number(booking?.remainingBalance || 0).toLocaleString()}</span>
                </div>
            </div>

            <div className="mt-12 text-center text-xs text-gray-400">
                <p>If you have any questions about this receipt, please contact info@yataraceylon.me</p>
                <p className="mt-1">Yatara Ceylon • No 123, Colombo Road, Sri Lanka</p>
            </div>
        </div>
    );
}

// Attach a static print button component so we don't have to drill props
ReceiptClient.PrintButton = function PrintButton() {
    return (
        <Button
            className="w-full sm:w-auto gap-2 bg-deep-emerald hover:bg-deep-emerald/90 text-white"
            onClick={() => window.print()}
        >
            <Download className="h-4 w-4" /> Download / Print Receipt
        </Button>
    );
};
