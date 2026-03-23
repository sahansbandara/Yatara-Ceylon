import { Button } from '@/components/ui/button';
import UserTable from '@/components/dashboard/UserTable';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { StatCard } from '@/components/dashboard/StatCard';
import { GlassPanel } from '@/components/dashboard/GlassPanel';
import { Plus, Users, Shield, UserCog, UserCircle } from 'lucide-react';
import Link from 'next/link';

async function getUsers() {
    try {
        await connectDB();
        const users = await User.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
    }
}

export default async function UsersPage() {
    const users = await getUsers();

    const totalUsers = users.length;
    const adminCount = users.filter((u: any) => u.role === 'ADMIN').length;
    const staffCount = users.filter((u: any) => u.role === 'STAFF').length;
    const customerCount = users.filter((u: any) => u.role === 'USER').length;

    return (
        <div className="flex flex-col gap-6 p-6">
            <DashboardHero
                title="Users"
                subtitle={`${totalUsers} total users`}
                action={
                    <Link href="/dashboard/users/new">
                        <Button className="bg-antique-gold hover:bg-antique-gold/90 text-deep-emerald font-semibold tracking-wider text-xs rounded-lg">
                            <Plus className="mr-2 h-4 w-4" /> Add User
                        </Button>
                    </Link>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Users"
                    value={totalUsers.toString()}
                    icon={Users}
                    accentColor="text-blue-400"
                />
                <StatCard
                    title="Admins"
                    value={adminCount.toString()}
                    icon={Shield}
                    accentColor="text-purple-400"
                />
                <StatCard
                    title="Staff"
                    value={staffCount.toString()}
                    icon={UserCog}
                    accentColor="text-amber-400"
                />
                <StatCard
                    title="Customers"
                    value={customerCount.toString()}
                    icon={UserCircle}
                    accentColor="text-emerald-400"
                />
            </div>

            <GlassPanel>
                <UserTable initialUsers={users} />
            </GlassPanel>
        </div>
    );
}
