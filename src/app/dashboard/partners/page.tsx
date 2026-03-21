import PartnerTable from '@/components/dashboard/PartnerTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Partner from '@/models/Partner';

async function getPartners() {
    try {
        await connectDB();
        const partners = await Partner.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(partners));
    } catch (error) {
        console.error("Failed to fetch partners:", error);
        return [];
    }
}

export default async function PartnersPage() {
    const partners = await getPartners();

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Partners</h1>
                    <p className="text-muted-foreground">Manage guides, hotels, drivers, and other partners.</p>
                </div>
                <Link href="/dashboard/partners/new">
                    <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0a1f15] font-semibold text-xs tracking-widest rounded-xl transition-all hover:scale-105">
                        <Plus className="mr-2 h-4 w-4" /> Add Partner
                    </Button>
                </Link>
            </div>

            <PartnerTable initialPartners={partners} />
        </div>
    );
}
