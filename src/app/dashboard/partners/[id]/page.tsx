import PartnerForm from '@/components/dashboard/PartnerForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PartnerDetailService } from '@/services/crud.service';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit Partner | Dashboard',
};

type Params = Promise<{ id: string }>;

export default async function EditPartnerPage({ params }: { params: Params }) {
    const { id } = await params;
    const partner = await PartnerDetailService.getPartnerById(id);

    if (!partner) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/partners">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Partner</h1>
                    <p className="text-muted-foreground">Update partner details.</p>
                </div>
            </div>

            <PartnerForm initialData={partner} isEdit={true} />
        </div>
    );
}
