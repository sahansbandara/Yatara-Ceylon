import { MyBookingsService } from '@/services/crud.service';
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import MyBookingsClient from "@/components/dashboard/MyBookingsClient";

export default async function MyBookingsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('toms_token')?.value;
    const payload = token ? await verifyToken(token) : null;
    const userEmail = payload?.email || '';

    const bookings = await MyBookingsService.getCustomerBookings(userEmail);

    return <MyBookingsClient bookings={bookings} />;
}
