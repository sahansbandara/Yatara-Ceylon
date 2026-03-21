import connectDB from "@/lib/mongodb";
import Partner from "@/models/Partner";
import PartnerService from "@/models/PartnerService";
import PartnerServiceBlock from "@/models/PartnerServiceBlock";
import { Building2, DollarSign, Plus, Layers, Tag } from "lucide-react";
import ServiceBlockManager from "@/components/dashboard/ServiceBlockManager";
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

        const [services, blocks] = await Promise.all([
            PartnerService.find({ partnerId: { $in: partnerIds } }).populate('partnerId', 'name type').lean(),
            PartnerServiceBlock.find({
                // To fetch only relevant blocks, we need serviceIds
            }).lean()
        ]);

        // Let's optimize blocks map
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
            <Button className="bg-antique-gold hover:bg-antique-gold/90 text-[#0a1f15] font-semibold tracking-wider text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Add Property
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
            <div className="grid gap-4 grid-cols-2">
                <StatCard
                    title="Properties"
                    value={partners.length.toString()}
                    icon={Building2}
                    accentColor="text-teal-400"
                />
                <StatCard
                    title="Services"
                    value={services.length.toString()}
                    icon={Layers}
                    accentColor="text-violet-400"
                />
            </div>

            {/* Properties */}
            <GlassPanel title="Properties">
                {partners.length > 0 ? (
                    <div className="space-y-2">
                        {partners.map((p: any) => (
                            <div key={p._id} className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all duration-300">
                                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                                    <Building2 className="h-4 w-4 text-teal-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white/85">{p.name}</p>
                                    <p className="text-[11px] text-white/40 mt-0.5">
                                        {p.contact?.email} · {p.contact?.phone}
                                    </p>
                                </div>
                                <span className="status-pill status-pill-success flex-shrink-0">Active</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyStateCard
                        icon={Building2}
                        title="No properties added yet"
                        description="Create your first property profile to start receiving booking assignments and rate card requests."
                        actionLabel="Add Property"
                        actionHref="/dashboard/hotel/new"
                    />
                )}
            </GlassPanel>

            {/* Services & Rates */}
            <GlassPanel title="Services & Rates">
                {services.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                        {services.map((s: any) => {
                            const serviceBlocks = blocks.filter((b: any) => b.serviceId === s._id);
                            return (
                                <div key={s._id} className="px-4 py-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-3.5 w-3.5 text-white/30" />
                                            <p className="text-sm font-medium text-white/85">{s.name}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-antique-gold/10 px-2.5 py-1 rounded-lg border border-antique-gold/20">
                                            <DollarSign className="h-3 w-3 text-antique-gold" />
                                            <span className="text-sm font-bold text-antique-gold">{s.rate}</span>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-white/40 mb-4">
                                        {s.unit} · {(s.partnerId as any)?.name || 'Partner'}
                                    </p>

                                    <div className="pt-4 border-t border-white/[0.06]">
                                        <ServiceBlockManager serviceId={s._id} initialBlocks={serviceBlocks} hideTitle={true} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyStateCard
                        icon={Layers}
                        title="No services configured"
                        description="Set up your service offerings and rate cards to attract booking assignments."
                    />
                )}
            </GlassPanel>
        </div>
    );
}
