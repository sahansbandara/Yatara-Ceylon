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
import { Trash2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotificationTable({ initialNotifications }: { initialNotifications: any[] }) {
    const [notifications, setNotifications] = useState(initialNotifications);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this notification?')) return;
        try {
            const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setNotifications(notifications.filter((n: any) => n._id !== id));
                router.refresh();
            }
        } catch (error) { console.error(error); }
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl shadow-xl overflow-hidden">
            <Table>
                <TableHeader className="bg-black/40">
                    <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="text-white/50 font-medium">Title</TableHead>
                        <TableHead className="text-white/50 font-medium">Type</TableHead>
                        <TableHead className="text-white/50 font-medium">Audience</TableHead>
                        <TableHead className="text-white/50 font-medium">Date</TableHead>
                        <TableHead className="text-white/50 font-medium text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {notifications.length > 0 ? (
                        notifications.map((notif: any) => (
                            <TableRow key={notif._id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                                <TableCell className="font-medium text-white/90">
                                    <div className="flex flex-col">
                                        <span>{notif.title}</span>
                                        <span className="text-xs text-white/40 truncate max-w-xs">{notif.body}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`
                                        ${notif.type === 'ALERT' ? 'bg-rose-500/20 text-rose-300 border-rose-500/50' :
                                            notif.type === 'OFFER' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' :
                                                'bg-blue-500/20 text-blue-300 border-blue-500/50'}
                                    `}>
                                        {notif.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-white/70 text-sm">{notif.visibleTo}</TableCell>
                                <TableCell className="text-white/50 text-sm">{new Date(notif.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10" onClick={() => handleDelete(notif._id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-white/40">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <AlertCircle className="h-6 w-6 opacity-50" />
                                    No notifications found.
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
