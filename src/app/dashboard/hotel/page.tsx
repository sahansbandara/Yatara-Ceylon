import connectDB from "@/lib/mongodb";
import Partner from "@/models/Partner";
import PartnerService from "@/models/PartnerService";
import PartnerServiceBlock from "@/models/PartnerServiceBlock";
import { Building2, Layers, Plus, CalendarDays, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import HotelServicesManager from "@/components/dashboard/HotelServicesManager";
import { PropertyOverviewCard } from "@/components/dashboard/PropertyOverviewCard";
import { HotelKPIs } from "@/components/dashboard/HotelKPIs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EmptyStateCard } from "@/components/dashboard/EmptyStateCard";
import { getSessionUser } from "@/lib/auth";
import { formatLKR } from "@/lib/currency";
import { BookingStatus } from "@/lib/constants";
import Booking from "@/models/Booking";

async function getHotelData(userId: string) {
    try {
        await connectDB();
        const partners = await Partner.find({ ownerId: userId, type: 'HOTEL', status: 'ACTIVE' }).lean();
        const partnerIds = partners.map((p: any) => p._id);

        const services = await PartnerService.find({
            partnerId: { $in: partnerIds },
            isDeleted: false,
        }).populate('partnerId', 'name type').lean();

        const serviceIds = services.map((s: any) => s._id);
        const now = new Date();

        const [blocks, recentBookings] = await Promise.all([
            PartnerServiceBlock.find({ serviceId: { $in: serviceIds } }).lean(),
            // Recent bookings that reference these partners (via package or custom linked bookings)
            // Fallback: show all active bookings for context
            Booking.find({
                status: { $in: [BookingStatus.CONFIRMED, BookingStatus.ADVANCE_PAID, BookingStatus.IN_PROGRESS, BookingStatus.ASSIGNED] },
                isDeleted: false,
                'dates.from': { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
            })
                .sort({ 'dates.from': 1 })
                .limit(5)
                .lean(),
        ]);

        // Compute KPI values
        const activeServices = services.filter((s: any) => s.isActive !== false).length;
        const now_str = now.toISOString();
        const activeBlocks = blocks.filter((b: any) => b.to >= now_str).length;
        const totalRevenuePotential = services.reduce((sum: number, s: any) => sum + (s.rate || s.price || 0), 0);
        const occupancyRate = services.length > 0
            ? Math.round((activeServices / services.length) * 100)
            : 0;

        return {
            partners: JSON.parse(JSON.stringify(partners)),
            services: JSON.parse(JSON.stringify(services)),
            blocks: JSON.parse(JSON.stringify(blocks)),
            recentBookings: JSON.parse(JSON.stringify(recentBookings)),
            kpis: {
                totalServices: services.length,
                activeServices,
                totalBlocks: blocks.length,
                activeBlocks,
                totalRevenuePotential,
                occupancyRate,
            },
        };
    } catch {
        return {
            partners: [],
            services: [],
            blocks: [],
            recentBookings: [],
            kpis: { totalServices: 0, activeServices: 0, totalBlocks: 0, activeBlocks: 0, totalRevenuePotential: 0, occupancyRate: 0 },
        };
    }
}

const BOOKING_STATUS_META: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
    CONFIRMED: { label: 'Confirmed', color: 'text-emerald-400', icon: CheckCircle },
    ADVANCE_PAID: { label: 'Advance Paid', color: 'text-blue-400', icon: CheckCircle },
    IN_PROGRESS: { label: 'In Progress', color: 'text-amber-400', icon: Clock },
    ASSIGNED: { label: 'Assigned', color: 'text-violet-400', icon: CalendarDays },
};

export default async function HotelDashboardPage() {
    const session = await getSessionUser();
    if (!session?.userId) return null;

    const { partners, services, blocks, recentBookings, kpis } = await getHotelData(session.userId);

    const addPropertyBtn = (
        <Link href="/dashboard/hotel/new">
            <Button variant="glass">
                <Plus className="h-4 w-4 mr-1" />
                Add Hotel
            </Button>
        </Link>
    );

    return (
        <div className="flex flex-col gap-8">
            {/* ── Hero ──────────────────────────────────── */}
            <DashboardHero
                title="Hotel Dashboard"
                subtitle="Manage your property details, services, and availability"
                badge="Hotel Partner"
                action={addPropertyBtn}
            />

            {/* ── KPI Cards ─────────────────────────────── */}
            <HotelKPIs
                totalServices={kpis.totalServices}
                activeServices={kpis.activeServices}
                totalBlocks={kpis.totalBlocks}
                activeBlocks={kpis.activeBlocks}
                totalRevenuePotential={kpis.totalRevenuePotential}
                occupancyRate={kpis.occupancyRate}
            />

            {/* ── Properties ───────────────────────────── */}
            <div className="space-y-4">
                {partners.length > 0 ? (
                    <div className="grid gap-5 grid-cols-1">
                        {partners.map((p: any) => (
                            <PropertyOverviewCard
                                key={p._id}
                                partner={p}
                                editHref={`/dashboard/hotel/${p._id}/edit`}
                                manageHref={`/dashboard/hotel/${p._id}/availability`}
                                viewHref={`/dashboard/hotel/${p._id}`}
                            />
                        ))}
                    </div>
                ) : (
                    <GlassPanel title="Properties">
                        <EmptyStateCard
                            icon={Building2}
                            title="No properties added yet"
                            description="Create your first property profile to start receiving booking assignments and rate card requests."
                            actionLabel="Add Property"
                            actionHref="/dashboard/hotel/new"
                        />
                    </GlassPanel>
                )}
            </div>

            {/* ── Active Assignments ───────────────────── */}
            <GlassPanel
                title="Active Assignments"
                subtitle="Upcoming & in-progress bookings referencing hotel services"
                actionLabel="All Bookings"
                actionHref="/dashboard/bookings"
            >
                {recentBookings.length > 0 ? (
                    <div className="space-y-2">
                        {recentBookings.map((booking: any) => {
                            const meta = BOOKING_STATUS_META[booking.status] || {
                                label: booking.status,
                                color: 'text-white/60',
                                icon: AlertTriangle,
                            };
                            const StatusIcon = meta.icon;
                            const fromDate = new Date(booking.dates.from);
                            const toDate = new Date(booking.dates.to);
                            const nights = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));

                            return (
                                <Link
                                    key={booking._id}
                                    href={`/dashboard/bookings/${booking._id}`}
                                    className="group flex items-center gap-4 px-4 py-3 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.10] transition-all"
                                >
                                    {/* Status dot */}
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/[0.04]`}>
                                        <StatusIcon className={`h-4 w-4 ${meta.color}`} />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-white truncate">{booking.customerName}</p>
                                            <span className={`hidden sm:inline-flex text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${meta.color} border-current/20 bg-current/5`}>
                                                {meta.label}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-white/45 mt-0.5">
                                            {fromDate.toLocaleDateString('en-LK', { month: 'short', day: 'numeric' })}
                                            {' – '}
                                            {toDate.toLocaleDateString('en-LK', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            {' · '}{nights} night{nights !== 1 ? 's' : ''}
                                            {' · '}{booking.pax} pax
                                        </p>
                                    </div>

                                    {/* Revenue + booking no */}
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-bold text-antique-gold">{formatLKR(booking.totalCost)}</p>
                                        <p className="text-[10px] text-white/30 mt-0.5">{booking.bookingNo}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 py-8 text-center">
                        <CalendarDays className="h-8 w-8 text-white/10 mb-1" />
                        <p className="text-sm text-white/40 font-medium">No active assignments right now</p>
                        <p className="text-xs text-white/25">Active bookings will appear here as they are confirmed.</p>
                    </div>
                )}
            </GlassPanel>

            {/* ── Services & Rates ─────────────────────── */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Services &amp; Rates</h2>
                        <p className="text-sm text-white/45 mt-0.5">
                            Manage your service offerings, pricing in LKR, and availability blocks
                        </p>
                    </div>
                    {services.length > 0 && (
                        <Link href="/dashboard/hotel/services/new">
                            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-antique-gold/10 border border-antique-gold/25 text-antique-gold text-xs font-semibold uppercase tracking-wider hover:bg-antique-gold/15 transition-all">
                                <Plus className="h-3.5 w-3.5" />
                                Add Service
                            </button>
                        </Link>
                    )}
                </div>

                {services.length > 0 ? (
                    <HotelServicesManager initialServices={services as any} initialBlocks={blocks as any} />
                ) : (
                    <GlassPanel title="">
                        <EmptyStateCard
                            icon={Layers}
                            title="No services configured"
                            description="Set up your service offerings and rate cards (in LKR) to attract booking assignments."
                            actionLabel="Add First Service"
                            actionHref="/dashboard/hotel/services/new"
                        />
                    </GlassPanel>
                )}
            </div>
        </div>
    );
}
