import UserForm from '@/components/dashboard/UserForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Add User | Dashboard',
};

export default function AddUserPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/users">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New User</h1>
                    <p className="text-muted-foreground">Create a new system user.</p>
                </div>
            </div>

            <UserForm />
        </div>
    );
}
