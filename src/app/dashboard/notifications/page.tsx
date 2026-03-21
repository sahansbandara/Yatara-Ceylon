import NotificationTable from '@/components/dashboard/NotificationTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

export const metadata = { title: 'Notifications | Dashboard' };

async function getNotifications() {
    try {
        await connectDB();
        const notifications = await Notification.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(notifications));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function NotificationsPage() {
    const notifications = await getNotifications();

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-white drop-shadow-sm">Notifications</h1>
                    <p className="text-sm text-white/50 font-light mt-1">Manage system alerts, offers, and partner updates.</p>
                </div>
                <Link href="/dashboard/notifications/new">
                    <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0a1f15] font-semibold tracking-wider text-xs">
                        <Plus className="mr-2 h-4 w-4" /> Send Notification
                    </Button>
                </Link>
            </div>

            <NotificationTable initialNotifications={notifications} />
        </div>
    );
}
