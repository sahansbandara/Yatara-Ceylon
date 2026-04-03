import { Button } from '@/components/ui/button';
import PackageTable from '@/components/dashboard/PackageTable';
import { PackageService } from '@/services/package.service';
import { Plus, Package as PackageIcon, Eye, FileText, Star, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { StatCard } from '@/components/dashboard/StatCard';
import { GlassPanel } from '@/components/dashboard/GlassPanel';

export default async function PackagesPage() {
    const packages = await PackageService.getDashboardPackages();

    const totalPackages = packages.length;
    const publishedCount = packages.filter((p: any) => p.isPublished).length;
    const draftCount = packages.filter((p: any) => !p.isPublished).length;
    const featuredCount = packages.filter((p: any) => p.isFeatured).length;
    const zeroPriceCount = packages.filter((p: any) => !p.price || p.price === 0).length;

    return (
        <div className="flex flex-col gap-6">
            <DashboardHero
                title="Packages"
                subtitle="Manage tour packages, pricing, and availability."
                action={
                    <Link href="/dashboard/packages/new">
                        <Button variant="glass">
                            <Plus className="mr-2 h-4 w-4" /> Add Package
                        </Button>
                    </Link>
                }
            />

            {/* KPI Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Packages"
                    value={totalPackages.toString()}
                    icon={PackageIcon}
                    accentColor="text-blue-400"
                />
                <StatCard
                    title="Published"
                    value={publishedCount.toString()}
                    icon={Eye}
                    accentColor="text-emerald-400"
                    trend={{ value: `${((publishedCount / totalPackages) * 100).toFixed(0)}%`, positive: true }}
                />
                <StatCard
                    title="Drafts"
                    value={draftCount.toString()}
                    icon={FileText}
                    accentColor="text-amber-400"
                    trend={{ value: publishedCount > 0 ? 'pending' : 'all pending', positive: false }}
                />
                <StatCard
                    title="Featured"
                    value={featuredCount.toString()}
                    icon={Star}
                    accentColor="text-yellow-400"
                />
            </div>

            {/* Data Quality Alert */}
            {zeroPriceCount > 0 && (
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    <p className="text-xs text-amber-300">{zeroPriceCount} package(s) have missing or zero pricing. Fix before publishing.</p>
                </div>
            )}

            {/* Packages Table */}
            <GlassPanel title="All Packages" noPadding>
                <PackageTable initialPackages={packages} />
            </GlassPanel>
        </div>
    );
}
