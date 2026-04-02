import connectDB from "@/lib/mongodb";
import Partner from "@/models/Partner";
import PartnerService from "@/models/PartnerService";
import PartnerServiceBlock from "@/models/PartnerServiceBlock";
import { Building2, Plus, Layers } from "lucide-react";
import HotelServicesManager from "@/components/dashboard/HotelServicesManager";
import { PropertyOverviewCard } from "@/components/dashboard/PropertyOverviewCard";
import { HotelKPIs } from "@/components/dashboard/HotelKPIs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { StatCard } from "@/components/dashboard/StatCard";
import { EmptyStateCard } from "@/components/dashboard/EmptyStateCard";
import { getSessionUser } from "@/lib/auth";

async function getHotelData(userId: string) {
    try {
        await connectDB();
        const partners = await Partner.find({ ownerId: userId, type: 'HOTEL', status: 'ACTIVE' }).lean();
        const partnerIds = partners.map(p => p._id);

        const [services] = await Promise.all([
            PartnerService.find({ partnerId: { $in: partnerIds }, isDeleted: false }).populate('partnerId', 'name type').lean(),
        ]);

        const serviceIds = services.map((s: any) => s._id);
        const filteredBlocks = await PartnerServiceBlock.find({ serviceId: { $in: serviceIds } }).lean();

        return {
            partners: JSON.parse(JSON.stringify(partners)),
            services: JSON.parse(JSON.stringify(services)),
            blocks: JSON.parse(JSON.stringify(filteredBlocks)),
        };
    } catch {
        return { partners: [], services: [], blocks: [] };
    }
}

export default async function HotelDashboardPage() {
    const session = await getSessionUser();
    if (!session?.userId) return null;

    const { partners, services, blocks } = await getHotelData(session.userId);

    const addPropertyBtn = (
        <Link href="/dashboard/hotel/new">
            <Button variant="glass">
              <Plus className="h-4 w-4 mr-1" />
              Add Hotel
            </Button>
        </Link>
    );

    return (
        <div className="flex flex-col gap-6">
            <DashboardHero
                title="Hotel Dashboard"
                subtitle="Manage your property details, services, and rates"
                badge="Hotel Partner"
                action={addPropertyBtn}
            />

            {/* KPI Cards */}
            <HotelKPIs 
                totalBookings={blocks.length * 4} // Mock data based on blocks length for now, or use real data if available
                bookingsChange={12}
                revenue={services.reduce((acc: number, s: any) => acc + (s.price || 0), 0) * 15}
                revenueChange={8.5}
                healthScore={85}
            />

            {/* Properties */}
            <div className="space-y-6">
                {partners.length > 0 ? (
                    <div className="grid gap-6 grid-cols-1">
                        {partners.map((p: any) => (
                            <PropertyOverviewCard 
                                key={p._id} 
                                partner={p} 
                                editHref={`/dashboard/hotel/${p._id}/edit`}
                                manageHref={`/dashboard/hotel/${p._id}/availability`}
                                viewHref={`/dashboard/hotel/${p._id}`}
                            />
                        ))}
                    </div>
                ) : (
                    <GlassPanel title="Properties">
                        <EmptyStateCard
                            icon={Building2}
                            title="No properties added yet"
                            description="Create your first property profile to start receiving booking assignments and rate card requests."
                            actionLabel="Add Property"
                            actionHref="/dashboard/hotel/new"
                        />
                    </GlassPanel>
                )}
            </div>

            {/* Services & Rates */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Services & Rates</h2>
                        <p className="text-sm text-white/50 mt-1">Manage your service offerings and configure rate cards</p>
                    </div>
                </div>
                {services.length > 0 ? (
                    <HotelServicesManager initialServices={services as any} initialBlocks={blocks as any} />
                ) : (
                    <GlassPanel title="Services & Rates">
                        <EmptyStateCard
                            icon={Layers}
                            title="No services configured"
                            description="Set up your service offerings and rate cards to attract booking assignments."
                        />
                    </GlassPanel>
                )}
            </div>
        </div>
    );
}
