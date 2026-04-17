import PackageForm from '@/components/dashboard/PackageForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Add Package | Dashboard',
};

export default function AddPackagePage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/packages">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New Package</h1>
                    <p className="text-muted-foreground">Create a new tour package.</p>
                </div>
            </div>

            <PackageForm />
        </div>
    );
}
