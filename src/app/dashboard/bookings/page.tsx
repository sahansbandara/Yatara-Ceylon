import BookingTable from '@/components/dashboard/BookingTable';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';

async function getBookings() {
    try {
        await connectDB();
        const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(bookings));
    } catch (error) {
        console.error("Failed to fetch bookings:", error);
        return [];
    }
}

export default async function BookingsPage() {
    const bookings = await getBookings();

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
                    <p className="text-muted-foreground">Manage ongoing and past bookings.</p>
                </div>
                {/* Could add filter/refresh buttons here */}
            </div>

            <BookingTable initialBookings={bookings} />
        </div>
    );
}
