import { Button } from '@/components/ui/button';
import DestinationTable from '@/components/dashboard/DestinationTable';
import { DestinationService } from '@/services/crud.service';
import { Plus, MapPin, Eye, ImageOff, Globe, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { StatCard } from '@/components/dashboard/StatCard';
import { GlassPanel } from '@/components/dashboard/GlassPanel';

export default async function DestinationsPage() {
    const destinations = await DestinationService.getDestinations();

    const totalDestinations = destinations.length;
    const publishedCount = destinations.filter((d: any) => d.isPublished).length;
    const withImagesCount = destinations.filter((d: any) => d.heroImage || (d.images && d.images.length > 0) || (d.gallery && d.gallery.length > 0)).length;
    const missingImagesCount = destinations.filter((d: any) => !d.heroImage && (!d.images || d.images.length === 0) && (!d.gallery || d.gallery.length === 0)).length;

    return (
        <div className="flex flex-col gap-6">
            <DashboardHero
                title="Destinations"
                subtitle="Manage travel destinations and their details."
                action={
                    <Link href="/dashboard/destinations/new">
                        <Button variant="glass">
                            <Plus className="mr-2 h-4 w-4" /> Add Destination
                        </Button>
                    </Link>
                }
            />

            {/* KPI Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Destinations"
                    value={totalDestinations.toString()}
                    icon={MapPin}
                    accentColor="text-emerald-400"
                />
                <StatCard
                    title="Published"
                    value={publishedCount.toString()}
                    icon={Eye}
                    accentColor="text-blue-400"
                    trend={{ value: `${((publishedCount / totalDestinations) * 100).toFixed(0)}%`, positive: true }}
                />
                <StatCard
                    title="With Images"
                    value={withImagesCount.toString()}
                    icon={Globe}
                    accentColor="text-purple-400"
                    trend={{ value: `${((withImagesCount / totalDestinations) * 100).toFixed(0)}% complete`, positive: true }}
                />
                <StatCard
                    title="Missing Images"
                    value={missingImagesCount.toString()}
                    icon={ImageOff}
                    accentColor="text-red-400"
                    trend={{ value: missingImagesCount > 0 ? 'attention needed' : 'all set', positive: missingImagesCount === 0 }}
                />
            </div>

            {/* Data Quality Alert */}
            {missingImagesCount > 0 && (
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    <p className="text-xs text-amber-300">{missingImagesCount} destination(s) missing hero image or gallery. Add images to improve presentation.</p>
                </div>
            )}

            {/* Destinations Table */}
            <GlassPanel title="All Destinations" noPadding>
                <DestinationTable initialDestinations={destinations} />
            </GlassPanel>
        </div>
    );
}
