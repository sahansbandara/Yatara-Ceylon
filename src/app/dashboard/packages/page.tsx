import { Button } from '@/components/ui/button';
import PackageTable from '@/components/dashboard/PackageTable';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';
import { Plus } from 'lucide-react';
import Link from 'next/link';

async function getPackages() {
    try {
        await connectDB();
        const packages = await Package.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(packages));
    } catch (error) {
        console.error("Failed to fetch packages:", error);
        return [];
    }
}

export default async function PackagesPage() {
    const packages = await getPackages();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white drop-shadow-sm tracking-tight">Packages</h1>
                    <p className="text-sm text-white/50 mt-1 font-light">Manage tour packages, pricing, and availability.</p>
                </div>
                <Link href="/dashboard/packages/new">
                    <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0a1f15] font-semibold text-xs tracking-widest rounded-xl transition-all hover:scale-105">
                        <Plus className="mr-2 h-4 w-4" /> Add Package
                    </Button>
                </Link>
            </div>

            <div className="liquid-glass-stat-dark rounded-2xl p-1 shadow-2xl">
                <PackageTable initialPackages={packages} />
            </div>
        </div>
    );
}
