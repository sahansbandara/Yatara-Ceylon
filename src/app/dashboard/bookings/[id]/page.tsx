import { BookingDetailService } from '@/services/crud.service';
import { formatLKR } from '@/lib/currency';
import RecordPaymentModal from "@/components/dashboard/finance/RecordPaymentModal";
import RecordRefundModal from "@/components/dashboard/finance/RecordRefundModal";
import CreateInvoiceModal from "@/components/dashboard/finance/CreateInvoiceModal";
import FinalizeInvoiceButton from "@/components/dashboard/finance/FinalizeInvoiceButton";
import VoidInvoiceButton from "@/components/dashboard/finance/VoidInvoiceButton";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, CreditCard, Car, Users, MapPin, FileText, History } from "lucide-react";
import BookingTimeline from "@/components/dashboard/bookings/BookingTimeline";
import BookingAttachmentsPanel from "@/components/dashboard/bookings/BookingAttachmentsPanel";
import BookingWhatsAppCard from "@/components/dashboard/bookings/BookingWhatsAppCard";
import BookingStatusUpdater from "./BookingStatusUpdater";
import { getSessionUser } from "@/lib/auth";
import AssignVehicleModal from "@/components/dashboard/bookings/AssignVehicleModal";
import FinalizePricingModal from "@/components/dashboard/bookings/FinalizePricingModal";
import EditInvoiceModal from "@/components/dashboard/finance/EditInvoiceModal";
import DeleteInvoiceButton from "@/components/dashboard/finance/DeleteInvoiceButton";

const STATUS_COLORS: Record<string, string> = {
    NEW: 'bg-blue-500/15 text-blue-300',
    PAYMENT_PENDING: 'bg-yellow-500/15 text-yellow-300',
    ADVANCE_PAID: 'bg-emerald-500/15 text-emerald-300',
    CONFIRMED: 'bg-green-500/15 text-green-300',
    ASSIGNED: 'bg-purple-500/15 text-purple-300',
    IN_PROGRESS: 'bg-indigo-500/15 text-indigo-300',
    COMPLETED: 'bg-white/10 text-white/60',
    CANCELLED: 'bg-red-500/15 text-red-300',
    CONTACTED: 'bg-sky-500/15 text-sky-300',
};

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await BookingDetailService.getBookingDetail(id);
    if (!data) notFound();

    const session = await getSessionUser();
    const userRole = session?.role || 'USER';

    const { booking, payments, invoices, vehicles } = data;
    const pkg = booking.packageId;

    return (
        <div className="flex flex-col gap-6 max-w-5xl">
            {/* Back */}
            <Link href="/dashboard/bookings" className="flex items-center gap-2 text-sm text-white/50 hover:text-antique-gold transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Bookings
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-display font-bold text-off-white">{booking.bookingNo}</h1>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[booking.status] || 'bg-white/10 text-white/50'}`}>
                            {booking.status?.replace(/_/g, ' ')}
                        </span>
                    </div>
                    <p className="text-sm text-white/40 mt-1">
                        Created {new Date(booking.createdAt).toLocaleString()} · {booking.type}
                    </p>
                </div>
                <BookingStatusUpdater bookingId={String(booking._id)} currentStatus={booking.status} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info */}
                    <div className="liquid-glass-stat-dark rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="h-4 w-4 text-antique-gold" />
                            <h3 className="text-sm font-display font-semibold text-antique-gold uppercase tracking-wider">Customer</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Name</p>
                                <p className="text-sm font-medium text-off-white">{booking.customerName}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Phone</p>
                                <p className="text-sm text-white/70">{booking.phone}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Email</p>
                                <p className="text-sm text-white/70">{booking.email || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Passengers</p>
                                <p className="text-sm text-white/70">{booking.pax} pax</p>
                            </div>
                        </div>
                    </div>

                    {/* Package/Trip Info */}
                    <div className="liquid-glass-stat-dark rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CalendarCheck className="h-4 w-4 text-antique-gold" />
                            <h3 className="text-sm font-display font-semibold text-antique-gold uppercase tracking-wider">Trip Details</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Package</p>
                                <p className="text-sm font-medium text-off-white">{pkg?.title || booking.type}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Pickup</p>
                                <p className="text-sm text-off-white">{booking.pickupLocation || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">From</p>
                                <p className="text-sm text-off-white">{booking.dates?.from ? new Date(booking.dates.from).toLocaleDateString() : '—'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">To</p>
                                <p className="text-sm text-off-white">{booking.dates?.to ? new Date(booking.dates.to).toLocaleDateString() : '—'}</p>
                            </div>
                        </div>
                        {booking.notes && (
                            <div className="mt-4 pt-4 border-t border-white/[0.08]">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Notes</p>
                                <p className="text-sm text-white/60">{booking.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Payment History */}
                    <div className="liquid-glass-stat-dark rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="h-4 w-4 text-antique-gold" />
                            <h3 className="text-sm font-display font-semibold text-antique-gold uppercase tracking-wider">Payment History</h3>
                        </div>
                        {payments.length > 0 ? (
                            <div className="space-y-2">
                                {payments.map((p: any) => (
                                    <div key={p._id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                        <div>
                                            <p className="text-xs font-mono font-semibold text-off-white">{p.orderId}</p>
                                            <p className="text-[10px] text-gray-400">{p.provider} · {p.method || '—'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-off-white">{formatLKR(p.amount || 0)}</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.status === 'SUCCESS' ? 'bg-green-500/15 text-green-300' : p.status === 'PENDING' ? 'bg-yellow-500/15 text-yellow-300' : 'bg-red-500/15 text-red-300'}`}>
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

                    {/* Invoices */}
                    <div className="liquid-glass-stat-dark rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-antique-gold" />
                                <h3 className="text-sm font-display font-semibold text-antique-gold uppercase tracking-wider">Invoices</h3>
                            </div>
                            <CreateInvoiceModal bookingId={String(booking._id)} />
                        </div>
                        {invoices.length > 0 ? (
                            <div className="space-y-2">
                                {invoices.map((inv: any) => (
                                    <div key={inv._id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                        <div>
                                            <p className="text-xs font-mono font-semibold text-off-white">{inv.invoiceNo}</p>
                                            <p className="text-[10px] text-gray-400">Issued: {new Date(inv.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-off-white">{formatLKR(inv.total || 0)}</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${inv.status === 'FINAL' ? 'bg-purple-500/15 text-purple-300' : inv.status === 'VOID' ? 'bg-red-500/15 text-red-300' : 'bg-gray-500/15 text-gray-300'}`}>
                                                {inv.status}
                                            </span>
                                            {inv.status === 'DRAFT' && (
                                                <>
                                                    <EditInvoiceModal
                                                        invoiceId={inv._id.toString()}
                                                        currentItems={inv.items || []}
                                                        currentDiscount={inv.discount || 0}
                                                        currentAdvanceRequired={inv.advanceRequired || 0}
                                                        currentNotes={inv.notes || ''}
                                                    />
                                                    <DeleteInvoiceButton invoiceId={inv._id.toString()} invoiceNo={inv.invoiceNo} />
                                                    <FinalizeInvoiceButton invoiceId={inv._id.toString()} />
                                                </>
                                            )}
                                            {inv.status === 'FINAL' && (
                                                <VoidInvoiceButton invoiceId={inv._id.toString()} />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No invoices generated yet.</p>
                        )}
                    </div>

                    <div className="liquid-glass-stat-dark rounded-2xl p-6">
                        <BookingAttachmentsPanel
                            bookingId={String(booking._id)}
                            invoiceOptions={invoices.map((invoice: any) => ({
                                _id: String(invoice._id),
                                invoiceNo: invoice.invoiceNo,
                                status: invoice.status,
                            }))}
                            canManage={userRole === 'ADMIN' || userRole === 'STAFF'}
                        />
                    </div>

                    <div className="liquid-glass-stat-dark rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Car className="h-4 w-4 text-antique-gold" />
                            <h3 className="text-sm font-display font-semibold text-antique-gold uppercase tracking-wider">Vehicle Assignment</h3>
                        </div>
                        {booking.assignedVehicleId ? (
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <Car className="h-5 w-5 text-emerald-400" />
                                <div>
                                    <p className="text-sm font-semibold text-off-white">{booking.assignedVehicleId.model}</p>
                                    <p className="text-xs text-white/50">{booking.assignedVehicleId.type} · {booking.assignedVehicleId.seats} seats</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No vehicle assigned yet.</p>
                        )}
                        {(userRole === 'ADMIN' || userRole === 'VEHICLE_OWNER' || userRole === 'STAFF') && (
                            <AssignVehicleModal
                                bookingId={String(booking._id)}
                                currentVehicleId={booking.assignedVehicleId?._id}
                                vehicles={vehicles}
                            />
                        )}
                    </div>

                    {/* Activity Timeline */}
                    <div className="liquid-glass-stat-dark rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <History className="h-4 w-4 text-antique-gold" />
                            <h3 className="text-sm font-display font-semibold text-antique-gold uppercase tracking-wider">Activity Timeline</h3>
                        </div>
                        <BookingTimeline bookingId={String(booking._id)} />
                    </div>
                </div>

                {/* Sidebar — Financial Summary */}
                <div className="space-y-6">
                    <div className="rounded-3xl p-6 bg-gradient-to-br from-[#111A16] to-[#0A100D] border border-white/[0.05] shadow-2xl relative overflow-hidden">
                        {/* Glows */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-antique-gold/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-antique-gold/30 to-transparent"></div>

                        <h3 className="text-sm font-display font-semibold text-antique-gold uppercase tracking-wider mb-6 relative z-10 flex items-center gap-2">
                            <CreditCard className="h-4 w-4" /> Financial Summary
                        </h3>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center bg-white/[0.02] p-3 rounded-xl border border-white/[0.02]">
                                <span className="text-xs text-white/50 tracking-wide uppercase">Total Cost</span>
                                <span className="text-lg font-display font-bold text-off-white">{formatLKR(booking.totalCost || 0)}</span>
                            </div>
                            <div className="flex justify-between items-center px-2">
                                <span className="text-xs text-white/40 tracking-wide">Advance (20%)</span>
                                <span className="text-xs font-semibold text-antique-gold/80">{formatLKR((booking.totalCost || 0) * 0.2)}</span>
                            </div>
                            <hr className="border-white/[0.05] my-2" />
                            <div className="flex justify-between items-center px-2">
                                <span className="text-[11px] text-emerald-400 font-medium uppercase tracking-wider">Amount Paid</span>
                                <span className="text-sm font-bold text-emerald-400">{formatLKR(booking.paidAmount || 0)}</span>
                            </div>
                            <div className="flex justify-between items-center bg-orange-500/5 p-3 rounded-xl border border-orange-500/20">
                                <span className="text-[11px] text-orange-400 font-bold uppercase tracking-wider">Balance Due</span>
                                <span className="text-xl font-display font-bold text-orange-400">{formatLKR(booking.remainingBalance || 0)}</span>
                            </div>
                        </div>
                        <div className="mt-8 relative z-10 flex flex-col gap-3">
                            {booking.remainingBalance > 0 && (
                                <RecordPaymentModal bookingId={String(booking._id)} remainingBalance={booking.remainingBalance} />
                            )}
                            {(userRole === 'ADMIN' || userRole === 'STAFF') && booking.paidAmount > 0 && (
                                <RecordRefundModal bookingId={String(booking._id)} maxRefundable={booking.paidAmount} />
                            )}
                        </div>
                        {userRole === 'ADMIN' && booking.status === 'NEW' && (
                            <div className="mt-2 text-center">
                                <FinalizePricingModal bookingId={String(booking._id)} currentTotalCost={booking.totalCost || 0} />
                            </div>
                        )}
                    </div>

                    {/* Staff Assignment */}
                    {(userRole === 'ADMIN' || userRole === 'STAFF') && (
                        <BookingWhatsAppCard bookingId={String(booking._id)} />
                    )}

                    {/* Assigned Staff */}
                    <div className="rounded-3xl p-6 bg-gradient-to-br from-[#111A16] to-[#0A100D] border border-white/[0.05] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
                        <h3 className="text-sm font-display font-semibold text-antique-gold uppercase tracking-wider mb-4 relative z-10">Assigned Staff</h3>
                        {booking.assignedStaffId ? (
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center text-sm font-bold text-blue-300 ring-2 ring-blue-500/20">
                                    {booking.assignedStaffId.name?.[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-off-white">{booking.assignedStaffId.name}</p>
                                    <p className="text-xs text-white/40">{booking.assignedStaffId.email}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-white/30 italic relative z-10">Not assigned</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
