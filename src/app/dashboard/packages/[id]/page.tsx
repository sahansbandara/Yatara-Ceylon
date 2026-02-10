import PackageForm from '@/components/dashboard/PackageForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit Package | Dashboard',
};

async function getPackage(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
    try {
        await connectDB();
        const pkg = await Package.findById(id).lean();
        if (!pkg) return null;
        return JSON.parse(JSON.stringify(pkg));
    } catch (error) {
        console.error("Failed to fetch package:", error);
        return null;
    }
}

// Params type definition for Next.js 15+
type Params = Promise<{ id: string }>;

export default async function EditPackagePage({ params }: { params: Params }) {
    const { id } = await params;
    const pkg = await getPackage(id);

    if (!pkg) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/packages">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Package</h1>
                    <p className="text-muted-foreground">Update package details and itinerary.</p>
                </div>
            </div>

            <PackageForm initialData={pkg} isEdit={true} />
        </div>
    );
}
