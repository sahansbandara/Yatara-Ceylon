'use client';

import { useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, DollarSign, AlertCircle } from 'lucide-react';
import { useCurrency, formatPrice } from '@/lib/CurrencyContext';

interface BookingRequestClientProps {
    vehicle?: any;
    pkg?: any;
    user?: any;
}

export default function BookingRequestClient({ vehicle, pkg, user }: BookingRequestClientProps) {
    const searchParams = useSearchParams();
    const router = import('next/navigation').then(m => m.useRouter);
    // Note: Can also just use hooks directly

    const { currency, convertRate } = useCurrency();
    const typeFromQuery = searchParams.get('type') || (vehicle ? 'VEHICLE' : pkg ? 'PACKAGE' : 'PACKAGE');

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ message: string; success: boolean } | null>(null);

    const [form, setForm] = useState({
        customerName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: 'Sri Lanka',
        type: typeFromQuery,
        vehicleId: vehicle?._id || '',
        packageId: pkg?._id || '',
        pax: 1,
        pickupLocation: '',
        dates: {
            from: '',
            to: ''
        },
        notes: ''
    });

    // Calculate amounts
    const getAmounts = () => {
        if (pkg) {
            const total = pkg.price || pkg.priceMin || 0;
            const advance = total * 0.20;
            const remaining = total - advance;
            return { total, advance, remaining, hasPayment: total > 0 };
        }
        if (vehicle && form.dates.from && form.dates.to) {
            const date1 = new Date(form.dates.from).getTime();
            const date2 = new Date(form.dates.to).getTime();
            let days = Math.ceil((date2 - date1) / (1000 * 3600 * 24));
            if (days < 1) days = 1;
            const total = days * vehicle.dailyRate;
            const advance = total * 0.20;
            const remaining = total - advance;
            return { total, advance, remaining, hasPayment: total > 0 };
        }
        return { total: 0, advance: 0, remaining: 0, hasPayment: false };
    };

    const amounts = getAmounts();

    const handleCreateBookingAndPay = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure user is logged in before allowing payment
        if (amounts.hasPayment && amounts.advance > 0 && !user) {
            setStatus({ success: false, message: 'Please log in or create an account before proceeding to payment. Redirecting...' });

            // Build the current URL to redirect back after login
            const currentUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/booking-request';

            setTimeout(() => {
                window.location.href = `/auth/login?redirect=${encodeURIComponent(currentUrl)}`;
            }, 2000);
            return;
        }

        setLoading(true);
        setStatus(null);

        // Date validation
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const fromDate = new Date(form.dates.from);
        const toDate = new Date(form.dates.to);

        if (!form.dates.from || !form.dates.to) {
            setStatus({ success: false, message: 'Please select both Date From and Date To.' });
            setLoading(false);
            return;
        }
        if (fromDate < today) {
            setStatus({ success: false, message: 'Date From cannot be in the past.' });
            setLoading(false);
            return;
        }
        if (toDate <= fromDate) {
            setStatus({ success: false, message: 'Date To must be after Date From.' });
            setLoading(false);
            return;
        }

        try {
            // 1. Create booking via public API
            const bookingPayload: any = {
                ...form,
                totalCost: amounts.total,
            };

            const bookingRes = await fetch('/api/public/booking-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingPayload)
            });

            if (!bookingRes.ok) {
                const errData = await bookingRes.json();
                throw new Error(errData.error || 'Failed to create booking request');
            }
            const bookingData = await bookingRes.json();

            // 2. If there's an amount to pay, initiate PayHere
            if (amounts.hasPayment && amounts.advance > 0) {
                const itemLabel = pkg
                    ? `20% Advance - ${pkg.title}`
                    : vehicle
                        ? `20% Advance - ${vehicle.model} Transfer`
                        : `20% Advance - Booking ${bookingData.bookingNo}`;

                const payRes = await fetch('/api/payhere/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        bookingId: bookingData.bookingId,
                        customer: {
                            firstName: form.customerName.split(' ')[0],
                            lastName: form.customerName.split(' ').slice(1).join(' ') || 'N/A',
                            email: form.email,
                            phone: form.phone,
                            address: form.address,
                            city: form.city,
                            country: form.country,
                        },
                        items: itemLabel,
                        amount: amounts.advance
                    })
                });

                if (!payRes.ok) {
                    const payErr = await payRes.json();
                    throw new Error(payErr.error || 'Payment initialization failed');
                }
                const payData = await payRes.json();

                if (payData.isDevMode) {
                    setStatus({ success: true, message: 'Developer Mode: Simulating successful payment...' });
                    setTimeout(() => {
                        window.location.href = `/payment/return?order_id=${payData.orderId}`;
                    }, 1500);
                    return;
                }

                // 3. Redirect to PayHere Checkout via hidden form POST
                const payForm = document.createElement('form');
                payForm.method = 'POST';
                payForm.action = payData.checkoutUrl;
                // Populate hidden fields
                Object.entries(payData.fields as Record<string, string>).forEach(([key, value]) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = String(value);
                    payForm.appendChild(input);
                });
                document.body.appendChild(payForm);
                payForm.submit();
            } else {
                setStatus({ success: true, message: 'Booking request sent successfully. We will contact you soon.' });
                setLoading(false);
            }
        } catch (error: any) {
            console.error(error);
            setStatus({ success: false, message: error.message || 'An error occurred during booking. Please try again.' });
            setLoading(false);
        }
    };

    return (
        <>
            {/* Package/Vehicle Summary Card */}
            {(pkg || vehicle) && amounts.hasPayment && (
                <div className="mb-6 p-5 rounded-xl bg-gradient-to-r from-deep-emerald/5 to-antique-gold/5 border border-antique-gold/20">
                    <h3 className="text-sm font-display font-semibold text-deep-emerald mb-3">
                        {pkg ? pkg.title : `${vehicle.model} Transfer`}
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Total</p>
                            <p className="text-lg font-bold text-deep-emerald">{formatPrice(amounts.total, currency, convertRate)}</p>
                        </div>
                        <div className="border-x border-gray-200/60">
                            <p className="text-[10px] text-antique-gold uppercase tracking-wider mb-1 font-medium">20% Advance</p>
                            <p className="text-lg font-bold text-antique-gold">{formatPrice(amounts.advance, currency, convertRate)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Remaining</p>
                            <p className="text-lg font-bold text-gray-600">{formatPrice(amounts.remaining, currency, convertRate)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                        <AlertCircle className="h-3 w-3 text-antique-gold" />
                        <span>Pay 20% advance now to confirm your booking. Remaining balance due before departure.</span>
                    </div>
                </div>
            )}

            <form onSubmit={handleCreateBookingAndPay} className="space-y-6">
                {status && (
                    <div className={`p-4 rounded-md ${status.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        {status.message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="customerName">Full Name</Label>
                        <Input id="customerName" required value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input id="email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+94 77 123 4567" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pax">Number of Passengers</Label>
                        <Input id="pax" type="number" required min={1} value={form.pax} onChange={e => setForm({ ...form, pax: Number(e.target.value) })} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Address (Required for Payments)</Label>
                    <Input id="address" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123 Colombo Road" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Colombo" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" required value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="dateFrom">Date From</Label>
                        <Input id="dateFrom" type="date" required min={new Date().toISOString().split('T')[0]} value={form.dates.from} onChange={e => setForm({ ...form, dates: { ...form.dates, from: e.target.value } })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dateTo">Date To</Label>
                        <Input id="dateTo" type="date" required min={form.dates.from || new Date().toISOString().split('T')[0]} value={form.dates.to} onChange={e => setForm({ ...form, dates: { ...form.dates, to: e.target.value } })} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="pickupLocation">Pickup Location</Label>
                    <Input id="pickupLocation" required value={form.pickupLocation} onChange={e => setForm({ ...form, pickupLocation: e.target.value })} placeholder="e.g. Airport, Hotel" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notes">Special Notes (Optional)</Label>
                    <textarea
                        id="notes"
                        value={form.notes}
                        onChange={e => setForm({ ...form, notes: e.target.value })}
                        placeholder="Any special requirements or notes..."
                        className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-antique-gold/30 focus:border-antique-gold"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-deep-emerald hover:bg-deep-emerald/90 text-antique-gold font-serif tracking-widest uppercase rounded-none h-14 text-sm font-semibold shadow-[0_0_15px_rgba(212,175,55,0.2)] border border-transparent hover:border-antique-gold inline-flex items-center justify-center transition-all duration-300"
                >
                    {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin text-antique-gold" />}
                    {amounts.hasPayment ? (
                        <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay 20% Advance ({formatPrice(amounts.advance, currency, convertRate)}) & Confirm
                        </>
                    ) : (
                        'Submit Booking Request'
                    )}
                </Button>
            </form>
        </>
    );
}
