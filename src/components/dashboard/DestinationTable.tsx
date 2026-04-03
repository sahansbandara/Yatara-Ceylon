'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Edit, Eye, EyeOff, Search, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
// Using native <img> instead of next/image to handle potentially invalid URLs from DB
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from './SortableHeader';
import { downloadCsv } from '@/lib/export-utils';

interface Destination {
    _id: string;
    title: string;
    slug: string;
    location?: string;
    images: string[];
    isPublished: boolean;
}

interface DestinationTableProps {
    initialDestinations: Destination[];
}

type BulkAction = 'publish' | 'unpublish' | 'archive';

export default function DestinationTable({ initialDestinations }: DestinationTableProps) {
    const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const { sortedData, sortConfig, requestSort } = useTableSort(destinations, {
        key: 'title',
        direction: 'asc',
    });

    const visibleDestinations = sortedData.filter((dest) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            dest.title.toLowerCase().includes(q) ||
            dest.slug.toLowerCase().includes(q) ||
            (dest.location || '').toLowerCase().includes(q)
        );
    });
    const allVisibleSelected =
        visibleDestinations.length > 0 &&
        visibleDestinations.every((destination) => selectedIds.has(destination._id));

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
                visibleDestinations.forEach((destination) => next.delete(destination._id));
                return next;
            }

            const next = new Set(prev);
            visibleDestinations.forEach((destination) => next.add(destination._id));
            return next;
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to archive this destination?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/destinations/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setDestinations((prev) => prev.filter((destination) => destination._id !== id));
                setSelectedIds((prev) => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
                router.refresh();
            } else {
                alert('Failed to archive destination');
            }
        } catch (error) {
            console.error(error);
            alert('Error archiving destination');
        } finally {
            setLoading(false);
        }
    };

    const togglePublish = async (destination: Destination) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/destinations/${destination._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublished: !destination.isPublished }),
            });
            if (res.ok) {
                setDestinations((prev) =>
                    prev.map((item) =>
                        item._id === destination._id
                            ? { ...item, isPublished: !destination.isPublished }
                            : item
                    )
                );
                router.refresh();
            } else {
                alert('Failed to update destination status');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating destination status');
        } finally {
            setLoading(false);
        }
    };

    const handleBulkAction = async (action: BulkAction) => {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;

        const confirmMessage =
            action === 'archive'
                ? `Archive ${ids.length} selected destination(s)?`
                : `${action === 'publish' ? 'Publish' : 'Unpublish'} ${ids.length} selected destination(s)?`;

        if (!confirm(confirmMessage)) return;

        setLoading(true);
        try {
            const res = await fetch('/api/destinations/bulk', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids, action }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Bulk action failed');
            }

            setDestinations((prev) => {
                if (action === 'archive') {
                    return prev.filter((destination) => !selectedIds.has(destination._id));
                }

                return prev.map((destination) =>
                    selectedIds.has(destination._id)
                        ? { ...destination, isPublished: action === 'publish' }
                        : destination
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
        const rows = destinations
            .filter((destination) => selectedIds.has(destination._id))
            .map((destination) => ({
                title: destination.title,
                slug: destination.slug,
                location: destination.location || '',
                published: destination.isPublished,
            }));

        downloadCsv('destinations-export.csv', rows);
    };

    return (
        <div className="dashboard-table-glass overflow-hidden rounded-2xl w-full">
            {/* Search Bar */}
            <div className="px-5 py-4 border-b border-white/[0.06]">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search destinations by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-antique-gold/20 transition-all"
                    />
                </div>
            </div>
            {selectedIds.size > 0 && (
                <div className="flex flex-col gap-3 border-b border-white/[0.06] bg-antique-gold/[0.05] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
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

            <div className="overflow-x-auto w-full">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                            <th className="w-[44px] px-3 py-3.5 text-left">
                                <input
                                    type="checkbox"
                                    checked={allVisibleSelected}
                                    onChange={toggleSelectAll}
                                    className="h-3.5 w-3.5 cursor-pointer rounded accent-antique-gold"
                                    aria-label="Select all destinations"
                                />
                            </th>
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold w-[80px]">
                                Image
                            </th>
                            <SortableHeader
                                label="Title"
                                sortKey="title"
                                currentKey={sortConfig.key}
                                direction={sortConfig.direction}
                                onSort={requestSort}
                            />
                            <SortableHeader
                                label="Location"
                                sortKey="location"
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
                            <th className="text-right px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleDestinations.length > 0 ? (
                            visibleDestinations.map((destination) => (
                                <tr
                                    key={destination._id}
                                    className={`border-b border-white/[0.04] last:border-b-0 transition-colors hover:bg-antique-gold/[0.03] ${selectedIds.has(destination._id)
                                            ? 'bg-antique-gold/[0.04]'
                                            : ''
                                        }`}
                                >
                                    <td className="px-3 py-3.5">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(destination._id)}
                                            onChange={() => toggleSelect(destination._id)}
                                            className="h-3.5 w-3.5 cursor-pointer rounded accent-antique-gold"
                                            aria-label={`Select ${destination.title}`}
                                        />
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="relative h-10 w-14 rounded overflow-hidden bg-white/5 border border-white/10">
                                            {destination.images && destination.images[0]?.trim() ? (
                                                <img
                                                    src={destination.images[0]}
                                                    alt={destination.title}
                                                    className="object-cover w-full h-full absolute inset-0"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-[9px] uppercase tracking-wider text-white/20">
                                                    No Img
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white/85 text-xs">
                                                {destination.title}
                                            </span>
                                            <span className="text-[10px] text-white/35 mt-0.5">
                                                /{destination.slug}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-white/60 text-xs">
                                            {destination.location || '—'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span
                                            className={`status-pill ${destination.isPublished
                                                    ? 'status-pill-success'
                                                    : 'status-pill-neutral'
                                                }`}
                                        >
                                            {destination.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                                onClick={() => togglePublish(destination)}
                                                title={destination.isPublished ? 'Unpublish' : 'Publish'}
                                                disabled={loading}
                                            >
                                                {destination.isPublished ? (
                                                    <Eye className="h-4 w-4" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-white/40 hover:text-antique-gold hover:bg-white/10 transition-colors"
                                                onClick={() =>
                                                    router.push(`/dashboard/destinations/${destination._id}`)
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                onClick={() => handleDelete(destination._id)}
                                                disabled={loading}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-5 py-12 text-center text-white/40 text-sm"
                                >
                                    {searchQuery.trim()
                                        ? <div><span className="text-white/60 font-medium">No destinations found</span><br /><span className="text-white/30 text-xs">Try a different search term</span></div>
                                        : 'No destinations found.'
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
