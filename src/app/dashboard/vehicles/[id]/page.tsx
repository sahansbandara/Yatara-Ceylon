import VehicleForm from '@/components/dashboard/VehicleForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { VehicleDetailService } from '@/services/crud.service';
import { Metadata } from 'next';
import VehicleBlockManager from '@/components/dashboard/VehicleBlockManager';

export const metadata: Metadata = {
    title: 'Edit Vehicle | Dashboard',
};

// Params type definition for Next.js 15+
type Params = Promise<{ id: string }>;

export default async function EditVehiclePage({ params }: { params: Params }) {
    const { id } = await params;
    const data = await VehicleDetailService.getVehicleById(id);

    if (!data) {
        notFound();
    }

    const { vehicle, blocks } = data;

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
                    <p className="text-muted-foreground">Update vehicle details and availability blocks.</p>
                </div>
            </div>

            <VehicleForm initialData={vehicle} isEdit={true} />

            <VehicleBlockManager vehicleId={vehicle._id} initialBlocks={blocks} />
        </div>
    );
}
