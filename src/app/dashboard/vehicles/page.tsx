import VehicleTable from '@/components/dashboard/VehicleTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
                    <p className="text-muted-foreground">Manage vehicles, availability, and pricing.</p>
                </div>
                <Link href="/dashboard/vehicles/new">
                    <Button className="bg-ocean-600 hover:bg-ocean-700">
                        <Plus className="mr-2 h-4 w-4" /> Add Vehicle
                    </Button>
                </Link>
            </div>

            <VehicleTable initialVehicles={vehicles} />
        </div>
    );
}
