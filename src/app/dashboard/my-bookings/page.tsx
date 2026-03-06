import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import { CalendarCheck, ArrowUpRight, Package as PackageIcon } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    PAYMENT_PENDING: 'bg-yellow-100 text-yellow-700',
    ADVANCE_PAID: 'bg-emerald-100 text-emerald-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    ASSIGNED: 'bg-purple-100 text-purple-700',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
    COMPLETED: 'bg-gray-100 text-gray-700',
    CANCELLED: 'bg-red-100 text-red-700',
    CONTACTED: 'bg-sky-100 text-sky-700',
};

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

export default async function MyBookingsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('toms_token')?.value;
    const payload = token ? await verifyToken(token) : null;
    const userEmail = payload?.email || '';

    const bookings = await getCustomerBookings(userEmail);

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-display font-bold tracking-tight text-white drop-shadow-sm">My Bookings</h1>
                <p className="text-sm text-gray-300 font-light mt-1">Track your travel inquiries and reservations</p>
            </div>

            {bookings.length > 0 ? (
                <div className="space-y-4">
                    {bookings.map((booking: any) => (
                        <div
                            key={booking._id}
                            className="bg-white/90 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4 text-deep-emerald"
                        >
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                    <CalendarCheck className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-mono font-semibold">{booking.bookingNo}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{booking.type}</p>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold">
                                    {booking.packageId?.title || 'Custom Booking'}
                                </p>
                                <p className="text-xs text-gray-600 mt-0.5">
                                    {new Date(booking.dates?.from).toLocaleDateString()} → {new Date(booking.dates?.to).toLocaleDateString()} · {booking.pax} pax
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm font-bold">${(booking.totalCost || 0).toLocaleString()}</p>
                                    {booking.paidAmount > 0 && (
                                        <p className="text-[10px] font-medium text-emerald-600">Paid: ${(booking.paidAmount || 0).toLocaleString()}</p>
                                    )}
                                    {booking.remainingBalance > 0 && (
                                        <p className="text-[10px] font-medium text-orange-600">Due: ${(booking.remainingBalance || 0).toLocaleString()}</p>
                                    )}
                                </div>
                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold whitespace-nowrap shadow-sm ${STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                                    {booking.status?.replace(/_/g, ' ')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center text-white">
                    <PackageIcon className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <h3 className="text-lg font-display font-semibold mb-2">No Bookings Yet</h3>
                    <p className="text-sm text-gray-300 mb-6">Browse our luxury packages and start your Sri Lankan adventure.</p>
                    <Link
                        href="/packages"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-deep-emerald font-medium text-sm rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        Explore Packages <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}
