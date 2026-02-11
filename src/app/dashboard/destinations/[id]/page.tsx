import DestinationForm from '@/components/dashboard/DestinationForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Destination from '@/models/Destination';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit Destination | Dashboard',
};

async function getDestination(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
    try {
        await connectDB();
        const dest = await Destination.findById(id).lean();
        if (!dest) return null;
        return JSON.parse(JSON.stringify(dest));
    } catch (error) {
        console.error("Failed to fetch destination:", error);
        return null;
    }
}

// Params type definition for Next.js 15+
type Params = Promise<{ id: string }>;

export default async function EditDestinationPage({ params }: { params: Params }) {
    const { id } = await params;
    const dest = await getDestination(id);

    if (!dest) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/destinations">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Destination</h1>
                    <p className="text-muted-foreground">Update destination details.</p>
                </div>
            </div>

            <DestinationForm initialData={dest} isEdit={true} />
        </div>
    );
}
