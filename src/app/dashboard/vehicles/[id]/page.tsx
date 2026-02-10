import VehicleForm from '@/components/dashboard/VehicleForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit Vehicle | Dashboard',
};

async function getVehicle(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
    try {
        await connectDB();
        const vehicle = await Vehicle.findById(id).lean();
        if (!vehicle) return null;
        return JSON.parse(JSON.stringify(vehicle));
    } catch (error) {
        console.error("Failed to fetch vehicle:", error);
        return null;
    }
}

// Params type definition for Next.js 15+
type Params = Promise<{ id: string }>;

export default async function EditVehiclePage({ params }: { params: Params }) {
    const { id } = await params;
    const vehicle = await getVehicle(id);

    if (!vehicle) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/vehicles">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Vehicle</h1>
                    <p className="text-muted-foreground">Update vehicle details.</p>
                </div>
            </div>

            <VehicleForm initialData={vehicle} isEdit={true} />
        </div>
    );
}
