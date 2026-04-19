import PartnerForm from '@/components/dashboard/PartnerForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { PartnerDetailService } from '@/services/crud.service';
import { getSessionUser } from '@/lib/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit Property | Hotel Dashboard',
};

type Params = Promise<{ id: string }>;

export default async function EditHotelPropertyPage({ params }: { params: Params }) {
    const session = await getSessionUser();
    if (!session?.userId) redirect('/login');

    const { id } = await params;
    const partner = await PartnerDetailService.getPartnerById(id);

    if (!partner || partner.ownerId?.toString() !== session.userId) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6 text-slate-800">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/hotel">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-white drop-shadow-sm">Edit Property</h1>
                    <p className="text-sm text-white/50 font-light mt-1">Update property information.</p>
                </div>
            </div>

            <PartnerForm initialData={partner} isEdit={true} redirectPath="/dashboard/hotel" hideStatus={true} fixedType="HOTEL" />
        </div>
    );
}
