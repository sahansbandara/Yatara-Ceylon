import connectDB from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";
import VehicleBlock from "@/models/VehicleBlock";
import Booking from "@/models/Booking";
import { Car, CheckCircle, Clock, AlertTriangle, LayoutGrid, CalendarDays, Plus } from "lucide-react";
import Link from "next/link";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { StatCard } from "@/components/dashboard/StatCard";
import FleetCalendar from "@/components/dashboard/fleet/FleetCalendar";
import { VehicleStatus } from "@/lib/constants";
import { Button } from "@/components/ui/button";

async function getAdminFleetData() {
    try {
        await connectDB();
        
        // Match what vehicles/page.tsx gets for stats
        const vehicles = await Vehicle.find({ isDeleted: false }).lean();
        
        // Find blocks and bookings for these active vehicles
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

        const serializedVehicles = JSON.parse(JSON.stringify(vehicles));

        return {
            vehicles: serializedVehicles,
            blocks: JSON.parse(JSON.stringify(blocks)),
            assignedBookings: JSON.parse(JSON.stringify(assignedBookings)),
            stats: {
                total: serializedVehicles.length,
                available: serializedVehicles.filter((v: any) => v.status === VehicleStatus.AVAILABLE).length,
                unavailable: serializedVehicles.filter((v: any) => v.status !== VehicleStatus.AVAILABLE && v.status !== VehicleStatus.PENDING_APPROVAL).length,
                pendingApproval: serializedVehicles.filter((v: any) => v.status === VehicleStatus.PENDING_APPROVAL).length,
            }
        };
    } catch (error) {
        console.error("Failed to fetch admin fleet data:", error);
        return { 
            vehicles: [], 
            blocks: [], 
            assignedBookings: [],
            stats: { total: 0, available: 0, unavailable: 0, pendingApproval: 0 }
        };
    }
}

export default async function AdminVehicleCalendarPage() {
    const { vehicles, blocks, assignedBookings, stats } = await getAdminFleetData();

    return (
        <div className="flex flex-col gap-6 p-6">
            <DashboardHero
                title="Fleet Management"
                subtitle="Manage vehicles, availability, and pricing."
                action={
                    <Link href="/dashboard/vehicles/new">
                        <Button variant="glass-outline" className="text-antique-gold font-semibold">
                            <Plus className="mr-2 h-4 w-4" /> Add Vehicle
                        </Button>
                    </Link>
                }
            />

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Vehicles"
                    value={String(stats.total)}
                    icon={Car}
                    accentColor="text-blue-400"
                />
                <StatCard
                    title="Available"
                    value={String(stats.available)}
                    icon={CheckCircle}
                    accentColor="text-emerald-400"
                />
                <StatCard
                    title="On Assignment"
                    value={String(stats.unavailable)}
                    icon={Clock}
                    accentColor="text-amber-400"
                />
                <StatCard
                    title="Pending Approval"
                    value={String(stats.pendingApproval)}
                    icon={AlertTriangle}
                    accentColor="text-orange-400"
                />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
                <Link href="/dashboard/vehicles">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 font-medium text-sm hover:bg-white/10 transition-colors">
                        <LayoutGrid className="w-4 h-4" />
                        Table View
                    </button>
                </Link>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-antique-gold/10 border border-antique-gold/20 text-antique-gold font-medium text-sm hover:bg-antique-gold/20 transition-colors">
                    <CalendarDays className="w-4 h-4" />
                    Calendar View
                </button>
            </div>

            {/* Calendar */}
            <FleetCalendar vehicles={vehicles} blocks={blocks} assignedBookings={assignedBookings} />
        </div>
    );
}
