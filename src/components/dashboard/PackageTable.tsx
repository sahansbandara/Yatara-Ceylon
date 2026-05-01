'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Edit, Eye, EyeOff, Search, Star, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTableSort } from '@/hooks/useTableSort';
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
    const { sortedData } = useTableSort(packages, {
        key: 'title',
        direction: 'asc',
    });

    const visiblePackages = useMemo(() => {
        return sortedData.filter((pkg) => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
                pkg.title.toLowerCase().includes(q) ||
                pkg.slug.toLowerCase().includes(q) ||
                (pkg.duration || '').toLowerCase().includes(q)
            );
        });
    }, [sortedData, searchQuery]);

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
            {/* Search Bar & Actions */}
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between gap-4 flex-wrap">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search packages by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-antique-gold/20 transition-all"
                    />
                </div>
                {visiblePackages.length > 0 && (
                    <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/60 cursor-pointer hover:text-white transition-colors bg-white/[0.02] px-3 py-2 rounded-lg border border-white/[0.05]">
                        <input
                            type="checkbox"
                            checked={allVisibleSelected}
                            onChange={toggleSelectAll}
                            className="h-4 w-4 cursor-pointer rounded accent-antique-gold bg-white/5 border-white/20"
                        />
                        <span>Select All</span>
                    </label>
                )}
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

            {/* Package Cards Grid */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {visiblePackages.length > 0 ? (
                        visiblePackages.map((pkg) => (
                            <div
                                key={pkg._id}
                                className="group relative overflow-hidden rounded-3xl h-[340px] destination-card-shine ring-1 ring-white/[0.08] hover:ring-antique-gold/30 transition-all duration-500 shadow-xl cursor-default will-change-transform"
                            >
                                {/* Selection Indicator Outline */}
                                <div className={`absolute inset-0 rounded-3xl transition-all duration-300 pointer-events-none z-20 ${selectedIds.has(pkg._id) ? 'ring-2 ring-antique-gold/80 bg-antique-gold/[0.05]' : ''}`} />

                                <div className="relative w-full h-full overflow-hidden">
                                    {/* Background Image */}
                                    {pkg.images && pkg.images.length > 0 && pkg.images[0]?.trim() ? (
                                        <img
                                            src={pkg.images[0]}
                                            alt={pkg.title}
                                            className={`object-cover w-full h-full absolute inset-0 transform group-hover:scale-[1.05] transition-transform duration-1000 ease-out will-change-transform ${selectedIds.has(pkg._id) ? 'scale-[1.02]' : ''}`}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full absolute inset-0 bg-white/5 shadow-inner">
                                            <span className="text-[10px] uppercase tracking-wider text-white/30">No Image</span>
                                        </div>
                                    )}

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#021a10] via-[#021a10]/40 to-black/30 opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Top Left: Selection Checkbox */}
                                    <div className="absolute top-4 left-4 z-30">
                                        <label className={`cursor-pointer w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${selectedIds.has(pkg._id) ? 'bg-antique-gold border-antique-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-black/40 border-white/20 hover:bg-black/60 hover:border-white/40'}`}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(pkg._id)}
                                                onChange={() => toggleSelect(pkg._id)}
                                                className="absolute opacity-0 cursor-pointer h-0 w-0"
                                                aria-label={`Select ${pkg.title}`}
                                            />
                                            {selectedIds.has(pkg._id) && (
                                                <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </label>
                                    </div>

                                    {/* Top Right: Status Badge */}
                                    <div className="absolute top-4 right-4 z-30 space-y-2 flex flex-col items-end">
                                        <span className={`inline-flex px-3 py-1.5 text-[9px] tracking-[0.2em] shadow-lg shadow-black/20 uppercase font-medium rounded-full backdrop-blur-md border ${pkg.isPublished ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' : 'text-white/60 bg-white/10 border-white/20'}`}>
                                            {pkg.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                        {pkg.isFeatured && (
                                            <span className="inline-flex items-center px-3 py-1.5 text-[9px] tracking-[0.2em] shadow-lg shadow-black/20 uppercase font-medium rounded-full backdrop-blur-md border text-antique-gold bg-antique-gold/15 border-antique-gold/30">
                                                <Star className="h-2.5 w-2.5 mr-1 fill-antique-gold text-antique-gold" />
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    {/* Hover Actions (Center) */}
                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 z-30 translate-y-4 group-hover:translate-y-0">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-12 w-12 text-white hover:text-emerald-400 hover:bg-white/10 rounded-full bg-black/50 backdrop-blur-md border border-white/20"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); togglePublish(pkg); }}
                                            title={pkg.isPublished ? 'Unpublish' : 'Publish'}
                                            disabled={loading}
                                        >
                                            {pkg.isPublished ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-12 w-12 text-white hover:text-blue-400 hover:bg-white/10 rounded-full bg-black/50 backdrop-blur-md border border-white/20"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/dashboard/packages/${pkg._id}`); }}
                                            title="Edit Package"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-12 w-12 text-white hover:text-red-400 hover:bg-white/10 rounded-full bg-black/50 backdrop-blur-md border border-white/20"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(pkg._id); }}
                                            disabled={loading}
                                            title="Archive Package"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>

                                    {/* Glass info panel — bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 z-10 transition-transform duration-500">
                                        <div className="liquid-glass-panel rounded-t-2xl px-5 py-4 border-t border-white/[0.05]">
                                            <h3 className="text-xl font-serif text-white mb-1 group-hover:text-antique-gold transition-colors duration-500 leading-tight line-clamp-1">
                                                {pkg.title}
                                            </h3>
                                            <p className="text-[10px] tracking-[0.15em] text-white/50 font-light flex items-center gap-2">
                                                <span className="uppercase">{pkg.duration}</span>
                                                <span className="w-1 h-1 rounded-full bg-white/30" />
                                                <span className="text-white/80 font-medium">LKR {(pkg.priceMin ?? pkg.price ?? 0).toLocaleString()}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center flex flex-col items-center justify-center liquid-glass-panel rounded-3xl border border-white/[0.05]">
                            <div className="h-20 w-20 mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <Search className="h-8 w-8 text-white/30" />
                            </div>
                            <h3 className="text-xl font-serif text-white/90 mb-2">No packages found</h3>
                            <p className="text-sm text-white/40 max-w-md">
                                {searchQuery.trim()
                                    ? `We couldn't find any packages matching "${searchQuery}". Try adjusting your search.`
                                    : 'You haven\'t created any packages yet. Click "Create Package" to get started.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
