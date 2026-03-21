import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function getCustomerBookings(userEmail: string) {
    try {
        await connectDB();
        const bookings = await Booking.find({
            email: userEmail,
            isDeleted: false,
        })
            .sort({ createdAt: -1 })
            .populate('packageId', 'title')
            .lean();
        return JSON.parse(JSON.stringify(bookings));
    } catch {
        return [];
    }
}

import MyBookingsClient from "@/components/dashboard/MyBookingsClient";

export default async function MyBookingsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('toms_token')?.value;
    const payload = token ? await verifyToken(token) : null;
    const userEmail = payload?.email || '';

    const bookings = await getCustomerBookings(userEmail);

    return <MyBookingsClient bookings={bookings} />;
}
