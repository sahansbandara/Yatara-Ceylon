'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Edit, Eye, EyeOff, Search, Star, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from './SortableHeader';
import { downloadCsv } from '@/lib/export-utils';

interface Package {
    _id: string;
    title: string;
    slug: string;
    price?: number;
    priceMin?: number;
    duration: string;
    durationDays?: number;
    images?: string[];
    isPublished: boolean;
    isFeatured?: boolean;
}

interface PackageTableProps {
    initialPackages: Package[];
}

type BulkAction = 'publish' | 'unpublish' | 'archive';

export default function PackageTable({ initialPackages }: PackageTableProps) {
    const [packages, setPackages] = useState<Package[]>(initialPackages);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const { sortedData, sortConfig, requestSort } = useTableSort(packages, {
        key: 'title',
        direction: 'asc',
    });

    const visiblePackages = sortedData.filter((pkg) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            pkg.title.toLowerCase().includes(q) ||
            pkg.slug.toLowerCase().includes(q) ||
            (pkg.duration || '').toLowerCase().includes(q)
        );
    });
    const allVisibleSelected =
        visiblePackages.length > 0 &&
        visiblePackages.every((pkg) => selectedIds.has(pkg._id));

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
                visiblePackages.forEach((pkg) => next.delete(pkg._id));
                return next;
            }

            const next = new Set(prev);
            visiblePackages.forEach((pkg) => next.add(pkg._id));
            return next;
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to archive this package?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
                setSelectedIds((prev) => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
                router.refresh();
            } else {
                alert('Failed to archive package');
            }
        } catch (error) {
            console.error(error);
            alert('Error archiving package');
        } finally {
            setLoading(false);
        }
    };

    const togglePublish = async (pkg: Package) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/packages/${pkg._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublished: !pkg.isPublished }),
            });

            if (res.ok) {
                setPackages((prev) =>
                    prev.map((item) =>
                        item._id === pkg._id
                            ? { ...item, isPublished: !pkg.isPublished }
                            : item
                    )
                );
                router.refresh();
            } else {
                alert('Failed to update package status');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating package status');
        } finally {
            setLoading(false);
        }
    };

    const handleBulkAction = async (action: BulkAction) => {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;

        const confirmMessage =
            action === 'archive'
                ? `Archive ${ids.length} selected package(s)?`
                : `${action === 'publish' ? 'Publish' : 'Unpublish'} ${ids.length} selected package(s)?`;

        if (!confirm(confirmMessage)) return;

        setLoading(true);
        try {
            const res = await fetch('/api/packages/bulk', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids, action }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Bulk action failed');
            }

            setPackages((prev) => {
                if (action === 'archive') {
                    return prev.filter((pkg) => !selectedIds.has(pkg._id));
                }

                return prev.map((pkg) =>
                    selectedIds.has(pkg._id)
                        ? { ...pkg, isPublished: action === 'publish' }
                        : pkg
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
        const rows = packages
            .filter((pkg) => selectedIds.has(pkg._id))
            .map((pkg) => ({
                title: pkg.title,
                slug: pkg.slug,
                price_lkr: pkg.priceMin ?? pkg.price ?? 0,
                duration: pkg.duration,
                published: pkg.isPublished,
                featured: pkg.isFeatured ?? false,
            }));

        downloadCsv('packages-export.csv', rows);
    };

    return (
        <div className="dashboard-table-glass overflow-hidden rounded-2xl w-full">
            {/* Search Bar */}
            <div className="px-5 py-4 border-b border-white/[0.06]">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search packages by name..."
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
                                    aria-label="Select all packages"
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
                                label="Price"
                                sortKey="priceMin"
                                currentKey={sortConfig.key}
                                direction={sortConfig.direction}
                                onSort={requestSort}
                            />
                            <SortableHeader
                                label="Duration"
                                sortKey="durationDays"
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
                        {visiblePackages.length > 0 ? (
                            visiblePackages.map((pkg) => (
                                <tr
                                    key={pkg._id}
                                    className={`border-b border-white/[0.04] last:border-b-0 transition-colors hover:bg-antique-gold/[0.03] ${selectedIds.has(pkg._id) ? 'bg-antique-gold/[0.04]' : ''
                                        }`}
                                >
                                    <td className="px-3 py-3.5">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(pkg._id)}
                                            onChange={() => toggleSelect(pkg._id)}
                                            className="h-3.5 w-3.5 cursor-pointer rounded accent-antique-gold"
                                            aria-label={`Select ${pkg.title}`}
                                        />
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="relative h-10 w-14 rounded overflow-hidden bg-white/5 border border-white/10">
                                            {pkg.images && pkg.images.length > 0 && pkg.images[0]?.trim() ? (
                                                <img
                                                    src={pkg.images[0]}
                                                    alt={pkg.title}
                                                    className="object-cover w-full h-full absolute inset-0"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-[9px] uppercase tracking-wider text-white/20">
                                                    No Img
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 font-medium">
                                        <div className="flex flex-col">
                                            <span className="text-white/85 text-xs">{pkg.title}</span>
                                            <span className="text-[10px] text-white/35 mt-0.5">
                                                /{pkg.slug}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-xs font-bold text-white/85">
                                            LKR {(pkg.priceMin ?? pkg.price ?? 0).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-white/60 text-xs">{pkg.duration}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex gap-2 items-center">
                                            <span
                                                className={`status-pill ${pkg.isPublished
                                                    ? 'status-pill-success'
                                                    : 'status-pill-neutral'
                                                    }`}
                                            >
                                                {pkg.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                            {pkg.isFeatured && (
                                                <span className="status-pill status-pill-gold flex items-center pr-2.5">
                                                    <Star className="h-2.5 w-2.5 mr-1 fill-antique-gold text-antique-gold" />
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                                onClick={() => togglePublish(pkg)}
                                                title={pkg.isPublished ? 'Unpublish' : 'Publish'}
                                                disabled={loading}
                                            >
                                                {pkg.isPublished ? (
                                                    <Eye className="h-4 w-4" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-white/40 hover:text-antique-gold hover:bg-white/10 transition-colors"
                                                onClick={() => router.push(`/dashboard/packages/${pkg._id}`)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                onClick={() => handleDelete(pkg._id)}
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
                                    colSpan={7}
                                    className="px-5 py-12 text-center text-white/40 text-sm"
                                >
                                    {searchQuery.trim()
                                        ? <div><span className="text-white/60 font-medium">No packages found</span><br /><span className="text-white/30 text-xs">Try a different search term</span></div>
                                        : 'No packages found.'
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
