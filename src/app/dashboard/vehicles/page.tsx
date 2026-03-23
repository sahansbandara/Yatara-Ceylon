import VehicleTable from '@/components/dashboard/VehicleTable';
import { Button } from '@/components/ui/button';
import { Plus, Car, CheckCircle, Clock, AlertTriangle, LayoutGrid, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { StatCard } from '@/components/dashboard/StatCard';
import { GlassPanel } from '@/components/dashboard/GlassPanel';
import { VehicleStatus } from '@/lib/constants';

async function getVehicleStats() {
    try {
        await connectDB();
        const vehicles = await Vehicle.find({ isDeleted: false }).lean();
        const serialized = JSON.parse(JSON.stringify(vehicles));

        return {
            vehicles: serialized,
            stats: {
                total: serialized.length,
                available: serialized.filter((v: any) => v.status === VehicleStatus.AVAILABLE).length,
                unavailable: serialized.filter((v: any) => v.status !== VehicleStatus.AVAILABLE && v.status !== VehicleStatus.PENDING_APPROVAL).length,
                pendingApproval: serialized.filter((v: any) => v.status === VehicleStatus.PENDING_APPROVAL).length,
            }
        };
    } catch (error) {
        console.error("Failed to fetch vehicles:", error);
        return {
            vehicles: [],
            stats: { total: 0, available: 0, unavailable: 0, pendingApproval: 0 }
        };
    }
}

export default async function VehiclesPage() {
    const { vehicles, stats } = await getVehicleStats();

    return (
        <div className="flex flex-col gap-6 p-6">
            <DashboardHero
                title="Fleet Management"
                subtitle="Manage vehicles, availability, and pricing."
                action={
                    <Link href="/dashboard/vehicles/new">
                        <Button className="bg-antique-gold hover:bg-antique-gold/90 text-deep-emerald font-semibold">
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
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-antique-gold/10 border border-antique-gold/20 text-antique-gold font-medium text-sm hover:bg-antique-gold/20 transition-colors">
                    <LayoutGrid className="w-4 h-4" />
                    Table View
                </button>
                <Link href="/dashboard/vehicles/calendar">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 font-medium text-sm hover:bg-white/10 transition-colors">
                        <CalendarDays className="w-4 h-4" />
                        Calendar View
                    </button>
                </Link>
            </div>

            {/* Table */}
            <GlassPanel>
                <VehicleTable initialVehicles={vehicles} />
            </GlassPanel>
        </div>
    );
}
