'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { BookingStatus } from '@/lib/constants';

interface Booking {
    _id: string;
    bookingNo: string;
    customerName: string;
    email: string;
    type: string;
    status: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
}

interface BookingTableProps {
    initialBookings: Booking[];
}

export default function BookingTable({ initialBookings }: BookingTableProps) {
    const [bookings, setBookings] = useState<Booking[]>(initialBookings);
    const router = useRouter();

    const getStatusColor = (status: string) => {
        switch (status) {
            case BookingStatus.NEW: return 'status-pill-info';
            case BookingStatus.CONTACTED: return 'status-pill-warning';
            case BookingStatus.CONFIRMED: return 'status-pill-success';
            case BookingStatus.COMPLETED: return 'status-pill-neutral';
            case BookingStatus.CANCELLED: return 'status-pill-danger';
            default: return 'status-pill-neutral';
        }
    };

    return (
        <div className="dashboard-table-glass overflow-hidden rounded-2xl w-full">
            <div className="overflow-x-auto w-full">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Booking No</th>
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Customer</th>
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Type</th>
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Dates</th>
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Amount</th>
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Status</th>
                            <th className="text-right px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <tr key={booking._id} className="border-b border-white/[0.04] last:border-b-0 hover:bg-antique-gold/[0.03] transition-colors">
                                    <td className="px-5 py-3.5 font-medium">
                                        <span className="text-white/85 text-xs font-mono">{booking.bookingNo}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex flex-col">
                                            <span className="text-white/85 text-xs">{booking.customerName}</span>
                                            <span className="text-[10px] text-white/35 mt-0.5">{booking.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-white/60 text-xs uppercase tracking-wider">{booking.type}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="text-[11px] text-white/50">
                                            {format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-white/85 text-xs font-bold">
                                            {booking.totalAmount > 0 ? `LKR ${booking.totalAmount.toLocaleString()}` : '-'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`status-pill ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-white/40 hover:text-antique-gold hover:bg-white/10 transition-colors"
                                            onClick={() => router.push(`/dashboard/bookings/${booking._id}`)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-5 py-12 text-center text-white/40 text-sm">
                                    No bookings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
