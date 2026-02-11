import DestinationForm from '@/components/dashboard/DestinationForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Add Destination | Dashboard',
};

export default function AddDestinationPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/destinations">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New Destination</h1>
                    <p className="text-muted-foreground">Create a new travel destination.</p>
                </div>
            </div>

            <DestinationForm />
        </div>
    );
}
