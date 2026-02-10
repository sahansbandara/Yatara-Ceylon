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
    isActive: boolean;
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

    return (
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {user.isActive ? (
                                        <div className="flex items-center text-green-600">
                                            <CheckCircle className="h-4 w-4 mr-1" /> Active
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-red-600">
                                            <XCircle className="h-4 w-4 mr-1" /> Inactive
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {user.lastLogin ? format(new Date(user.lastLogin), 'MMM d, h:mm a') : 'Never'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" onClick={() => router.push(`/dashboard/users/${user._id}`)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-red-600"
                                            onClick={() => handleDelete(user._id)}
                                            disabled={loading}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No users found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
