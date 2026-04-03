import UserForm from '@/components/dashboard/UserForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { UserDetailService } from '@/services/crud.service';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit User | Dashboard',
};

// Params type definition for Next.js 15+
type Params = Promise<{ id: string }>;

export default async function EditUserPage({ params }: { params: Params }) {
    const { id } = await params;
    const user = await UserDetailService.getUserById(id);

    if (!user) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/users">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
                    <p className="text-muted-foreground">Update user details and permissions.</p>
                </div>
            </div>

            <UserForm initialData={user} isEdit={true} />
        </div>
    );
}
