'use client';

import { useMemo, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    AlertCircle,
    Download,
    Edit,
    PauseCircle,
    Send,
    Trash2,
    X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from './SortableHeader';
import { downloadCsv } from '@/lib/export-utils';

type NotificationStatusFilter = 'ALL' | 'PUBLISHED' | 'DRAFT';
type NotificationTypeFilter = 'ALL' | 'ALERT' | 'OFFER' | 'UPDATE';
type BulkAction = 'publish' | 'unpublish' | 'archive';

interface NotificationRow {
    _id: string;
    title: string;
    body: string;
    type: 'ALERT' | 'OFFER' | 'UPDATE';
    visibleTo: string;
    isPublished: boolean;
    createdAt: string;
    publishFrom?: string;
    publishTo?: string;
}

export default function NotificationTable({
    initialNotifications,
}: {
    initialNotifications: NotificationRow[];
}) {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<NotificationStatusFilter>('ALL');
    const [typeFilter, setTypeFilter] = useState<NotificationTypeFilter>('ALL');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const filteredNotifications = useMemo(() => {
        return notifications.filter((notification) => {
            const term = query.trim().toLowerCase();
            const matchesQuery =
                !term ||
                notification.title?.toLowerCase().includes(term) ||
                notification.body?.toLowerCase().includes(term) ||
                notification.type?.toLowerCase().includes(term) ||
                notification.visibleTo?.toLowerCase().includes(term);
            const matchesStatus =
                statusFilter === 'ALL' ||
                (statusFilter === 'PUBLISHED'
                    ? notification.isPublished
                    : !notification.isPublished);
            const matchesType =
                typeFilter === 'ALL' || notification.type === typeFilter;

            return matchesQuery && matchesStatus && matchesType;
        });
    }, [notifications, query, statusFilter, typeFilter]);

    const { sortedData, sortConfig, requestSort } = useTableSort(
        filteredNotifications,
        {
            key: 'createdAt',
            direction: 'desc',
        }
    );

    const visibleNotifications = sortedData;
    const allVisibleSelected =
        visibleNotifications.length > 0 &&
        visibleNotifications.every((notification) => selectedIds.has(notification._id));

    const clearSelection = () => setSelectedIds(new Set());

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        setSelectedIds((prev) => {
            if (allVisibleSelected) {
                const next = new Set(prev);
                visibleNotifications.forEach((notification) => next.delete(notification._id));
                return next;
            }

            const next = new Set(prev);
            visibleNotifications.forEach((notification) => next.add(notification._id));
            return next;
        });
    };

    const togglePublish = async (id: string, isPublished: boolean) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/notifications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublished: !isPublished }),
            });
            if (res.ok) {
                setNotifications((prev) =>
                    prev.map((notification) =>
                        notification._id === id
                            ? { ...notification, isPublished: !isPublished }
                            : notification
                    )
                );
                router.refresh();
            } else {
                alert('Failed to update notification');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to update notification');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to archive this notification?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setNotifications((prev) =>
                    prev.filter((notification) => notification._id !== id)
                );
                setSelectedIds((prev) => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
                router.refresh();
            } else {
                alert('Failed to archive notification');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to archive notification');
        } finally {
            setLoading(false);
        }
    };

    const handleBulkAction = async (action: BulkAction) => {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;

        const confirmMessage =
            action === 'archive'
                ? `Archive ${ids.length} selected notification(s)?`
                : `${action === 'publish' ? 'Publish' : 'Unpublish'} ${ids.length} selected notification(s)?`;

        if (!confirm(confirmMessage)) return;

        setLoading(true);
        try {
            const res = await fetch('/api/notifications/bulk', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids, action }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Bulk action failed');
            }

            setNotifications((prev) => {
                if (action === 'archive') {
                    return prev.filter((notification) => !selectedIds.has(notification._id));
                }

                return prev.map((notification) =>
                    selectedIds.has(notification._id)
                        ? { ...notification, isPublished: action === 'publish' }
                        : notification
                );
            });
            clearSelection();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Bulk action failed');
        } finally {
            setLoading(false);
        }
    };

    const exportSelected = () => {
        const rows = notifications
            .filter((notification) => selectedIds.has(notification._id))
            .map((notification) => ({
                title: notification.title,
                type: notification.type,
                audience: notification.visibleTo,
                published: notification.isPublished,
                created_at: notification.createdAt,
                publish_from: notification.publishFrom || '',
                publish_to: notification.publishTo || '',
                body: notification.body,
            }));

        downloadCsv('notifications-export.csv', rows);
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="border-b border-white/10 p-4 space-y-3">
                <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search notifications by title, body, type, or audience"
                    className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/30"
                />
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-3 md:flex-row">
                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value as NotificationStatusFilter
                                )
                            }
                            className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
                        >
                            <option value="ALL" className="bg-[#08110d] text-white">
                                All statuses
                            </option>
                            <option value="PUBLISHED" className="bg-[#08110d] text-white">
                                Published
                            </option>
                            <option value="DRAFT" className="bg-[#08110d] text-white">
                                Drafts
                            </option>
                        </select>
                        <select
                            value={typeFilter}
                            onChange={(event) =>
                                setTypeFilter(event.target.value as NotificationTypeFilter)
                            }
                            className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
                        >
                            <option value="ALL" className="bg-[#08110d] text-white">
                                All types
                            </option>
                            <option value="ALERT" className="bg-[#08110d] text-white">
                                Alerts
                            </option>
                            <option value="OFFER" className="bg-[#08110d] text-white">
                                Offers
                            </option>
                            <option value="UPDATE" className="bg-[#08110d] text-white">
                                Updates
                            </option>
                        </select>
                    </div>
                    <p className="text-xs text-white/35">
                        Showing {filteredNotifications.length} of {notifications.length} notifications
                    </p>
                </div>
            </div>

            {selectedIds.size > 0 && (
                <div className="flex flex-col gap-3 border-b border-white/10 bg-antique-gold/[0.05] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-antique-gold/80">
                            {selectedIds.size} selected
                        </span>
                        <button
                            type="button"
                            onClick={clearSelection}
                            className="inline-flex items-center gap-1 text-xs text-white/45 transition-colors hover:text-white/70"
                        >
                            <X className="h-3.5 w-3.5" />
                            Clear
                        </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={loading}
                            className="h-8 border border-emerald-500/30 bg-emerald-500/10 px-3 text-[11px] text-emerald-300 hover:bg-emerald-500/20"
                            onClick={() => handleBulkAction('publish')}
                        >
                            Publish
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={loading}
                            className="h-8 border border-white/10 bg-white/[0.04] px-3 text-[11px] text-white/70 hover:bg-white/[0.08]"
                            onClick={() => handleBulkAction('unpublish')}
                        >
                            Unpublish
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={loading}
                            className="h-8 border border-red-500/30 bg-red-500/10 px-3 text-[11px] text-red-300 hover:bg-red-500/20"
                            onClick={() => handleBulkAction('archive')}
                        >
                            Archive
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={loading}
                            className="h-8 border border-antique-gold/30 bg-antique-gold/10 px-3 text-[11px] text-antique-gold hover:bg-antique-gold/20"
                            onClick={exportSelected}
                        >
                            <Download className="mr-1.5 h-3.5 w-3.5" />
                            Export CSV
                        </Button>
                    </div>
                </div>
            )}

            <Table>
                <TableHeader className="bg-black/40">
                    <TableRow className="border-white/5 hover:bg-transparent">
                        <th className="w-[44px] px-4 py-3.5 text-left">
                            <input
                                type="checkbox"
                                checked={allVisibleSelected}
                                onChange={toggleSelectAll}
                                className="h-3.5 w-3.5 cursor-pointer rounded accent-antique-gold"
                                aria-label="Select all notifications"
                            />
                        </th>
                        <SortableHeader
                            label="Title"
                            sortKey="title"
                            currentKey={sortConfig.key}
                            direction={sortConfig.direction}
                            onSort={requestSort}
                        />
                        <SortableHeader
                            label="Type"
                            sortKey="type"
                            currentKey={sortConfig.key}
                            direction={sortConfig.direction}
                            onSort={requestSort}
                        />
                        <SortableHeader
                            label="Audience"
                            sortKey="visibleTo"
                            currentKey={sortConfig.key}
                            direction={sortConfig.direction}
                            onSort={requestSort}
                        />
                        <SortableHeader
                            label="Status"
                            sortKey="isPublished"
                            currentKey={sortConfig.key}
                            direction={sortConfig.direction}
                            onSort={requestSort}
                        />
                        <SortableHeader
                            label="Date"
                            sortKey="createdAt"
                            currentKey={sortConfig.key}
                            direction={sortConfig.direction}
                            onSort={requestSort}
                        />
                        <th className="text-white/50 font-medium text-right px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase">
                            Actions
                        </th>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {visibleNotifications.length > 0 ? (
                        visibleNotifications.map((notification) => (
                            <TableRow
                                key={notification._id}
                                className={`border-white/5 transition-colors hover:bg-white/[0.02] ${
                                    selectedIds.has(notification._id)
                                        ? 'bg-antique-gold/[0.04]'
                                        : ''
                                }`}
                            >
                                <TableCell className="w-[44px] px-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(notification._id)}
                                        onChange={() => toggleSelect(notification._id)}
                                        className="h-3.5 w-3.5 cursor-pointer rounded accent-antique-gold"
                                        aria-label={`Select ${notification.title}`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium text-white/90">
                                    <div className="flex flex-col">
                                        <span>{notification.title}</span>
                                        <span className="text-xs text-white/40 truncate max-w-xs">
                                            {notification.body}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={`${
                                            notification.type === 'ALERT'
                                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                                                : notification.type === 'OFFER'
                                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                                                  : 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                                        }`}
                                    >
                                        {notification.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-white/70 text-sm">
                                    {notification.visibleTo}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            notification.isPublished
                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                                                : 'bg-white/10 text-white/60 border-white/10'
                                        }
                                    >
                                        {notification.isPublished ? 'Published' : 'Draft'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-white/50 text-sm">
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                                            onClick={() =>
                                                router.push(`/dashboard/notifications/${notification._id}`)
                                            }
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className={`h-8 w-8 ${
                                                notification.isPublished
                                                    ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10'
                                                    : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10'
                                            }`}
                                            onClick={() =>
                                                togglePublish(
                                                    notification._id,
                                                    notification.isPublished
                                                )
                                            }
                                            disabled={loading}
                                        >
                                            {notification.isPublished ? (
                                                <PauseCircle className="h-4 w-4" />
                                            ) : (
                                                <Send className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
                                            onClick={() => handleDelete(notification._id)}
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
                            <TableCell colSpan={7} className="h-32 text-center text-white/40">
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
