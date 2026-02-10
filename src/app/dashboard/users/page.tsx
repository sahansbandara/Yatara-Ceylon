import { Button } from '@/components/ui/button';
import UserTable from '@/components/dashboard/UserTable';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { Plus } from 'lucide-react';
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

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">Manage system users and their roles.</p>
                </div>
                <Link href="/dashboard/users/new">
                    <Button className="bg-ocean-600 hover:bg-ocean-700">
                        <Plus className="mr-2 h-4 w-4" /> Add User
                    </Button>
                </Link>
            </div>

            <UserTable initialUsers={users} />
        </div>
    );
}
