import PartnerForm from '@/components/dashboard/PartnerForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Add Property | Hotel',
};

export default function AddHotelPartnerPage() {
    return (
        <div className="flex flex-col gap-6 text-slate-800">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/hotel">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-white drop-shadow-sm">Submit New Property</h1>
                    <p className="text-sm text-white/50 font-light mt-1">Submit your property for admin approval.</p>
                </div>
            </div>

            <PartnerForm redirectPath="/dashboard/hotel" hideStatus={true} fixedType="HOTEL" />
        </div>
    );
}
