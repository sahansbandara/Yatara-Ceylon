import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Layers } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { PartnerDetailService } from '@/services/crud.service';
import { getSessionUser } from '@/lib/auth';
import { Metadata } from 'next';
import connectDB from "@/lib/mongodb";
import PartnerService from "@/models/PartnerService";
import PartnerServiceBlock from "@/models/PartnerServiceBlock";
import HotelServicesManager from "@/components/dashboard/HotelServicesManager";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EmptyStateCard } from "@/components/dashboard/EmptyStateCard";

export const metadata: Metadata = {
    title: 'Manage Availability | Hotel Dashboard',
};

type Params = Promise<{ id: string }>;

export default async function ManageAvailabilityPage({ params }: { params: Params }) {
    const session = await getSessionUser();
    if (!session?.userId) redirect('/login');

    const { id } = await params;
    const partner = await PartnerDetailService.getPartnerById(id);

    if (!partner || partner.ownerId?.toString() !== session.userId) {
        notFound();
    }

    // Fetch services and blocks for this specific partner
    await connectDB();
    const services = await PartnerService.find({
        partnerId: id,
        isDeleted: false,
    }).populate('partnerId', 'name type').lean();

    const serviceIds = services.map((s: any) => s._id);
    const blocks = await PartnerServiceBlock.find({ serviceId: { $in: serviceIds } }).lean();

    const serializedServices = JSON.parse(JSON.stringify(services));
    const serializedBlocks = JSON.parse(JSON.stringify(blocks));

    return (
        <div className="flex flex-col gap-6 text-slate-800">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/hotel">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-display font-bold tracking-tight text-white drop-shadow-sm">Manage Availability</h1>
                        <p className="text-sm text-white/50 font-light mt-1 text-antique-gold">{partner.name}</p>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                {serializedServices.length > 0 ? (
                    <HotelServicesManager initialServices={serializedServices} initialBlocks={serializedBlocks} />
                ) : (
                    <GlassPanel title="">
                        <EmptyStateCard
                            icon={Layers}
                            title="No services configured"
                            description="Set up your service offerings and rate cards (in LKR) to attract booking assignments."
                            actionLabel="Add First Service"
                            actionHref={`/dashboard/hotel/services/new?partnerId=${id}`}
                        />
                    </GlassPanel>
                )}
            </div>
        </div>
    );
}
