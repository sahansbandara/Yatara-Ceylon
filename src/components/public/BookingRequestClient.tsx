'use client';

import { useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function BookingRequestClient({ vehicle }: { vehicle?: any }) {
    const searchParams = useSearchParams();
    const typeFromQuery = searchParams.get('type') || (vehicle ? 'VEHICLE' : 'PACKAGE');

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ message: string; success: boolean } | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [checkoutData, setCheckoutData] = useState<{ url: string; fields: any } | null>(null);

    const [form, setForm] = useState({
        customerName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: 'Sri Lanka',
        type: typeFromQuery,
        vehicleId: vehicle?._id || '',
        pax: 1,
        pickupLocation: '',
        dates: {
            from: '',
            to: ''
        },
        notes: ''
    });

    const handleCreateBookingAndPay = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            // 1. Create booking
            const bookingRes = await fetch('/api/public/booking-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (!bookingRes.ok) throw new Error('Failed to create booking request');
            const bookingData = await bookingRes.json();

            // Calculate expected amount if it's a vehicle (e.g. dailyRate * days)
            let amountVal = 0;
            if (vehicle) {
                const date1 = new Date(form.dates.from).getTime();
                const date2 = new Date(form.dates.to).getTime();
                let days = Math.ceil((date2 - date1) / (1000 * 3600 * 24));
                if (days < 1) days = 1;

                amountVal = days * vehicle.dailyRate;
            }

            // Only attempt to pay if amount > 0
            if (amountVal > 0) {
                // 2. Init PayHere
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
                        items: vehicle ? `${vehicle.model} Transfer` : `Booking ${bookingData.bookingNo}`,
                        amount: amountVal
                    })
                });

                if (!payRes.ok) throw new Error('Payment initialization failed');
                const payData = await payRes.json();

                // 3. Render HTML form and submit
                setCheckoutData({ url: payData.checkoutUrl, fields: payData.fields });

                // Wait for form to render then submit
                setTimeout(() => {
                    if (formRef.current) formRef.current.submit();
                }, 500);

            } else {
                setStatus({ success: true, message: 'Booking request sent successfully. We will contact you soon.' });
                setLoading(false);
            }

        } catch (error) {
            console.error(error);
            setStatus({ success: false, message: 'An error occurred during booking. Please try again.' });
            setLoading(false);
        }
    };

    return (
        <>
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
                        <Input id="dateFrom" type="date" required value={form.dates.from} onChange={e => setForm({ ...form, dates: { ...form.dates, from: e.target.value } })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dateTo">Date To</Label>
                        <Input id="dateTo" type="date" required value={form.dates.to} onChange={e => setForm({ ...form, dates: { ...form.dates, to: e.target.value } })} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="pickupLocation">Pickup Location</Label>
                    <Input id="pickupLocation" required value={form.pickupLocation} onChange={e => setForm({ ...form, pickupLocation: e.target.value })} placeholder="e.g. Airport, Hotel" />
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-ocean-600 hover:bg-ocean-700 text-white rounded-xl h-12 text-lg font-semibold shadow-md inline-flex items-center justify-center">
                    {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    {vehicle ? 'Confirm & Pay Now' : 'Submit Request'}
                </Button>
            </form>

            {/* Hidden PayHere Form */}
            {checkoutData && (
                <form ref={formRef} action={checkoutData.url} method="POST" className="hidden">
                    {Object.entries(checkoutData.fields).map(([key, val]) => (
                        <input key={key} type="hidden" name={key} value={val as string} />
                    ))}
                </form>
            )}
        </>
    );
}
