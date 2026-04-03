import NotificationForm from '@/components/dashboard/NotificationForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NotificationDetailService } from '@/services/crud.service';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit Notification | Dashboard',
};

type Params = Promise<{ id: string }>;

export default async function EditNotificationPage({ params }: { params: Params }) {
    const { id } = await params;
    const notification = await NotificationDetailService.getNotificationById(id);

    if (!notification) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/notifications">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-white drop-shadow-sm">Edit Notification</h1>
                    <p className="text-sm text-white/50 font-light mt-1">Update messaging, audience, and publish state.</p>
                </div>
            </div>

            <NotificationForm initialData={notification} isEdit={true} />
        </div>
    );
}
