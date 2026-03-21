'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin?: string;
    createdAt: string;
}

interface UserTableProps {
    initialUsers: User[];
}

export default function UserTable({ initialUsers }: UserTableProps) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(users.filter(u => u._id !== id));
                router.refresh(); // Refresh server data
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting user');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        if (!confirm(`Are you sure you want to mark this account as ${newStatus}?`)) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u));
                router.refresh();
            } else {
                alert(`Failed to update status`);
            }
        } catch (error) {
            console.error(error);
            alert('Error updating user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="liquid-glass-panel rounded-xl overflow-hidden border border-white/10">
            <Table>
                <TableHeader className="bg-black/20">
                    <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-white/60 font-medium">Name</TableHead>
                        <TableHead className="text-white/60 font-medium">Email</TableHead>
                        <TableHead className="text-white/60 font-medium">Role</TableHead>
                        <TableHead className="text-white/60 font-medium">Status</TableHead>
                        <TableHead className="text-white/60 font-medium">Last Login</TableHead>
                        <TableHead className="text-white/60 font-medium text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <TableRow key={user._id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                                <TableCell className="font-medium text-off-white">{user.name}</TableCell>
                                <TableCell className="text-white/70">{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className={user.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-white/70'}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {user.status === 'ACTIVE' ? (
                                        <div className="flex items-center text-emerald-400 text-sm font-medium">
                                            <CheckCircle className="h-4 w-4 mr-1.5" /> Active
                                        </div>
                                    ) : user.status === 'PENDING_APPROVAL' ? (
                                        <div className="flex items-center text-amber-400 text-sm font-medium bg-amber-400/10 px-2 py-0.5 rounded-full w-fit border border-amber-400/20">
                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mr-2 animate-pulse" /> Pending
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-red-400 text-sm font-medium">
                                            <XCircle className="h-4 w-4 mr-1.5" /> {user.status}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-white/50 text-sm">
                                    {user.lastLogin ? format(new Date(user.lastLogin), 'MMM d, h:mm a') : 'Never'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {user.status === 'PENDING_APPROVAL' ? (
                                            <>
                                                <Button size="sm" variant="ghost" className="h-8 text-emerald-400 border border-emerald-500/30 hover:text-emerald-300 hover:bg-emerald-500/10" onClick={() => handleStatusChange(user._id, 'ACTIVE')} disabled={loading}>
                                                    Approve
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-8 text-red-400 border border-red-500/30 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleStatusChange(user._id, 'REJECTED')} disabled={loading}>
                                                    Reject
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10" onClick={() => router.push(`/dashboard/users/${user._id}`)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                    onClick={() => handleDelete(user._id)}
                                                    disabled={loading}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="border-none hover:bg-transparent">
                            <TableCell colSpan={6} className="h-32 text-center text-white/40">
                                No users found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
