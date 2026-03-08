'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SectionHeading from '@/components/public/SectionHeading';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

function PaymentReturnContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');

    const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'FAILED' | 'ERROR'>('LOADING');

    useEffect(() => {
        if (!orderId) {
            setStatus('ERROR');
            return;
        }

        let attempts = 0;
        const maxAttempts = 15; // 30 seconds (15 * 2s)

        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/payments/status?orderId=${orderId}`);
                if (!res.ok) throw new Error('Failed to fetch status');
                const data = await res.json();

                if (data.payment) {
                    if (data.payment.status === 'SUCCESS' && data.payment.md5sigVerified) {
                        setStatus('SUCCESS');
                        clearInterval(interval);
                    } else if (data.payment.status === 'FAILED' || data.payment.status === 'CANCELED') {
                        setStatus('FAILED');
                        clearInterval(interval);
                    }
                }
            } catch (err) {
                console.error(err);
            }

            attempts++;
            if (attempts >= maxAttempts && status === 'LOADING') {
                setStatus('ERROR');
                clearInterval(interval);
            }
        };

        checkStatus(); // Check immediately
        const interval = setInterval(checkStatus, 2000); // Check every 2s

        return () => clearInterval(interval);
    }, [orderId]);

    if (status === 'LOADING') {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-xl mx-auto mt-12 flex flex-col items-center">
                <Loader2 className="h-12 w-12 text-ocean-600 animate-spin mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment...</h2>
                <p className="text-gray-600">Please wait while we verify your transaction. Do not close this page.</p>
            </div>
        );
    }

    if (status === 'SUCCESS') {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-12 text-center max-w-xl mx-auto mt-12">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-8">
                    Your booking (Order Ref: {orderId}) is confirmed. Thank you for choosing Yatara Ceylon!
                </p>
                <Link href="/">
                    <Button className="bg-ocean-600 hover:bg-ocean-700">Return to Home</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-12 text-center max-w-xl mx-auto mt-12">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h2>
            <p className="text-gray-600 mb-8">
                We could not verify your payment status in time or the transaction failed. Order Ref: {orderId}
            </p>
            <div className="flex justify-center gap-4">
                <Link href="/vehicles">
                    <Button className="bg-ocean-600 hover:bg-ocean-700">Try Again</Button>
                </Link>
                <Link href="/contact">
                    <Button variant="outline">Contact Support</Button>
                </Link>
            </div>
        </div>
    );
}

export default function PaymentReturnPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-3xl mx-auto px-4 md:px-8">
                <SectionHeading title="Payment Status" description="Verifying your transaction with PayHere." />
                <Suspense fallback={<div className="text-center py-20 text-gray-500">Checking...</div>}>
                    <PaymentReturnContent />
                </Suspense>
            </div>
        </div>
    );
}
