import { FleetCalendarService } from '@/services/crud.service';
import { Car, CheckCircle, Clock, AlertTriangle, LayoutGrid, CalendarDays, Plus } from "lucide-react";
import Link from "next/link";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { StatCard } from "@/components/dashboard/StatCard";
import FleetCalendar from "@/components/dashboard/fleet/FleetCalendar";
import { Button } from "@/components/ui/button";

export default async function AdminVehicleCalendarPage() {
    const { vehicles, blocks, assignedBookings, stats } = await FleetCalendarService.getAdminFleetData();

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
