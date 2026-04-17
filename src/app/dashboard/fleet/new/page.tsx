import VehicleForm from '@/components/dashboard/VehicleForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Add Vehicle | Fleet',
};

export default function AddFleetVehiclePage() {
    return (
        <div className="flex flex-col gap-6 text-slate-800">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/fleet">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-white drop-shadow-sm">Add New Vehicle</h1>
                    <p className="text-sm text-white/50 font-light mt-1">Submit a new vehicle for approval.</p>
                </div>
            </div>

            <VehicleForm redirectPath="/dashboard/fleet" hideStatus={true} />
        </div>
    );
}
