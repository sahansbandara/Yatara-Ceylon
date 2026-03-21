import connectDB from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";
import VehicleBlock from "@/models/VehicleBlock";
import Booking from "@/models/Booking";
import { Car, Calendar, AlertTriangle, CheckCircle, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { StatCard } from "@/components/dashboard/StatCard";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EmptyStateCard } from "@/components/dashboard/EmptyStateCard";
import FleetCalendar from "@/components/dashboard/fleet/FleetCalendar";
import VehicleBlockManager from "@/components/dashboard/VehicleBlockManager";

const STATUS_COLORS: Record<string, { pill: string; label: string }> = {
    AVAILABLE: { pill: 'status-pill-success', label: 'Available' },
    MAINTENANCE: { pill: 'status-pill-warning', label: 'Maintenance' },
    UNAVAILABLE: { pill: 'status-pill-danger', label: 'Unavailable' },
};

import { getSessionUser } from "@/lib/auth";

async function getFleetData(userId: string) {
    try {
        await connectDB();
        const vehicles = await Vehicle.find({ ownerId: userId, isDeleted: false }).lean();
        const vehicleIds = vehicles.map(v => v._id);

        const [blocks, assignedBookings] = await Promise.all([
            VehicleBlock.find({
                vehicleId: { $in: vehicleIds },
                to: { $gte: new Date() },
            }).lean(),
            Booking.find({
                assignedVehicleId: { $in: vehicleIds },
                isDeleted: false,
                status: { $in: ['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS'] },
            }).select('bookingNo customerName dates assignedVehicleId status').lean(),
        ]);
        return {
            vehicles: JSON.parse(JSON.stringify(vehicles)),
            blocks: JSON.parse(JSON.stringify(blocks)),
            assignedBookings: JSON.parse(JSON.stringify(assignedBookings)),
        };
    } catch {
        return { vehicles: [], blocks: [], assignedBookings: [] };
    }
}

export default async function FleetDashboardPage() {
    const session = await getSessionUser();
    if (!session?.userId) return null;

    const { vehicles, blocks, assignedBookings } = await getFleetData(session.userId);

    const addVehicleBtn = (
        <Link href="/dashboard/fleet/new">
            <Button className="bg-antique-gold hover:bg-antique-gold/90 text-[#0a1f15] font-semibold tracking-wider text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Add Vehicle
            </Button>
        </Link>
    );

    return (
        <div className="flex flex-col gap-6">
            <DashboardHero
                title="Fleet Dashboard"
                subtitle="Manage your vehicles, availability, and assignments"
                badge="Fleet Partner"
                action={addVehicleBtn}
            />

            {/* KPI Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Total Vehicles"
                    value={vehicles.length.toString()}
                    icon={Car}
                    accentColor="text-violet-400"
                />
                <StatCard
                    title="Active Assignments"
                    value={assignedBookings.length.toString()}
                    icon={Calendar}
                    accentColor="text-blue-400"
                />
                <StatCard
                    title="Blocked Periods"
                    value={blocks.length.toString()}
                    icon={AlertTriangle}
                    accentColor="text-amber-400"
                />
            </div>

            {/* Calendar Integration */}
            <FleetCalendar vehicles={vehicles} blocks={blocks} assignedBookings={assignedBookings} />

            {/* Two Column Layout for Lists */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Vehicles List */}
                <GlassPanel title="Vehicles">
                    {vehicles.length > 0 ? (
                        <div className="space-y-2">
                            {vehicles.map((v: any) => {
                                const status = STATUS_COLORS[v.status] || STATUS_COLORS.AVAILABLE;
                                const vehicleBlocks = blocks.filter((b: any) => b.vehicleId === v._id);
                                const vehicleBookings = assignedBookings.filter((b: any) => b.assignedVehicleId === v._id);

                                return (
                                    <div key={v._id} className="flex flex-col gap-4 px-4 py-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all duration-300">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                                                <Car className="h-4 w-4 text-violet-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-white/85">{v.model}</p>
                                                        <p className="text-[11px] text-white/40 mt-0.5">
                                                            {v.type} · {v.seats} seats · LKR {v.dailyRate} per km
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span className={`status-pill ${status.pill} text-[10px] uppercase font-bold tracking-wider py-0.5 px-2`}>
                                                            {status.label}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
                                                            {vehicleBookings.length > 0 && (
                                                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] rounded px-1.5">
                                                                    {vehicleBookings.length} trip{vehicleBookings.length > 1 ? 's' : ''}
                                                                </span>
                                                            )}
                                                            {vehicleBlocks.length > 0 && (
                                                                <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] rounded px-1.5">
                                                                    {vehicleBlocks.length} blocked
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-white/[0.06]">
                                            <VehicleBlockManager vehicleId={v._id} initialBlocks={vehicleBlocks} hideTitle={true} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyStateCard
                            icon={Car}
                            title="No vehicles registered"
                            description="Add your first vehicle to start receiving trip assignments and manage your fleet availability."
                            actionLabel="Add Vehicle"
                            actionHref="/dashboard/fleet/new"
                        />
                    )}
                </GlassPanel>

                {/* Active Assignments */}
                {assignedBookings.length > 0 && (
                    <GlassPanel title="Active Assignments">
                        <div className="space-y-2">
                            {assignedBookings.map((b: any) => (
                                <div key={b._id} className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all duration-300">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white/85">{b.bookingNo}</p>
                                        <p className="text-[11px] text-white/40 mt-0.5">
                                            {b.customerName} · {new Date(b.dates?.from).toLocaleDateString()} → {new Date(b.dates?.to).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="status-pill status-pill-success flex-shrink-0">
                                        {b.status?.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </GlassPanel>
                )}
            </div>
        </div>
    );
}
