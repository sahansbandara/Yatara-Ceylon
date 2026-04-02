import NotificationTable from '@/components/dashboard/NotificationTable';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { StatCard } from '@/components/dashboard/StatCard';
import { GlassPanel } from '@/components/dashboard/GlassPanel';
import { Button } from '@/components/ui/button';
import { Plus, Bell, AlertCircle, Gift } from 'lucide-react';
import Link from 'next/link';

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

    const totalNotifications = notifications.length;
    const alertCount = notifications.filter((n: any) => n.type === 'ALERT').length;
    const offerCount = notifications.filter((n: any) => n.type === 'OFFER').length;

    return (
        <div className="flex flex-col gap-6 p-6">
            <DashboardHero
                title="Notifications"
                subtitle={`${totalNotifications} total notifications`}
                action={
                    <Link href="/dashboard/notifications/new">
                        <Button variant="glass">
                            <Plus className="mr-2 h-4 w-4" /> Compose
                        </Button>
                    </Link>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Total Sent"
                    value={totalNotifications.toString()}
                    icon={Bell}
                    accentColor="text-blue-400"
                />
                <StatCard
                    title="Alerts"
                    value={alertCount.toString()}
                    icon={AlertCircle}
                    accentColor="text-red-400"
                />
                <StatCard
                    title="Offers"
                    value={offerCount.toString()}
                    icon={Gift}
                    accentColor="text-amber-400"
                />
            </div>

            <GlassPanel>
                <NotificationTable initialNotifications={notifications} />
            </GlassPanel>
        </div>
    );
}
