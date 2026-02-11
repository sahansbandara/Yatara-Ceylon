'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2 } from 'lucide-react';
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
            case BookingStatus.NEW: return 'bg-blue-100 text-blue-800 border-blue-200';
            case BookingStatus.CONTACTED: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case BookingStatus.CONFIRMED: return 'bg-green-100 text-green-800 border-green-200';
            case BookingStatus.COMPLETED: return 'bg-gray-100 text-gray-800 border-gray-200';
            case BookingStatus.CANCELLED: return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Booking No</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <TableRow key={booking._id}>
                                <TableCell className="font-medium">{booking.bookingNo}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{booking.customerName}</span>
                                        <span className="text-xs text-muted-foreground">{booking.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{booking.type}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        {format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {booking.totalAmount > 0 ? `$${booking.totalAmount.toLocaleString()}` : '-'}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={getStatusColor(booking.status)}>
                                        {booking.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-ocean-600"
                                        onClick={() => router.push(`/dashboard/bookings/${booking._id}`)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                No bookings found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
