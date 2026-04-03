import PartnerTable from '@/components/dashboard/PartnerTable';
import { Button } from '@/components/ui/button';
import { Plus, Handshake, UserCheck, Building2, Users } from 'lucide-react';
import Link from 'next/link';
import { PartnerService } from '@/services/crud.service';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { StatCard } from '@/components/dashboard/StatCard';
import { GlassPanel } from '@/components/dashboard/GlassPanel';

export default async function PartnersPage() {
    const { partners, stats } = await PartnerService.getPartnerStats();

    return (
        <div className="flex flex-col gap-6 p-6">
            <DashboardHero
                title="Partner Network"
                subtitle="Manage guides, hotels, drivers, and other service partners."
                action={
                    <Link href="/dashboard/partners/new">
                        <Button variant="glass">
                            <Plus className="mr-2 h-4 w-4" /> Add Partner
                        </Button>
                    </Link>
                }
            />

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Partners"
                    value={String(stats.total)}
                    icon={Handshake}
                    accentColor="text-blue-400"
                />
                <StatCard
                    title="Active Partners"
                    value={String(stats.active)}
                    icon={UserCheck}
                    accentColor="text-emerald-400"
                />
                <StatCard
                    title={`Top Type (${stats.topType})`}
                    value={String(stats.topTypeCount)}
                    icon={Building2}
                    accentColor="text-amber-400"
                />
                <StatCard
                    title="Pending Review"
                    value={String(stats.pendingReview)}
                    icon={Users}
                    accentColor="text-orange-400"
                />
            </div>

            {/* Partner Type Tabs */}
            <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-antique-gold/10 border border-antique-gold/20 text-antique-gold font-medium text-sm hover:bg-antique-gold/20 transition-colors">
                    All Partners
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 font-medium text-sm hover:bg-white/10 transition-colors cursor-not-allowed opacity-50">
                    Guides
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 font-medium text-sm hover:bg-white/10 transition-colors cursor-not-allowed opacity-50">
                    Hotels
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 font-medium text-sm hover:bg-white/10 transition-colors cursor-not-allowed opacity-50">
                    Drivers
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 font-medium text-sm hover:bg-white/10 transition-colors cursor-not-allowed opacity-50">
                    Restaurants
                </button>
            </div>

            {/* Table */}
            <GlassPanel>
                <PartnerTable initialPartners={partners} />
            </GlassPanel>
        </div>
    );
}
