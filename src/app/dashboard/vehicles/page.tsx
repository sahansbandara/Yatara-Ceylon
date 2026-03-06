import VehicleTable from '@/components/dashboard/VehicleTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { GlassPanel } from '@/components/dashboard/GlassPanel';

async function getVehicles() {
    try {
        await connectDB();
        const vehicles = await Vehicle.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(vehicles));
    } catch (error) {
        console.error("Failed to fetch vehicles:", error);
        return [];
    }
}

export default async function VehiclesPage() {
    const vehicles = await getVehicles();

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

            <GlassPanel>
                <VehicleTable initialVehicles={vehicles} />
            </GlassPanel>
        </div>
    );
}
