import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import Vehicle from "@/models/Vehicle";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, CreditCard, Car, Users, MapPin, FileText } from "lucide-react";
import BookingStatusUpdater from "./BookingStatusUpdater";

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

async function getBookingDetail(id: string) {
    try {
        await connectDB();
        const booking = await Booking.findById(id)
            .populate('packageId', 'title slug priceMin priceMax')
            .populate('assignedStaffId', 'name email')
            .populate('assignedVehicleId', 'model type seats dailyRate')
            .lean();
        if (!booking || (booking as any).isDeleted) return null;

        const payments = await Payment.find({ bookingId: id, isDeleted: false })
            .sort({ createdAt: -1 })
            .lean();

        const vehicles = await Vehicle.find({ status: 'AVAILABLE' }).select('model type seats dailyRate').lean();

        return {
            booking: JSON.parse(JSON.stringify(booking)),
            payments: JSON.parse(JSON.stringify(payments)),
            vehicles: JSON.parse(JSON.stringify(vehicles)),
        };
    } catch {
        return null;
    }
}

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getBookingDetail(id);
    if (!data) notFound();

    const { booking, payments, vehicles } = data;
    const pkg = booking.packageId;

    return (
        <div className="flex flex-col gap-6 max-w-5xl">
            {/* Back */}
            <Link href="/dashboard/bookings" className="flex items-center gap-2 text-sm text-gray-500 hover:text-deep-emerald transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Bookings
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-display font-bold text-deep-emerald">{booking.bookingNo}</h1>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                            {booking.status?.replace(/_/g, ' ')}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Created {new Date(booking.createdAt).toLocaleString()} · {booking.type}
                    </p>
                </div>
                <BookingStatusUpdater bookingId={booking._id} currentStatus={booking.status} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info */}
                    <div className="liquid-glass-stat rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="h-4 w-4 text-antique-gold" />
                            <h3 className="text-sm font-display font-semibold text-deep-emerald uppercase tracking-wider">Customer</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Name</p>
                                <p className="text-sm font-medium text-deep-emerald">{booking.customerName}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Phone</p>
                                <p className="text-sm text-deep-emerald">{booking.phone}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Email</p>
                                <p className="text-sm text-deep-emerald">{booking.email || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Passengers</p>
                                <p className="text-sm text-deep-emerald">{booking.pax} pax</p>
                            </div>
                        </div>
                    </div>

                    {/* Package/Trip Info */}
                    <div className="liquid-glass-stat rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CalendarCheck className="h-4 w-4 text-antique-gold" />
                            <h3 className="text-sm font-display font-semibold text-deep-emerald uppercase tracking-wider">Trip Details</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Package</p>
                                <p className="text-sm font-medium text-deep-emerald">{pkg?.title || booking.type}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Pickup</p>
                                <p className="text-sm text-deep-emerald">{booking.pickupLocation || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">From</p>
                                <p className="text-sm text-deep-emerald">{booking.dates?.from ? new Date(booking.dates.from).toLocaleDateString() : '—'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">To</p>
                                <p className="text-sm text-deep-emerald">{booking.dates?.to ? new Date(booking.dates.to).toLocaleDateString() : '—'}</p>
                            </div>
                        </div>
                        {booking.notes && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Notes</p>
                                <p className="text-sm text-gray-600">{booking.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Payment History */}
                    <div className="liquid-glass-stat rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="h-4 w-4 text-antique-gold" />
                            <h3 className="text-sm font-display font-semibold text-deep-emerald uppercase tracking-wider">Payment History</h3>
                        </div>
                        {payments.length > 0 ? (
                            <div className="space-y-2">
                                {payments.map((p: any) => (
                                    <div key={p._id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/50 border border-gray-100">
                                        <div>
                                            <p className="text-xs font-mono font-semibold text-deep-emerald">{p.orderId}</p>
                                            <p className="text-[10px] text-gray-400">{p.provider} · {p.method || '—'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-deep-emerald">${(p.amount || 0).toLocaleString()}</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : p.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                {p.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No payment records yet.</p>
                        )}
                    </div>

                    {/* Vehicle Assignment */}
                    <div className="liquid-glass-stat rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Car className="h-4 w-4 text-antique-gold" />
                            <h3 className="text-sm font-display font-semibold text-deep-emerald uppercase tracking-wider">Vehicle Assignment</h3>
                        </div>
                        {booking.assignedVehicleId ? (
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200/50">
                                <Car className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="text-sm font-semibold text-deep-emerald">{booking.assignedVehicleId.model}</p>
                                    <p className="text-xs text-gray-500">{booking.assignedVehicleId.type} · {booking.assignedVehicleId.seats} seats</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No vehicle assigned yet.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar — Financial Summary */}
                <div className="space-y-6">
                    <div className="liquid-glass-stat rounded-2xl p-6 sticky top-24">
                        <h3 className="text-sm font-display font-semibold text-deep-emerald uppercase tracking-wider mb-4">Financial Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Total Cost</span>
                                <span className="text-lg font-bold text-deep-emerald">${(booking.totalCost || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Advance ({booking.advancePercentage || 20}%)</span>
                                <span className="text-sm font-semibold text-antique-gold">${(booking.advanceAmount || 0).toLocaleString()}</span>
                            </div>
                            <hr className="border-gray-100" />
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-emerald-600 font-medium">Amount Paid</span>
                                <span className="text-sm font-bold text-emerald-600">${(booking.paidAmount || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-orange-600 font-medium">Remaining Balance</span>
                                <span className="text-sm font-bold text-orange-600">${(booking.remainingBalance || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Staff Assignment */}
                    <div className="liquid-glass-stat rounded-2xl p-6">
                        <h3 className="text-sm font-display font-semibold text-deep-emerald uppercase tracking-wider mb-3">Assigned Staff</h3>
                        {booking.assignedStaffId ? (
                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/50 border border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600">
                                    {booking.assignedStaffId.name?.[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-deep-emerald">{booking.assignedStaffId.name}</p>
                                    <p className="text-[10px] text-gray-400">{booking.assignedStaffId.email}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">Not assigned</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
