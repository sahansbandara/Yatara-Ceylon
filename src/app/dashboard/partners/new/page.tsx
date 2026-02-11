import PartnerForm from '@/components/dashboard/PartnerForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Add Partner | Dashboard',
};

export default function AddPartnerPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/partners">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New Partner</h1>
                    <p className="text-muted-foreground">Register a new guide, hotel, driver, or supplier.</p>
                </div>
            </div>

            <PartnerForm />
        </div>
    );
}
