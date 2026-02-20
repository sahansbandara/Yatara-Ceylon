'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SectionHeading from '@/components/public/SectionHeading';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function PaymentCancelContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center max-w-xl mx-auto mt-12">
            <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
            <p className="text-gray-600 mb-6">
                Your payment was cancelled or failed. Order Reference: {orderId || 'Unknown'}
            </p>
            <div className="flex justify-center gap-4">
                <Link href="/vehicles">
                    <Button className="bg-ocean-600 hover:bg-ocean-700">Browse Again</Button>
                </Link>
                <Link href="/contact">
                    <Button variant="outline">Contact Support</Button>
                </Link>
            </div>
        </div>
    );
}

export default function PaymentCancelPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-3xl mx-auto px-4 md:px-8">
                <SectionHeading title="Payment Status" description="There was an issue with your transaction." />
                <Suspense fallback={<div className="text-center py-20">Loading status...</div>}>
                    <PaymentCancelContent />
                </Suspense>
            </div>
        </div>
    );
}
